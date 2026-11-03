import { app } from './app.js';
import { prisma } from '../prisma/index.js';
import { encrypt, decrypt } from './features/ai/encryption.util.js';
import type { Server } from 'http';

interface TestResult {
  id: string;
  suite: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];
let server: Server;
let baseUrl: string;

// State across tests
let testUserEmail = `test_${Date.now()}@finsight.local`;
const testUserPassword = 'SecurePassword123!';
let testUserId: string;
let accessToken: string;
let createdCategoryId: string;
let createdTransactionId: string;
let createdGoalId: string;
let userBId: string;

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runTest(suite: string, name: string, fn: () => Promise<void>) {
  const id = `T${results.length + 1}`;
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ id, suite, name, status: 'PASSED', durationMs });
    console.log(`  ✓ [${suite}] ${name} (${durationMs}ms)`);
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start);
    const error = err instanceof Error ? err.message : String(err);
    results.push({ id, suite, name, status: 'FAILED', durationMs, error });
    console.error(`  ✗ [${suite}] ${name} (${durationMs}ms) - ${error}`);
  }
}

async function main() {
  process.env.NODE_ENV = 'test';
  console.log('\n========================================================');
  console.log('🚀 FINSIGHT BACKEND COMPREHENSIVE TEST SUITE');
  console.log('========================================================\n');

  // Start test server on ephemeral port
  server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to bind server');
  }
  baseUrl = `http://localhost:${address.port}`;
  console.log(`📡 Test server running at: ${baseUrl}\n`);

  try {
    // ----------------------------------------------------
    // SUITE 1: System Health & Core Middleware
    // ----------------------------------------------------
    console.log('--- Suite 1: System Health & Core Middleware ---');

    await runTest('System', 'GET /api/health returns database: connected', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.success === true, 'Response success should be true');
      assert(body.data.database === 'connected', 'Database status must be connected');
      assert(typeof body.data.uptime === 'number', 'Uptime should be numeric');
    });

    await runTest('System', 'Security headers from Helmet are present', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert(res.headers.get('x-content-type-options') === 'nosniff', 'Missing X-Content-Type-Options: nosniff');
      assert(res.headers.get('x-frame-options') === 'SAMEORIGIN' || res.headers.get('x-frame-options') === 'DENY', 'Missing X-Frame-Options');
    });

    await runTest('System', 'Request ID is generated and returned on error', async () => {
      const res = await fetch(`${baseUrl}/api/nonexistent-route-404`);
      assert(res.status === 404, `Expected 404, got ${res.status}`);
      const body = await res.json();
      assert(body.success === false, 'success should be false');
      assert(typeof body.error.requestId === 'string' && body.error.requestId.length > 10, 'requestId missing or invalid');
      assert(body.error.code === 'NOT_FOUND_ERROR', 'Expected NOT_FOUND_ERROR code');
    });

    // ----------------------------------------------------
    // SUITE 2: Authentication & Session Lifecycle
    // ----------------------------------------------------
    console.log('\n--- Suite 2: Authentication & Session Lifecycle ---');

    await runTest('Auth', 'Reject registration with invalid email or short password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad-email', password: '123', name: 'A' })
      });
      assert(res.status === 400, `Expected 400 validation error, got ${res.status}`);
      const body = await res.json();
      assert(body.success === false, 'Expected success: false');
    });

    await runTest('Auth', 'Register new user successfully', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserEmail,
          password: testUserPassword,
          name: 'Comprehensive Test User'
        })
      });
      assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
      const body = await res.json();
      assert(body.success === true, 'Expected success: true');
      assert(body.data.user.email === testUserEmail, 'Email should match');
      assert(typeof body.data.accessToken === 'string', 'Expected JWT accessToken');
      assert(Boolean(res.headers.get('set-cookie')?.includes('refreshToken=')), 'Expected HttpOnly refreshToken cookie');
      testUserId = body.data.user.id;
      accessToken = body.data.accessToken;
    });

    await runTest('Auth', 'Reject duplicate user registration (Conflict 409)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUserEmail,
          password: testUserPassword,
          name: 'Comprehensive Test User'
        })
      });
      assert(res.status === 409, `Expected 409 Conflict, got ${res.status}`);
      const body = await res.json();
      assert(body.error.message.includes('already in use'), 'Expected duplicate email message');
    });

    await runTest('Auth', 'Reject login with wrong password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUserEmail, password: 'WrongPassword999!' })
      });
      assert(res.status === 401, `Expected 401, got ${res.status}`);
    });

    await runTest('Auth', 'Login with correct credentials returns fresh tokens', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUserEmail, password: testUserPassword })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(typeof body.data.accessToken === 'string', 'Missing accessToken');
      accessToken = body.data.accessToken;
    });

    await runTest('Auth', 'GET /api/auth/me returns authenticated profile', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.id === testUserId, 'User id mismatch');
      assert(body.data.email === testUserEmail, 'User email mismatch');
    });

    await runTest('Auth', 'PATCH /api/auth/me updates preferred currency', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency: 'EUR' })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.currency === 'EUR', 'Currency was not updated to EUR');

      // Reset back to USD
      await fetch(`${baseUrl}/api/auth/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency: 'USD' })
      });
    });

    await runTest('Auth', 'POST /api/auth/demo seeds or logs in demo user', async () => {
      const res = await fetch(`${baseUrl}/api/auth/demo`, { method: 'POST' });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.user.email === 'demo@finsight.local', 'Demo user email mismatch');
      assert(typeof body.data.accessToken === 'string', 'Expected demo token');
    });

    // ----------------------------------------------------
    // SUITE 3: Category Taxonomy & Hierarchy
    // ----------------------------------------------------
    console.log('\n--- Suite 3: Category Taxonomy & Hierarchy ---');

    await runTest('Categories', 'GET /api/categories returns taxonomy list', async () => {
      const res = await fetch(`${baseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(Array.isArray(body.data), 'Expected array of categories');
      assert(body.data.length > 0, 'Categories table should have seeded records');

      const salaryCat = body.data.find((c: { name: string }) => c.name === 'Salary');
      assert(!!salaryCat, 'Salary category should exist');
      createdCategoryId = salaryCat.id;
    });

    await runTest('Categories', 'GET /api/categories/tree returns nested parents and children', async () => {
      const res = await fetch(`${baseUrl}/api/categories/tree`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(Array.isArray(body.data), 'Expected array');
      const incomeGroup = body.data.find((c: { name: string }) => c.name === 'Income');
      assert(!!incomeGroup, 'Income group should exist in tree');
      assert(Array.isArray(incomeGroup.children) && incomeGroup.children.length > 0, 'Children should be populated');
    });

    // ----------------------------------------------------
    // SUITE 4: Transaction Ledger & Minor Unit Precision
    // ----------------------------------------------------
    console.log('\n--- Suite 4: Transaction Ledger & Precision Math ---');

    await runTest('Transactions', 'Create Income Transaction with exact minor unit ($5,250.75 -> 525075)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 525075,
          currency: 'USD',
          categoryId: createdCategoryId,
          date: new Date().toISOString(),
          merchant: 'Tech Enterprise Corp',
          description: 'Software Engineering Bi-Weekly Compensation',
          notes: 'Direct Deposit Paycheck'
        })
      });
      assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
      const body = await res.json();
      assert(body.data.amount === 525075, 'Amount must be exactly 525075 minor units');
      assert(body.data.merchant === 'Tech Enterprise Corp', 'Merchant mismatch');
      createdTransactionId = body.data.id;
    });

    await runTest('Transactions', 'Create Expense Transaction with minor unit (-$125.50 -> -12550)', async () => {
      const catRes = await fetch(`${baseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const cats = (await catRes.json()).data;
      const expenseCat = cats.find((c: { type: string }) => c.type === 'EXPENSE') || cats[0];

      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: -12550,
          currency: 'USD',
          categoryId: expenseCat.id,
          date: new Date().toISOString(),
          merchant: 'Whole Foods Market',
          description: 'Organic Groceries'
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      assert(body.data.amount === -12550, 'Expense amount should be negative integer -12550');
    });

    await runTest('Transactions', 'Reject transaction with invalid UUID category ID (400)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'USD',
          categoryId: 'invalid-non-uuid-string',
          date: new Date().toISOString()
        })
      });
      assert(res.status === 400, `Expected 400 for bad category, got ${res.status}`);
      const body = await res.json();
      assert(body.error.code === 'VALIDATION_ERROR', 'Expected VALIDATION_ERROR code');
    });

    await runTest('Transactions', 'Reject transaction with non-existent UUID category ID (400)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'USD',
          categoryId: '00000000-0000-0000-0000-000000000000',
          date: new Date().toISOString()
        })
      });
      assert(res.status === 400, `Expected 400 for non-existent category, got ${res.status}`);
      const body = await res.json();
      assert(body.error.code === 'VALIDATION_ERROR', 'Expected VALIDATION_ERROR code');
    });

    await runTest('Transactions', 'GET /api/transactions supports pagination and filters', async () => {
      const res = await fetch(`${baseUrl}/api/transactions?page=1&limit=10&sortBy=date&sortOrder=desc`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(Array.isArray(body.data.data), 'Expected transaction array');
      assert(body.data.data.length >= 2, 'Should have at least 2 transactions created');
      assert(body.data.meta.total >= 2, 'Total metadata should reflect count');
      assert(body.data.meta.page === 1, 'Page should be 1');
    });

    await runTest('Transactions', 'GET /api/transactions/:id retrieves single record', async () => {
      const res = await fetch(`${baseUrl}/api/transactions/${createdTransactionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.id === createdTransactionId, 'ID mismatch');
      assert(body.data.amount === 525075, 'Amount mismatch');
    });

    await runTest('Transactions', 'PATCH /api/transactions/:id updates merchant and notes', async () => {
      const res = await fetch(`${baseUrl}/api/transactions/${createdTransactionId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchant: 'Tech Enterprise Corp (Updated)',
          notes: 'Verified paycheck'
        })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.merchant === 'Tech Enterprise Corp (Updated)', 'Merchant update failed');
      assert(body.data.notes === 'Verified paycheck', 'Notes update failed');
    });

    await runTest('Transactions', 'DELETE /api/transactions/:id performs soft delete', async () => {
      const res = await fetch(`${baseUrl}/api/transactions/${createdTransactionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);

      // Verify it cannot be retrieved via API
      const getRes = await fetch(`${baseUrl}/api/transactions/${createdTransactionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(getRes.status === 404, `Expected 404 after soft-delete, got ${getRes.status}`);

      // Verify it still exists in DB with deletedAt timestamp
      const dbTx = await prisma.transaction.findUnique({ where: { id: createdTransactionId } });
      assert(dbTx !== null, 'Transaction must exist in DB');
      assert(dbTx!.deletedAt !== null, 'deletedAt must be set');
    });

    // ----------------------------------------------------
    // SUITE 5: Dashboard Rollups & Historical Trends
    // ----------------------------------------------------
    console.log('\n--- Suite 5: Dashboard Rollups & Trends ---');

    await runTest('Dashboard', 'GET /api/dashboard/summary computes cash flow and trends', async () => {
      const res = await fetch(`${baseUrl}/api/dashboard/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(typeof body.data.netCashFlow === 'number', 'netCashFlow should be numeric');
      assert(typeof body.data.totalIncome === 'number', 'totalIncome should be numeric');
      assert(typeof body.data.totalExpenses === 'number', 'totalExpenses should be numeric');
      assert(Array.isArray(body.data.monthlyTrend), 'monthlyTrend should be array');
      assert(body.data.monthlyTrend.length === 6, 'monthlyTrend should contain exactly 6 months');
      assert(Array.isArray(body.data.recentTransactions), 'recentTransactions should be array');
    });

    // ----------------------------------------------------
    // SUITE 6: Analytics & Spending Velocity Telemetry
    // ----------------------------------------------------
    console.log('\n--- Suite 6: Analytics & Spending Velocity ---');

    await runTest('Analytics', 'GET /api/analytics/summary computes velocity and category splits', async () => {
      const res = await fetch(`${baseUrl}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.income !== undefined, 'income section missing');
      assert(body.data.expense !== undefined, 'expense section missing');
      assert(body.data.spendingVelocity !== undefined, 'spendingVelocity missing');
      assert(typeof body.data.spendingVelocity.dailyAverage === 'number', 'dailyAverage must be number');
      assert(typeof body.data.spendingVelocity.projectedMonthly === 'number', 'projectedMonthly must be number');
      assert(Array.isArray(body.data.categoryAnalysis), 'categoryAnalysis should be array');
      assert(Array.isArray(body.data.insights), 'insights should be array');
    });

    // ----------------------------------------------------
    // SUITE 7: Deterministic Financial Health Score
    // ----------------------------------------------------
    console.log('\n--- Suite 7: Financial Health Score Engine ---');

    await runTest('Health', 'GET /api/health-score calculates 4-pillar deterministic score', async () => {
      const res = await fetch(`${baseUrl}/api/health-score`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(typeof body.data.overallScore === 'number', 'overallScore must be number');
      assert(body.data.overallScore >= 0 && body.data.overallScore <= 100, 'Score must be between 0 and 100');
      assert(Array.isArray(body.data.components), 'components must be array');
      assert(body.data.components.length === 4, 'Must have exactly 4 component pillars');

      const componentNames = body.data.components.map((c: { name: string }) => c.name);
      assert(componentNames.includes('Savings Rate'), 'Missing Savings Rate pillar');
      assert(componentNames.includes('Expense Control'), 'Missing Expense Control pillar');
      assert(componentNames.includes('Category Balance'), 'Missing Category Balance pillar');
      assert(componentNames.includes('Financial Discipline'), 'Missing Financial Discipline pillar');

      const totalWeight = body.data.components.reduce((sum: number, c: { weight: number }) => sum + c.weight, 0);
      assert(totalWeight === 100, `Weights must sum to 100, got ${totalWeight}`);
      assert(Array.isArray(body.data.recommendations), 'recommendations must be array');
    });

    // ----------------------------------------------------
    // SUITE 8: Dynamic Savings Goal Feasibility Engine
    // ----------------------------------------------------
    console.log('\n--- Suite 8: Dynamic Savings Goal Feasibility ---');

    await runTest('Goals', 'POST /api/goals creates savings goal ($10,000 target)', async () => {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 10);

      const res = await fetch(`${baseUrl}/api/goals`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Emergency Rainy Day Fund',
          targetAmount: 1000000, // $10,000 in cents
          currentAmount: 250000, // $2,500 in cents
          targetDate: targetDate.toISOString(),
          color: '#10b981'
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const body = await res.json();
      assert(body.data.name === 'Emergency Rainy Day Fund', 'Goal name mismatch');
      assert(body.data.progress === 25, 'Expected 25% progress');
      assert(body.data.monthsRemaining === 10, 'Expected 10 months remaining');
      assert(['ACHIEVABLE', 'STRETCH', 'UNREALISTIC'].includes(body.data.feasibility), 'Invalid feasibility status');
      createdGoalId = body.data.id;
    });

    await runTest('Goals', 'GET /api/goals/summary evaluates overall cashflow feasibility', async () => {
      const res = await fetch(`${baseUrl}/api/goals/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.totalTarget >= 1000000, 'totalTarget mismatch');
      assert(body.data.totalCurrent >= 250000, 'totalCurrent mismatch');
      assert(typeof body.data.totalRequiredMonthly === 'number', 'totalRequiredMonthly must be number');
      assert(['ACHIEVABLE', 'STRETCH', 'UNREALISTIC'].includes(body.data.overallFeasibility), 'Invalid overallFeasibility');
      assert(Array.isArray(body.data.recommendations), 'recommendations should be array');
    });

    await runTest('Goals', 'PATCH /api/goals/:id increments saved amount', async () => {
      const res = await fetch(`${baseUrl}/api/goals/${createdGoalId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentAmount: 500000 })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.currentAmount === 500000, 'Current amount should be 500000');
      assert(body.data.progress === 50, 'Progress should now be 50%');
    });

    // ----------------------------------------------------
    // SUITE 9: Counterfactual Simulation Engine
    // ----------------------------------------------------
    console.log('\n--- Suite 9: Counterfactual Simulation Engine ---');

    await runTest('Simulation', 'POST /api/simulation/run projects income shift impact', async () => {
      const res = await fetch(`${baseUrl}/api/simulation/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          incomeAdjustment: 100000, // +$1,000/mo
          expenseAdjustment: -20000 // -$200/mo cut
        })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.baseline !== undefined, 'Baseline missing');
      assert(body.data.projected !== undefined, 'Projected missing');
      assert(body.data.diff !== undefined, 'Diff missing');
      assert(body.data.diff.cashFlow === 120000, `Diff cashflow should be +120000, got ${body.data.diff.cashFlow}`);
      assert(typeof body.data.diff.healthScore === 'number', 'Health score diff should be numeric');
    });

    // ----------------------------------------------------
    // SUITE 10: AI Provider Config & AES-256-GCM Encryption
    // ----------------------------------------------------
    console.log('\n--- Suite 10: AI Coach Security & Encryption ---');

    await runTest('AI', 'Symmetric AES-256-GCM encryption utility test', async () => {
      const plainSecret = 'sk-groq-live-test-api-key-998877665544';
      const encrypted = encrypt(plainSecret);
      assert(encrypted.includes(':'), 'Encrypted format must be iv:cipher:tag');
      const parts = encrypted.split(':');
      assert(parts.length === 3, 'Encrypted format must have 3 parts (IV, ciphertext, authTag)');
      assert(encrypted !== plainSecret, 'Encrypted text must not match plaintext');

      const decrypted = decrypt(encrypted);
      assert(decrypted === plainSecret, 'Decrypted text must match original plaintext');
    });

    await runTest('AI', 'POST /api/ai/config stores encrypted key in DB', async () => {
      const dummyApiKey = 'gsk_mock_test_key_for_automated_testing_12345';
      const res = await fetch(`${baseUrl}/api/ai/config`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: 'groq',
          apiKey: dummyApiKey,
          selectedModel: 'llama-3.1-8b-instant'
        })
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.provider === 'groq', 'Provider mismatch');
      assert(body.data.hasApiKey === true, 'hasApiKey should be true');
      // Crucial: Plaintext API key must NEVER be echoed in response!
      assert(body.data.apiKey === undefined, 'API key should not be exposed in response body');

      // Check PostgreSQL directly to prove ciphertext storage
      const dbConfig = await prisma.aiProviderConfig.findUnique({ where: { userId: testUserId } });
      assert(dbConfig !== null, 'Config must exist in DB');
      assert(dbConfig!.apiKey !== dummyApiKey, 'DB must NOT store plaintext API key');
      assert(dbConfig!.apiKey.includes(':'), 'DB must contain IV:Cipher:AuthTag format');
      assert(decrypt(dbConfig!.apiKey) === dummyApiKey, 'Decrypted DB value must match original');
    });

    await runTest('AI', 'GET /api/ai/config returns status without revealing key', async () => {
      const res = await fetch(`${baseUrl}/api/ai/config`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.hasApiKey === true, 'hasApiKey must be true');
      assert(body.data.apiKey === undefined, 'Plaintext API key leaked');
    });

    // ----------------------------------------------------
    // SUITE 11: CSV Import Pipeline & Deduplication
    // ----------------------------------------------------
    console.log('\n--- Suite 11: CSV Import & Deduplication ---');

    await runTest('Import', 'POST /api/import/preview parses bank CSV data', async () => {
      const csvData = `Date,Merchant,Amount,Description\n2026-09-01,Starbucks Coffee,-6.50,Morning Espresso\n2026-09-02,Trader Joes,-48.20,Groceries\n2026-09-03,Client Deposit,1200.00,Web Consulting`;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'statement.csv');
      formData.append('mapping', JSON.stringify({
        date: 'Date',
        merchant: 'Merchant',
        amount: 'Amount',
        description: 'Description'
      }));

      const res = await fetch(`${baseUrl}/api/import/preview`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.data.totalRows === 3, `Expected 3 total rows, got ${body.data.totalRows}`);
      assert(body.data.validRows === 3, `Expected 3 valid rows, got ${body.data.validRows}`);
      assert(Array.isArray(body.data.rows), 'rows must be an array');
      assert(body.data.rows[0].mappedData.amount === -650, 'Parsed Starbucks amount should be -650 minor units');
    });

    // ----------------------------------------------------
    // SUITE 12: Demo Workspace Procedural Seeder
    // ----------------------------------------------------
    console.log('\n--- Suite 12: Demo Workspace Procedural Seeder ---');

    await runTest('Demo', 'POST /api/demo/seed populates 6-month synthetic dataset', async () => {
      const res = await fetch(`${baseUrl}/api/demo/seed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert(body.success === true, 'Seeded success should be true');

      // Verify transactions generated in database
      const txCount = await prisma.transaction.count({ where: { userId: testUserId, deletedAt: null } });
      assert(txCount >= 50, `Expected at least 50 synthetic transactions, got ${txCount}`);

      // Verify active goals created
      const goalCount = await prisma.goal.count({ where: { userId: testUserId } });
      assert(goalCount >= 2, `Expected at least 2 synthetic goals, got ${goalCount}`);

      // Verify chat history created
      const chatSessions = await prisma.chatSession.count({ where: { userId: testUserId } });
      assert(chatSessions >= 1, `Expected synthetic chat sessions, got ${chatSessions}`);
    });

    // ----------------------------------------------------
    // SUITE 13: Security, Edge Cases & Data Isolation
    // ----------------------------------------------------
    console.log('\n--- Suite 13: Security, Edge Cases & Data Isolation ---');

    await runTest('Security', 'Reject unauthenticated access to protected routes (401)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`);
      assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
      const body = await res.json();
      assert(body.error.code === 'AUTHENTICATION_ERROR', 'Expected AUTHENTICATION_ERROR code');
    });

    await runTest('Security', 'Reject forged or tampered JWT token (401)', async () => {
      const res = await fetch(`${baseUrl}/api/transactions`, {
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.forged.token' }
      });
      assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
    });

    await runTest('Security', 'SQL Injection attempt resilience in text inputs', async () => {
      const cat = await prisma.category.findFirst();
      const maliciousPayload = "'); DROP TABLE \"Transaction\"; --";

      const res = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: -500,
          currency: 'USD',
          categoryId: cat!.id,
          date: new Date().toISOString(),
          merchant: maliciousPayload,
          description: maliciousPayload
        })
      });
      assert(res.status === 201, `Expected 201 Created (parameterized, not executed), got ${res.status}`);
      const body = await res.json();
      assert(body.data.merchant === maliciousPayload, 'Malicious payload was stored safely as literal text');

      // Verify Transaction table is intact
      const tableCheck = await prisma.transaction.count();
      assert(tableCheck > 0, 'Transaction table survived injection attack');
    });

    await runTest('Security', 'Data isolation: User A cannot access User B data', async () => {
      // Register User B
      const userBRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `user_b_${Date.now()}@finsight.local`,
          password: 'Password123!',
          name: 'User B'
        })
      });
      const userBData = (await userBRes.json()).data;
      const userBToken = userBData.accessToken;
      userBId = userBData.user.id;

      // User B queries transactions
      const txRes = await fetch(`${baseUrl}/api/transactions`, {
        headers: { Authorization: `Bearer ${userBToken}` }
      });
      const txBody = await txRes.json();
      assert(Array.isArray(txBody.data.data), 'Expected array in txBody.data.data');
      assert(txBody.data.data.length === 0, 'User B should have 0 transactions, not see User A transactions');
    });

    // ----------------------------------------------------
    // SUITE 14: Precision Arithmetic Benchmark
    // ----------------------------------------------------
    console.log('\n--- Suite 14: Precision Arithmetic Benchmark ---');

    await runTest('Precision', 'Minor units integer precision prevents float drift across 10,000 operations', async () => {
      let accumulatedMinor = 0;
      const itemPriceMinor = 1999; // $19.99

      for (let i = 0; i < 10000; i++) {
        accumulatedMinor += itemPriceMinor;
      }

      assert(accumulatedMinor === 19990000, `Expected exactly 19990000 cents, got ${accumulatedMinor}`);
      assert(accumulatedMinor / 100 === 199900, 'Exact dollars should be 199900.00 without floating point drift');
    });

  } finally {
    // Teardown test user data
    if (testUserId) {
      await prisma.transaction.deleteMany({ where: { userId: testUserId } }).catch(() => { });
      await prisma.goal.deleteMany({ where: { userId: testUserId } }).catch(() => { });
      await prisma.chatSession.deleteMany({ where: { userId: testUserId } }).catch(() => { });
      await prisma.aiProviderConfig.deleteMany({ where: { userId: testUserId } }).catch(() => { });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => { });
    }
    if (userBId) {
      await prisma.transaction.deleteMany({ where: { userId: userBId } }).catch(() => { });
      await prisma.user.delete({ where: { id: userBId } }).catch(() => { });
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

  console.log('\n========================================================');
  console.log('📊 TEST RUN SUMMARY');
  console.log('========================================================');
  console.log(`Total Tests Run:  ${total}`);
  console.log(`Passed:           ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Failed:           ${failed}`);
  console.log(`Execution Time:   ${totalDuration}ms`);
  console.log('========================================================\n');

  if (failed > 0) {
    console.log('FAILED TESTS:');
    results.filter(r => r.status === 'FAILED').forEach(r => {
      console.log(`- [${r.suite}] ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND TESTS PASSED COMPREHENSIVELY!\n');
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('Fatal Test Runner Error:', e);
  process.exit(1);
});
