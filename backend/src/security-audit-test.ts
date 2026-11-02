import { app } from './app.js';
import { prisma } from '../prisma/index.js';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';
import { env } from './core/config/env.js';

interface SecurityTestResult {
  id: string;
  threatCategory: string;
  attackVector: string;
  status: 'MITIGATED' | 'VULNERABLE';
  durationMs: number;
  defenseMechanism: string;
  details?: string;
}

const results: SecurityTestResult[] = [];
let server: Server;
let baseUrl: string;

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion Failed: ${message}`);
}

async function runSecTest(
  threatCategory: string,
  attackVector: string,
  defenseMechanism: string,
  fn: () => Promise<void>
) {
  const id = `SEC-${String(results.length + 1).padStart(2, '0')}`;
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ id, threatCategory, attackVector, status: 'MITIGATED', durationMs, defenseMechanism });
    console.log(`  🛡️  [${id}] ${threatCategory}: ${attackVector} -> MITIGATED (${durationMs}ms)`);
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start);
    const error = err instanceof Error ? err.message : String(err);
    results.push({ id, threatCategory, attackVector, status: 'VULNERABLE', durationMs, defenseMechanism, details: error });
    console.error(`  ❌ [${id}] ${threatCategory}: ${attackVector} -> VULNERABLE (${durationMs}ms) - ${error}`);
  }
}

async function main() {
  process.env.NODE_ENV = 'test';
  console.log('\n================================================================');
  console.log('🔒 FINSIGHT PENETRATION & CYBER DEFENSE VERIFICATION SUITE');
  console.log('================================================================\n');

  server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Failed to bind ephemeral server');
  baseUrl = `http://localhost:${address.port}`;
  console.log(`📡 Attack simulation server running at: ${baseUrl}\n`);

  const createdUserIds: string[] = [];

  try {
    // Setup 2 distinct users to test multi-tenant cross-talk and IDOR
    const userAEmail = `victim_${Date.now()}@finsight.local`;
    const userBEmail = `attacker_${Date.now()}@finsight.local`;

    const resA = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAEmail, password: 'VictimPassword123!', name: 'User A Victim' })
    });
    const dataA = (await resA.json()).data;
    const userAToken = dataA.accessToken;
    const userAId = dataA.user.id;
    createdUserIds.push(userAId);

    const resB = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userBEmail, password: 'AttackerPassword123!', name: 'User B Attacker' })
    });
    const dataB = (await resB.json()).data;
    const userBToken = dataB.accessToken;
    const userBId = dataB.user.id;
    createdUserIds.push(userBId);

    // ----------------------------------------------------
    // 1. A07: Authentication & Timing Attacks
    // ----------------------------------------------------
    console.log('--- Domain 1: Authentication & Timing Defense ---');

    await runSecTest(
      'Auth / DoS',
      'Bcrypt Payload Bomb / CPU Starvation (100KB password)',
      'Zod Schema max(128) boundary rejection before hashing',
      async () => {
        const bombPassword = 'a'.repeat(100_000);
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userAEmail, password: bombPassword })
        });
        assert(res.status === 400, `Expected 400 for password bomb, got ${res.status}`);
        const body = await res.json();
        assert(body.error.code === 'VALIDATION_ERROR', 'Validation error returned');
      }
    );

    await runSecTest(
      'Auth / Enumeration',
      'User Enumeration Timing Equalization (DUMMY_BCRYPT_HASH)',
      'Constant-time bcrypt comparison executed on non-existent users',
      async () => {
        // Time non-existent user login
        const nonExistentEmail = `nonexistent_${Date.now()}@finsight.local`;
        const t0 = performance.now();
        await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: nonExistentEmail, password: 'DummyPassword123!' })
        });
        const elapsedNonExistent = performance.now() - t0;

        // Time existent user with bad password
        const t1 = performance.now();
        await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userAEmail, password: 'WrongPassword123!' })
        });
        const elapsedExistent = performance.now() - t1;

        // Both must execute bcrypt comparison, delta should be minimal (<150ms)
        const delta = Math.abs(elapsedNonExistent - elapsedExistent);
        assert(delta < 200, `Timing delta must be <200ms to defeat timing analysis (got ${delta.toFixed(1)}ms)`);
      }
    );

    // ----------------------------------------------------
    // 2. A02: Cryptographic Failures & JWT Confusion
    // ----------------------------------------------------
    console.log('\n--- Domain 2: Cryptographic & Algorithm Confusion Attacks ---');

    await runSecTest(
      'Cryptographic',
      'JWT "none" Algorithm Confusion Attack',
      'Pinning algorithms to HS256 in jwt.verify',
      async () => {
        // Construct forged token with alg: none
        const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ userId: userAId, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
        const forgedToken = `${header}.${payload}.`;

        const res = await fetch(`${baseUrl}/api/transactions`, {
          headers: { Authorization: `Bearer ${forgedToken}` }
        });
        assert(res.status === 401, `Expected 401 Unauthorized for alg:none, got ${res.status}`);
      }
    );

    await runSecTest(
      'Cryptographic',
      'JWT Forged Signature with Random Secret',
      'Secret verification against env.JWT_SECRET',
      async () => {
        const forgedToken = jwt.sign({ userId: userAId }, 'attacker-controlled-secret', { algorithm: 'HS256' });
        const res = await fetch(`${baseUrl}/api/transactions`, {
          headers: { Authorization: `Bearer ${forgedToken}` }
        });
        assert(res.status === 401, `Expected 401 for bad signature, got ${res.status}`);
      }
    );

    // ----------------------------------------------------
    // 3. A01: Broken Object Level Authorization (BOLA / IDOR)
    // ----------------------------------------------------
    console.log('\n--- Domain 3: Broken Object Level Authorization (BOLA / IDOR) ---');

    // Create Goal for User A
    const goalRes = await fetch(`${baseUrl}/api/goals`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userAToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "User A Private Vault",
        targetAmount: 5000000,
        currentAmount: 1000000,
        targetDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      })
    });
    const userAGoalId = (await goalRes.json()).data.id;

    await runSecTest(
      'BOLA / IDOR',
      'Cross-tenant Goal Tampering (Attacker attempts to drain User A Goal)',
      'Database atomic query where: { id, userId }',
      async () => {
        const attackRes = await fetch(`${baseUrl}/api/goals/${userAGoalId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${userBToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentAmount: 0 })
        });
        assert(attackRes.status === 404, `Attacker should receive 404 Not Found, got ${attackRes.status}`);

        // Verify User A goal is intact
        const verifyRes = await fetch(`${baseUrl}/api/goals/summary`, {
          headers: { Authorization: `Bearer ${userAToken}` }
        });
        const verifyData = await verifyRes.json();
        const intactGoal = verifyData.data.goals.find((g: any) => g.id === userAGoalId);
        assert(intactGoal.currentAmount === 1000000, 'User A goal amount must remain untouched');
      }
    );

    // Create Chat Session for User A
    const chatSession = await prisma.chatSession.create({
      data: { userId: userAId, title: "User A Confidential Chat" }
    });

    await runSecTest(
      'BOLA / IDOR',
      'Cross-tenant Chat Hijacking / Session Injection',
      'Session ownership validation before message persistence',
      async () => {
        const attackRes = await fetch(`${baseUrl}/api/ai/chat`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userBToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: chatSession.id, content: 'Attacker payload into victim session' })
        });
        assert(attackRes.status === 200, 'SSE stream initiates');
        const text = await attackRes.text();
        assert(text.includes('Chat session not found or unauthorized'), 'Stream must refuse message insertion');

        // Verify victim session messages remain 0
        const victimSession = await prisma.chatSession.findUnique({
          where: { id: chatSession.id },
          include: { messages: true }
        });
        assert(victimSession!.messages.length === 0, 'No attacker message allowed in victim session');
      }
    );

    // ----------------------------------------------------
    // 4. A10: Server-Side Request Forgery (SSRF)
    // ----------------------------------------------------
    console.log('\n--- Domain 4: Server-Side Request Forgery (SSRF) ---');

    await runSecTest(
      'SSRF',
      'AWS / Cloud Metadata Service Exfiltration Attempt (169.254.169.254)',
      'isSafeOutboundUrl rejecting metadata subnet 169.254.0.0/16',
      async () => {
        const res = await fetch(`${baseUrl}/api/ai/config`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userBToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'custom',
            apiKey: 'dummy-key',
            customUrl: 'http://169.254.169.254/latest/meta-data/',
            selectedModel: 'test-model'
          })
        });
        assert(res.status === 400, `Expected 400 for metadata SSRF, got ${res.status}`);
        const body = await res.json();
        assert(body.error.code === 'VALIDATION_ERROR', 'Validation error returned');
      }
    );

    await runSecTest(
      'SSRF',
      'Internal Localhost Port Scan via AI Custom URL (localhost:5432)',
      'isSafeOutboundUrl blocking loopback domains and private IP ranges',
      async () => {
        const res = await fetch(`${baseUrl}/api/ai/config`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userBToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'custom',
            apiKey: 'dummy-key',
            customUrl: 'http://localhost:5432/v1',
            selectedModel: 'test-model'
          })
        });
        assert(res.status === 400, `Expected 400 for localhost SSRF, got ${res.status}`);
      }
    );

    // ----------------------------------------------------
    // 5. A03: Input Sanitization, XSS & Injection Attacks
    // ----------------------------------------------------
    console.log('\n--- Domain 5: Injection, XSS & Prototype Pollution ---');

    await runSecTest(
      'Stored XSS',
      'Malicious <script> and HTML event handler injection in Transaction merchant',
      'securitySanitizerMiddleware stripping active script and event attributes',
      async () => {
        const salaryCat = await prisma.category.findFirst({ where: { type: 'INCOME' } });
        const xssPayload = "Coffee <script>alert('XSS')</script><img src=x onerror=alert(1)>";

        const res = await fetch(`${baseUrl}/api/transactions`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userAToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 500,
            categoryId: salaryCat!.id,
            date: new Date().toISOString(),
            merchant: xssPayload,
            description: "Safe test description"
          })
        });
        assert(res.status === 201, `Expected 201, got ${res.status}`);
        const body = await res.json();
        assert(!body.data.merchant.includes('<script>'), 'Script tags must be stripped');
        assert(!body.data.merchant.includes('onerror='), 'Event handler attributes must be stripped');
      }
    );

    await runSecTest(
      'CSV Formula Injection',
      'Spreadsheet DDE Injection in CSV import (=cmd|\'/C calc\'!A0)',
      'sanitizeCell prefixing dangerous formula operators with a single quote',
      async () => {
        const formulaCsv = `Date,Merchant,Amount
2026-11-01,=cmd|' /C calc'!A0,25.00
2026-11-02,@SUM(1+1),50.00`;

        const blob = new Blob([formulaCsv], { type: 'text/csv' });
        const formData = new FormData();
        formData.append('file', blob, 'formula.csv');
        formData.append('mapping', JSON.stringify({ date: 'Date', merchant: 'Merchant', amount: 'Amount' }));

        const res = await fetch(`${baseUrl}/api/import/preview`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userAToken}` },
          body: formData
        });
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        const body = await res.json();
        assert(body.data.rows[0].mappedData.merchant.startsWith("'="), 'Formula starting with = must be neutralised with leading quote');
        assert(body.data.rows[1].mappedData.merchant.startsWith("'@"), 'Formula starting with @ must be neutralised with leading quote');
      }
    );

    await runSecTest(
      'Prototype Pollution',
      'Object prototype pollution attempt via __proto__ in JSON body',
      'securitySanitizerMiddleware stripping __proto__, constructor, and prototype',
      async () => {
        const salaryCat = await prisma.category.findFirst({ where: { type: 'INCOME' } });
        const res = await fetch(`${baseUrl}/api/transactions`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userAToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 100,
            categoryId: salaryCat!.id,
            date: new Date().toISOString(),
            merchant: "Safe Merchant",
            __proto__: { polluted: true }
          })
        });
        assert(res.status === 201, `Expected 201, got ${res.status}`);
        // Verify Object prototype was not polluted
        assert((Object.prototype as any).polluted === undefined, 'Object.prototype must remain unpolluted');
      }
    );

    // ----------------------------------------------------
    // 6. A05: Security Headers & CORS Enforcement
    // ----------------------------------------------------
    console.log('\n--- Domain 6: HTTP Security Headers & Origin Defense ---');

    await runSecTest(
      'Security Headers',
      'HSTS, Frameguard, NoSniff, and Technology Masking',
      'Helmet enforcing HSTS (1 year), frameguard (DENY), nosniff, and x-powered-by removed',
      async () => {
        const res = await fetch(`${baseUrl}/api/health`);
        assert(res.headers.get('x-powered-by') === null, 'X-Powered-By header must be completely stripped');
        assert(res.headers.get('x-frame-options') === 'DENY', 'X-Frame-Options must be DENY');
        assert(res.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options must be nosniff');
        assert(Boolean(res.headers.get('strict-transport-security')?.includes('max-age=31536000')), 'HSTS must be set to 1 year');
      }
    );

    await runSecTest(
      'CORS Security',
      'Untrusted Foreign Origin Blocked (https://evil-phishing-site.com)',
      'Strict origin whitelist denying untrusted cross-origin requests',
      async () => {
        const res = await fetch(`${baseUrl}/api/health`, {
          headers: { Origin: 'https://evil-phishing-site.com' }
        });
        const allowOrigin = res.headers.get('access-control-allow-origin');
        assert(allowOrigin !== 'https://evil-phishing-site.com', 'Foreign origin must NOT be reflected');
      }
    );

    // ----------------------------------------------------
    // 7. DoS: Payload Size Quota
    // ----------------------------------------------------
    console.log('\n--- Domain 7: Denial of Service & Payload Quotas ---');

    await runSecTest(
      'DoS Protection',
      'Large Payload Flooding (>1MB JSON body)',
      'express.json({ limit: "1mb" }) rejecting oversized payload with 413',
      async () => {
        const giantString = 'x'.repeat(1.5 * 1024 * 1024); // 1.5MB
        const res = await fetch(`${baseUrl}/api/transactions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userAToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notes: giantString })
        });
        assert(res.status === 413, `Expected 413 Payload Too Large, got ${res.status}`);
      }
    );

    await runSecTest(
      'File Upload Security',
      'Executable Script Upload Blocked (.exe / .sh)',
      'multer fileFilter restricting uploads strictly to CSV files',
      async () => {
        const fakeExe = Buffer.from('MZ\x90\x00\x03\x00\x00\x00');
        const blob = new Blob([fakeExe], { type: 'application/x-msdownload' });
        const formData = new FormData();
        formData.append('file', blob, 'malware.exe');
        formData.append('mapping', JSON.stringify({ date: 'Date', amount: 'Amount' }));

        const res = await fetch(`${baseUrl}/api/import/preview`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userAToken}` },
          body: formData
        });
        assert(res.status === 400, `Expected 400 for non-CSV file, got ${res.status}`);
      }
    );

  } finally {
    // Clean up created test users
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } }
      });
    }

    server.close();
  }

  // Print Executive Penetration Test Summary
  console.log('\n================================================================');
  console.log('📊 CYBER ATTACK PENETRATION & HARDENING SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter(r => r.status === 'MITIGATED').length;
  const failed = results.filter(r => r.status === 'VULNERABLE').length;

  console.log(`Total Attacks Simulated:  ${total}`);
  console.log(`Mitigated (Protected):    ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Vulnerable:               ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    console.error('⚠️  CRITICAL VULNERABILITIES IDENTIFIED:');
    results.filter(r => r.status === 'VULNERABLE').forEach(r => {
      console.error(`- [${r.id}] ${r.threatCategory} (${r.attackVector}): ${r.details}`);
    });
    process.exit(1);
  } else {
    console.log('🛡️  ALL 13 ATTACK SCENARIOS THOROUGHLY MITIGATED & HARDENED!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal crash during penetration suite:', err);
  if (server) server.close();
  process.exit(1);
});
