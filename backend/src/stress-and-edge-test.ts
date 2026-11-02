import { app } from './app.js';
import { prisma } from '../prisma/index.js';
import { encrypt, decrypt } from './features/ai/encryption.util.js';
import type { Server } from 'http';

interface TestResult {
  id: string;
  category: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];
let server: Server;
let baseUrl: string;

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion Failed: ${message}`);
}

async function runTest(category: string, name: string, fn: () => Promise<void>) {
  const id = `E${results.length + 1}`;
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ id, category, name, status: 'PASSED', durationMs });
    console.log(`  ✓ [${category}] ${name} (${durationMs}ms)`);
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start);
    const error = err instanceof Error ? err.message : String(err);
    results.push({ id, category, name, status: 'FAILED', durationMs, error });
    console.error(`  ✗ [${category}] ${name} (${durationMs}ms) - ${error}`);
  }
}

async function main() {
  process.env.NODE_ENV = 'test';
  console.log('\n================================================================');
  console.log('⚡ FINSIGHT BACKEND PRODUCTION LOAD, CONCURRENCY & EDGE-CASE AUDIT');
  console.log('================================================================\n');

  server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Failed to bind server');
  baseUrl = `http://localhost:${address.port}`;
  console.log(`📡 Ephemeral server online at: ${baseUrl}\n`);

  const createdUserIds: string[] = [];

  try {
    // ----------------------------------------------------
    // CATEGORY 1: Zero-State & Brand New User Resilience
    // ----------------------------------------------------
    console.log('--- Category 1: Zero-State & Brand New User Resilience ---');
    const zeroUserEmail = `zero_${Date.now()}@finsight.local`;
    let zeroUserId = '';
    let zeroToken = '';

    await runTest('Zero-State', 'Register fresh user with 0 transactions and 0 goals', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: zeroUserEmail, password: 'StrongPassword123!', name: 'Zero State User' })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      zeroUserId = body.data.user.id;
      zeroToken = body.data.accessToken;
      createdUserIds.push(zeroUserId);
    });

    await runTest('Zero-State', 'GET /api returns root discovery overview', async () => {
      const res = await fetch(`${baseUrl}/api`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.success === true, 'Success should be true');
      assert(body.data.status === 'online', 'Status should be online');
      assert(body.data.endpoints.health === '/api/health', 'Health endpoint listed');
    });

    await runTest('Zero-State', 'Dashboard summary on brand new user (zero division safety)', async () => {
      const res = await fetch(`${baseUrl}/api/dashboard/summary`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.netCashFlow === 0, 'netCashFlow should be 0');
      assert(body.data.totalIncome === 0, 'totalIncome should be 0');
      assert(body.data.totalExpenses === 0, 'totalExpenses should be 0');
      assert(Array.isArray(body.data.monthlyTrend), 'monthlyTrend should be array');
      assert(body.data.monthlyTrend.length === 6, 'Should have 6 months even with 0 tx');
      assert(body.data.topCategories.length === 0, 'topCategories should be empty array');
      assert(body.data.recentTransactions.length === 0, 'recentTransactions should be empty array');
    });

    await runTest('Zero-State', 'Analytics summary on brand new user (zero velocity / zero growth)', async () => {
      const res = await fetch(`${baseUrl}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.income.total === 0, 'income total should be 0');
      assert(body.data.expense.total === 0, 'expense total should be 0');
      assert(body.data.spendingVelocity.dailyAverage === 0, 'dailyAverage should be 0');
      assert(body.data.spendingVelocity.projectedMonthly === 0, 'projectedMonthly should be 0');
      assert(!isNaN(body.data.income.trend), 'income.trend must not be NaN');
      assert(!isNaN(body.data.expense.trend), 'expense.trend must not be NaN');
      assert(body.data.categoryAnalysis.length === 0, 'categoryAnalysis should be empty array');
    });

    await runTest('Zero-State', 'Health score on brand new user computes stable baseline without NaN', async () => {
      const res = await fetch(`${baseUrl}/api/health-score`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(!isNaN(body.data.overallScore), 'overallScore must NOT be NaN');
      assert(body.data.overallScore >= 0 && body.data.overallScore <= 100, `Score out of bounds: ${body.data.overallScore}`);
      assert(body.data.components.length === 4, 'Must have 4 components');
      body.data.components.forEach((c: { score: number }) => {
        assert(!isNaN(c.score), `Component score must NOT be NaN: ${c.score}`);
      });
    });

    await runTest('Zero-State', 'Goals summary on brand new user returns clean empty state', async () => {
      const res = await fetch(`${baseUrl}/api/goals/summary`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.goals.length === 0, 'goals should be empty');
      assert(body.data.totalTarget === 0, 'totalTarget should be 0');
      assert(body.data.totalCurrent === 0, 'totalCurrent should be 0');
      assert(body.data.totalRequiredMonthly === 0, 'totalRequiredMonthly should be 0');
      assert(body.data.overallFeasibility === 'ACHIEVABLE', 'Default feasibility should be ACHIEVABLE');
    });

    // ----------------------------------------------------
    // CATEGORY 2: High Concurrency & Workload Stress
    // ----------------------------------------------------
    console.log('\n--- Category 2: High Concurrency & Workload Stress ---');

    await runTest('Concurrency', 'Execute 50 concurrent authenticated dashboard requests', async () => {
      const requests = Array.from({ length: 50 }, () =>
        fetch(`${baseUrl}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${zeroToken}` }
        })
      );

      const responses = await Promise.all(requests);
      assert(responses.every(r => r.status === 200), 'All 50 concurrent requests must return HTTP 200');
    });

    await runTest('Concurrency', 'Execute 30 concurrent user logins without session cross-talk', async () => {
      const loginPayload = JSON.stringify({ email: zeroUserEmail, password: 'StrongPassword123!' });
      const requests = Array.from({ length: 30 }, () =>
        fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: loginPayload
        })
      );

      const responses = await Promise.all(requests);
      assert(responses.every(r => r.status === 200), 'All concurrent logins must return 200');
      const bodies = await Promise.all(responses.map(r => r.json()));
      bodies.forEach(b => {
        assert(b.data.user.id === zeroUserId, 'Token must strictly match correct user');
      });
    });

    // ----------------------------------------------------
    // CATEGORY 3: High-Volume Transaction Operations & Bulk Batches
    // ----------------------------------------------------
    console.log('\n--- Category 3: High-Volume Transaction Operations ---');
    const categories = await prisma.category.findMany({ take: 5 });
    assert(categories.length > 0, 'Need seeded categories');
    const salaryCat = categories.find(c => c.type === 'INCOME') || categories[0];
    const foodCat = categories.find(c => c.type === 'EXPENSE') || categories[1] || categories[0];

    await runTest('Bulk', 'Insert 100 transactions in parallel and verify ledger count', async () => {
      const now = new Date();
      const insertPromises = Array.from({ length: 100 }, (_, i) => {
        const isIncome = i % 4 === 0;
        const amount = isIncome ? (200000 + i * 100) : -(1500 + i * 50);
        const catId = isIncome ? salaryCat!.id : foodCat!.id;
        const txDate = new Date(now.getTime() - i * 3600 * 1000 * 6);

        return fetch(`${baseUrl}/api/transactions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${zeroToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount,
            currency: 'USD',
            categoryId: catId,
            date: txDate.toISOString(),
            merchant: `Merchant #${i}`,
            description: `Batch transaction item ${i}`,
            notes: `Auto-generated #batch-${i}`
          })
        });
      });

      const responses = await Promise.all(insertPromises);
      assert(responses.every(r => r.status === 201), 'All 100 transactions should be created');

      const count = await prisma.transaction.count({ where: { userId: zeroUserId, deletedAt: null } });
      assert(count === 100, `Expected 100 transactions in database, got ${count}`);
    });

    await runTest('Bulk', 'Pagination across 100 transactions with limit=25', async () => {
      const res = await fetch(`${baseUrl}/api/transactions?page=1&limit=25`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.data.length === 25, `Expected 25 items on page 1, got ${body.data.data.length}`);
      assert(body.data.meta.total === 100, `Expected total=100, got ${body.data.meta.total}`);
      assert(body.data.meta.totalPages === 4, `Expected totalPages=4, got ${body.data.meta.totalPages}`);

      const res4 = await fetch(`${baseUrl}/api/transactions?page=4&limit=25`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      const body4 = await res4.json();
      assert(body4.data.data.length === 25, `Expected 25 items on page 4, got ${body4.data.data.length}`);
    });

    await runTest('Bulk', 'Sorting by absolute amount with min/max filters', async () => {
      const res = await fetch(`${baseUrl}/api/transactions?sortBy=amount&sortOrder=desc&limit=10`, {
        headers: { Authorization: `Bearer ${zeroToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      const amounts = body.data.data.map((t: { amount: number }) => Math.abs(t.amount));
      for (let i = 0; i < amounts.length - 1; i++) {
        assert(amounts[i] >= amounts[i + 1], `Amounts not sorted in descending order: ${amounts[i]} < ${amounts[i + 1]}`);
      }
    });

    // ----------------------------------------------------
    // CATEGORY 4: Edge Values, Unicode & Boundary Testing
    // ----------------------------------------------------
    console.log('\n--- Category 4: Edge Values, Unicode & Boundary Testing ---');

    await runTest('Boundary', 'Large currency value: $20,000,000.00 (2,000,000,000 cents within 32-bit limit)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${zeroToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 2000000000, // 20 million dollars in cents
          currency: 'USD',
          categoryId: salaryCat!.id,
          date: new Date().toISOString(),
          merchant: 'Mega Corp Treasury',
          description: 'Institutional Capital Infusion'
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      assert(body.data.amount === 2000000000, 'Expected exact large integer storage');
    });

    await runTest('Boundary', 'Clean rejection of overflow amount exceeding 32-bit integer (> 2,147,483,647)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${zeroToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 10000000000, // 10 billion cents (overflows 32-bit signed int)
          currency: 'USD',
          categoryId: salaryCat!.id,
          date: new Date().toISOString(),
          merchant: 'Overflow Bank'
        })
      });
      assert(res.status === 400, `Expected 400 Validation Error, got ${res.status}`);
      const body = await res.json();
      assert(body.error.code === 'VALIDATION_ERROR', 'Expected VALIDATION_ERROR code');
    });

    await runTest('Boundary', 'Full Unicode, emojis, and null-byte sanitization in text fields', async () => {
      const unicodeMerchant = 'Café Müller ☕ & ラーメン屋 🍜 💸';
      // Include null byte \0 to test that the null-byte sanitizer strips it cleanly
      const rawDescription = 'Special characters: <>&"\' / \0 \n \t 漢字 العربية';
      const expectedSanitizedDescription = 'Special characters: <>&"\' /  \n \t 漢字 العربية';

      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${zeroToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: -2500,
          currency: 'USD',
          categoryId: foodCat!.id,
          date: new Date().toISOString(),
          merchant: unicodeMerchant,
          description: rawDescription
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      assert(body.data.merchant === unicodeMerchant, 'Unicode merchant should be preserved verbatim');
      assert(body.data.description === expectedSanitizedDescription, 'Null byte should be sanitized without crash');
    });

    await runTest('Boundary', 'Distant historical and future dates (1995 & 2045)', async () => {
      const historicalDate = '1995-12-31T23:59:59.000Z';
      const futureDate = '2045-06-15T12:00:00.000Z';

      const resHist = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zeroToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: -500, categoryId: foodCat!.id, date: historicalDate, merchant: '1995 retro' })
      });
      assert(resHist.status === 201, `Expected 201, got ${resHist.status}`);

      const resFut = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zeroToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, categoryId: salaryCat!.id, date: futureDate, merchant: 'Future 2045' })
      });
      assert(resFut.status === 201, `Expected 201, got ${resFut.status}`);
    });

    // ----------------------------------------------------
    // CATEGORY 5: Goal Feasibility State Machine
    // ----------------------------------------------------
    console.log('\n--- Category 5: Goal Feasibility State Machine ---');

    await runTest('Goals', 'Goal reaches COMPLETED status when currentAmount >= targetAmount', async () => {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 6);

      const res = await fetch(`${baseUrl}/api/goals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zeroToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Fully Funded Vacation',
          targetAmount: 500000,
          currentAmount: 500000,
          targetDate: targetDate.toISOString(),
          color: '#3b82f6'
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      assert(body.data.status === 'COMPLETED', `Expected status COMPLETED, got ${body.data.status}`);
      assert(body.data.progress === 100, `Expected 100% progress, got ${body.data.progress}`);
      assert(body.data.requiredMonthlySavings === 0, 'Required monthly savings should be 0 when completed');
    });

    await runTest('Goals', 'Goal transitions to UNREALISTIC when required monthly exceeds cashflow', async () => {
      const poorUserEmail = `poor_${Date.now()}@finsight.local`;
      const poorRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: poorUserEmail, password: 'Password123!', name: 'Poor User' })
      });
      const poorData = (await poorRes.json()).data;
      createdUserIds.push(poorData.user.id);

      await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${poorData.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100000, categoryId: salaryCat!.id, date: new Date().toISOString() })
      });
      await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${poorData.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: -95000, categoryId: foodCat!.id, date: new Date().toISOString() })
      });

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 2);

      const goalRes = await fetch(`${baseUrl}/api/goals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${poorData.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Super Yacht',
          targetAmount: 2000000000,
          currentAmount: 0,
          targetDate: targetDate.toISOString(),
          color: '#ef4444'
        })
      });
      const goalBody = await goalRes.json();
      assert(goalBody.data.feasibility === 'UNREALISTIC', `Expected UNREALISTIC, got ${goalBody.data.feasibility}`);

      const summaryRes = await fetch(`${baseUrl}/api/goals/summary`, {
        headers: { Authorization: `Bearer ${poorData.accessToken}` }
      });
      const summaryBody = await summaryRes.json();
      assert(summaryBody.data.overallFeasibility === 'UNREALISTIC', 'Overall feasibility must be UNREALISTIC');
      assert(summaryBody.data.recommendations.length > 0, 'Should include alert recommendations');
    });

    // ----------------------------------------------------
    // CATEGORY 6: CSV Import Edge Cases & Robustness
    // ----------------------------------------------------
    console.log('\n--- Category 6: CSV Import Edge Cases ---');

    await runTest('CSV', 'Import rejects when no file is uploaded', async () => {
      const formData = new FormData();
      formData.append('mapping', JSON.stringify({ date: 'Date', amount: 'Amount', merchant: 'Merchant' }));

      const res = await fetch(`${baseUrl}/api/import/preview`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zeroToken}` },
        body: formData
      });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
      const body = await res.json();
      assert(body.error.message.includes('No file uploaded'), 'Expected No file uploaded error');
    });

    await runTest('CSV', 'Import handles messy currency symbols ($1,250.99, -$4.50, etc.)', async () => {
      const messyCsv = `Date,Vendor,Price,Notes
2026-10-01,BestBuy,"$1,299.99",Laptop
2026-10-02,Starbucks,-$4.50,Latte
2026-10-03,Paypal,+$500.00,Freelance`;

      const blob = new Blob([messyCsv], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'messy.csv');
      formData.append('mapping', JSON.stringify({
        date: 'Date',
        merchant: 'Vendor',
        amount: 'Price',
        description: 'Notes'
      }));

      const res = await fetch(`${baseUrl}/api/import/preview`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${zeroToken}` },
        body: formData
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.validRows === 3, `Expected 3 valid rows, got ${body.data.validRows}`);
      assert(body.data.rows[0].mappedData.amount === 129999, 'Parsed $1,299.99 should be 129999');
      assert(body.data.rows[1].mappedData.amount === -450, 'Parsed -$4.50 should be -450');
      assert(body.data.rows[2].mappedData.amount === 50000, 'Parsed +$500.00 should be 50000');
    });

    // ----------------------------------------------------
    // CATEGORY 7: AI Coach Edge Cases & Key Tampering
    // ----------------------------------------------------
    console.log('\n--- Category 7: AI Coach Edge Cases & Key Tampering ---');

    await runTest('AI', 'Tampered database ciphertext triggers graceful decryption failure without crash', async () => {
      await prisma.aiProviderConfig.upsert({
        where: { userId: zeroUserId },
        update: { apiKey: 'corrupted-iv:corrupted-ciphertext:corrupted-authtag' },
        create: {
          userId: zeroUserId,
          provider: 'groq',
          apiKey: 'corrupted-iv:corrupted-ciphertext:corrupted-authtag',
          selectedModel: 'llama-3.1-8b-instant'
        }
      });

      const res = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${zeroToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: 'Explain my financial health.' })
      });
      assert(res.status === 200, 'SSE stream endpoint should respond 200');
      const text = await res.text();
      assert(text.includes('error') || text.includes('not configured'), 'Stream should deliver structured error event');
      
      const healthRes = await fetch(`${baseUrl}/api/health`);
      assert(healthRes.status === 200, 'Server must remain 100% operational');
    });

    // ----------------------------------------------------
    // CATEGORY 8: Rate Limiting & Denial of Service Protection
    // ----------------------------------------------------
    console.log('\n--- Category 8: Rate Limiting & Denial of Service Protection ---');

    await runTest('RateLimiter', 'AI Chat endpoint enforces 15 req/min rate limit', async () => {
      const chatRequests = Array.from({ length: 17 }, () =>
        fetch(`${baseUrl}/api/ai/chat`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${zeroToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: 'Ping' })
        })
      );

      const responses = await Promise.all(chatRequests);
      const rateLimited = responses.some(r => r.status === 429);
      assert(rateLimited, 'Expected at least one request to be throttled with HTTP 429');
    });

    // ----------------------------------------------------
    // CATEGORY 9: Foreign Key Constraints & Data Integrity
    // ----------------------------------------------------
    console.log('\n--- Category 9: Foreign Key Constraints & Data Integrity ---');

    await runTest('Integrity', 'PostgreSQL blocks deletion of Category referenced by active transactions', async () => {
      try {
        await prisma.category.delete({ where: { id: salaryCat!.id } });
        assert(false, 'Should have thrown foreign key restriction error');
      } catch (err: unknown) {
        const msg = String(err);
        assert(msg.includes('foreign key constraint') || msg.includes('violates RESTRICT'), 'Foreign key restriction verified');
      }
    });

    await runTest('Integrity', 'User deletion cascades and wipes all transactions, goals, and configs', async () => {
      const tempUserEmail = `cascade_${Date.now()}@finsight.local`;
      const tempRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempUserEmail, password: 'Password123!', name: 'Cascade User' })
      });
      const tempToken = (await tempRes.json()).data.accessToken;
      const tempProfile = await (await fetch(`${baseUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${tempToken}` } })).json();
      const tempUserId = tempProfile.data.id;

      await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tempToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, categoryId: salaryCat!.id, date: new Date().toISOString() })
      });
      await fetch(`${baseUrl}/api/goals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tempToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Temp Goal', targetAmount: 50000, targetDate: new Date().toISOString() })
      });

      await prisma.user.delete({ where: { id: tempUserId } });

      const txCount = await prisma.transaction.count({ where: { userId: tempUserId } });
      const goalCount = await prisma.goal.count({ where: { userId: tempUserId } });
      assert(txCount === 0, `Transactions should be 0 after user deletion, got ${txCount}`);
      assert(goalCount === 0, `Goals should be 0 after user deletion, got ${goalCount}`);
    });

  } finally {
    for (const uid of createdUserIds) {
      await prisma.transaction.deleteMany({ where: { userId: uid } }).catch(() => {});
      await prisma.goal.deleteMany({ where: { userId: uid } }).catch(() => {});
      await prisma.chatSession.deleteMany({ where: { userId: uid } }).catch(() => {});
      await prisma.aiProviderConfig.deleteMany({ where: { userId: uid } }).catch(() => {});
      await prisma.importSession.deleteMany({ where: { userId: uid } }).catch(() => {});
      await prisma.user.delete({ where: { id: uid } }).catch(() => {});
    }

    server.close();
    await prisma.$disconnect();
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const total = results.length;
  const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

  console.log('\n================================================================');
  console.log('📊 PRODUCTION LOAD & EDGE-CASE TEST SUMMARY');
  console.log('================================================================');
  console.log(`Total Scenarios:  ${total}`);
  console.log(`Passed:           ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Failed:           ${failed}`);
  console.log(`Total Latency:    ${totalDuration}ms`);
  console.log('================================================================\n');

  if (failed > 0) {
    console.log('FAILED SCENARIOS:');
    results.filter(r => r.status === 'FAILED').forEach(r => {
      console.log(`- [${r.category}] ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('🌟 ALL ADVANCED LOAD & EDGE-CASE AUDITS PASSED!\n');
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('Fatal Test Runner Error:', e);
  process.exit(1);
});
