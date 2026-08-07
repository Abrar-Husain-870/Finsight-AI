import { PrismaClient } from '@prisma/client';
import { dashboardService } from './src/features/dashboard/dashboard.service.js';

const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) {
    console.log("No users found.");
    return;
  }
  const userId = users[0].id;
  console.log(`Testing with user: ${userId}`);
  
  const summary = await dashboardService.getSummary(userId);
  console.log("Monthly Trend:");
  console.log(JSON.stringify(summary.monthlyTrend, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
