import { prisma } from '../../../prisma/index.js';

export class DemoService {
  async seedDemoWorkspace(userId: string) {
    // 1. Wipe existing user data
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.goal.deleteMany({ where: { userId } });
    await prisma.chatSession.deleteMany({ where: { userId } });

    // 2. Fetch categories
    const categories = await prisma.category.findMany();
    const getCat = (nameStr: string, type: 'INCOME' | 'EXPENSE') => {
      const cat = categories.find(c => c.name.toLowerCase().includes(nameStr.toLowerCase()) && c.type === type);
      return cat ? cat.id : categories.find(c => c.type === type)?.id!;
    };

    const salaryCatId = getCat('salary', 'INCOME');
    const rentCatId = getCat('housing', 'EXPENSE') || getCat('home', 'EXPENSE');
    const foodCatId = getCat('food', 'EXPENSE');
    const transportCatId = getCat('transport', 'EXPENSE');
    const utilCatId = getCat('utilit', 'EXPENSE');
    const entCatId = getCat('entertainment', 'EXPENSE');
    const shopCatId = getCat('shopping', 'EXPENSE');

    // 3. Generate Transactions (last 6 months)
    const txToCreate: any[] = [];
    const now = new Date();
    
    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      
      // Salary (1st of month)
      const salaryDate = new Date(monthDate);
      salaryDate.setDate(1);
      txToCreate.push({
        userId, categoryId: salaryCatId, amount: 7500000, currency: 'USD', date: salaryDate, merchant: 'TechCorp Inc', description: 'Monthly Salary'
      });

      // Rent (2nd of month)
      const rentDate = new Date(monthDate);
      rentDate.setDate(2);
      txToCreate.push({
        userId, categoryId: rentCatId, amount: -1800000, currency: 'USD', date: rentDate, merchant: 'Oakwood Properties', description: 'Monthly Rent'
      });

      // Utilities (5th of month)
      const utilDate = new Date(monthDate);
      utilDate.setDate(5);
      txToCreate.push({
        userId, categoryId: utilCatId, amount: -400000 + (Math.random() * 50000 - 25000), currency: 'USD', date: utilDate, merchant: 'City Power & Water', description: 'Utilities'
      });

      // Food (multiple times a month)
      for (let i = 0; i < 15; i++) {
        const foodDate = new Date(monthDate);
        foodDate.setDate(Math.floor(Math.random() * 28) + 1);
        txToCreate.push({
          userId, categoryId: foodCatId, amount: -60000 - (Math.random() * 20000), currency: 'USD', date: foodDate, merchant: ['Whole Foods', 'Trader Joes', 'Sweetgreen', 'Local Cafe'][Math.floor(Math.random() * 4)], description: 'Groceries / Dining'
        });
      }

      // Entertainment (weekend)
      for (let i = 0; i < 4; i++) {
        const entDate = new Date(monthDate);
        entDate.setDate(Math.floor(Math.random() * 28) + 1);
        txToCreate.push({
          userId, categoryId: entCatId, amount: -100000 - (Math.random() * 30000), currency: 'USD', date: entDate, merchant: ['Netflix', 'Spotify', 'AMC Theaters', 'Steam'][Math.floor(Math.random() * 4)], description: 'Entertainment'
        });
      }

      // Shopping (Random)
      for (let i = 0; i < 2; i++) {
        const shopDate = new Date(monthDate);
        shopDate.setDate(Math.floor(Math.random() * 28) + 1);
        txToCreate.push({
          userId, categoryId: shopCatId, amount: -200000 - (Math.random() * 50000), currency: 'USD', date: shopDate, merchant: 'Amazon', description: 'Shopping'
        });
      }
    }

    await prisma.transaction.createMany({ data: txToCreate.map(tx => ({...tx, amount: Math.round(tx.amount), merchant: tx.merchant || null})) });

    // 4. Generate Goals
    const targetDate1 = new Date();
    targetDate1.setMonth(targetDate1.getMonth() + 12);
    
    const targetDate2 = new Date();
    targetDate2.setMonth(targetDate2.getMonth() + 3);

    await prisma.goal.createMany({
      data: [
        { userId, name: 'Emergency Fund', targetAmount: 30000000, currentAmount: 18000000, targetDate: targetDate1, color: '#3b82f6' },
        { userId, name: 'Vacation', targetAmount: 5000000, currentAmount: 5000000, targetDate: targetDate2, color: '#10b981' }, // 100% complete for celebration delight
        { userId, name: 'New Laptop', targetAmount: 12000000, currentAmount: 4500000, targetDate: targetDate2, color: '#8b5cf6' }
      ]
    });

    // 5. Seed AI Chat
    const session = await prisma.chatSession.create({
      data: { userId, title: 'Health Score Analysis' }
    });

    await prisma.chatMessage.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: 'Why did my health score drop slightly this month?' },
        { sessionId: session.id, role: 'assistant', content: 'Based on your deterministic analytics, your health score dropped by 4 points because your **Spending Velocity** increased. You spent ₹25,000 in the first week of this month on Shopping, which is 40% higher than your historical average.\n\nTo recover, try pausing discretionary spending for the next two weeks.' }
      ]
    });
  }
}

export const demoService = new DemoService();
