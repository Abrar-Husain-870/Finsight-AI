import { prisma } from '../../../prisma/index.js';

export class DemoService {
  async seedDemoWorkspace(userId: string) {
    // 1. Wipe existing user data
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.goal.deleteMany({ where: { userId } });
    await prisma.chatSession.deleteMany({ where: { userId } });

    // 2. Fetch or create categories
    const categories = await prisma.category.findMany();
    
    // Helper to find category ID, creating if not existing
    const ensureCat = async (
      name: string,
      type: 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'INVESTMENT',
      icon = 'Tag',
      color = 'blue-500',
      parentId?: string
    ) => {
      let cat = categories.find(
        c => c.name.toLowerCase() === name.toLowerCase() && c.type === type
      );
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name,
            type,
            icon,
            color,
            ...(parentId ? { parentId } : {})
          }
        });
        categories.push(cat);
      }
      return cat.id;
    };

    // Ensure parent categories
    const housingParentId = await ensureCat('Housing', 'EXPENSE', 'Home', 'blue-500');
    const foodParentId = await ensureCat('Food & Dining', 'EXPENSE', 'Utensils', 'red-500');
    const transportParentId = await ensureCat('Transportation', 'EXPENSE', 'Car', 'orange-500');
    const shoppingParentId = await ensureCat('Shopping', 'EXPENSE', 'ShoppingBag', 'pink-500');
    const entParentId = await ensureCat('Entertainment', 'EXPENSE', 'Film', 'purple-500');
    const investParentId = await ensureCat('Investments', 'INVESTMENT', 'TrendingUp', 'indigo-500');
    const incomeParentId = await ensureCat('Income', 'INCOME', 'Briefcase', 'emerald-500');

    // Subcategories
    const rentCatId = await ensureCat('Rent/Mortgage', 'EXPENSE', 'Key', 'blue-600', housingParentId);
    const utilCatId = await ensureCat('Utilities', 'EXPENSE', 'Zap', 'blue-400', housingParentId);
    const homeMaintCatId = await ensureCat('Maintenance', 'EXPENSE', 'Wrench', 'blue-700', housingParentId);

    const groceryCatId = await ensureCat('Groceries', 'EXPENSE', 'ShoppingCart', 'red-600', foodParentId);
    const restaurantCatId = await ensureCat('Restaurants', 'EXPENSE', 'UtensilsCrossed', 'red-400', foodParentId);
    const coffeeCatId = await ensureCat('Coffee', 'EXPENSE', 'Coffee', 'amber-600', foodParentId);

    const fuelCatId = await ensureCat('Fuel', 'EXPENSE', 'Fuel', 'orange-600', transportParentId);
    const transitCatId = await ensureCat('Public Transit', 'EXPENSE', 'Bus', 'orange-400', transportParentId);
    const rideshareCatId = await ensureCat('Rideshare', 'EXPENSE', 'Car', 'orange-500', transportParentId);

    const electronicsCatId = await ensureCat('Electronics', 'EXPENSE', 'Laptop', 'pink-600', shoppingParentId);
    const clothingCatId = await ensureCat('Clothing', 'EXPENSE', 'Shirt', 'pink-400', shoppingParentId);
    const genShopCatId = await ensureCat('General Shopping', 'EXPENSE', 'Package', 'pink-500', shoppingParentId);

    const subCatId = await ensureCat('Subscriptions', 'EXPENSE', 'Tv', 'purple-600', entParentId);
    const gamingCatId = await ensureCat('Gaming', 'EXPENSE', 'Gamepad2', 'purple-400', entParentId);

    const stocksCatId = await ensureCat('Stocks', 'INVESTMENT', 'LineChart', 'indigo-600', investParentId);
    const cryptoCatId = await ensureCat('Crypto', 'INVESTMENT', 'Bitcoin', 'indigo-400', investParentId);

    const salaryCatId = await ensureCat('Salary', 'INCOME', 'Briefcase', 'emerald-600', incomeParentId);
    const freelanceCatId = await ensureCat('Freelance', 'INCOME', 'Laptop', 'emerald-400', incomeParentId);

    // 3. Generate Transactions (last 6 months)
    const txToCreate: Array<{
      userId: string;
      categoryId: string;
      amount: number;
      currency: string;
      date: Date;
      merchant: string;
      description: string;
      notes: string;
    }> = [];

    const now = new Date();

    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);

      // Income: Salary (1st of month)
      const salaryDate = new Date(monthDate); salaryDate.setDate(1);
      txToCreate.push({
        userId, categoryId: salaryCatId, amount: 550000, currency: 'USD', date: salaryDate, merchant: 'TechCorp Inc', description: 'Monthly Salary', notes: '⭐ Rating: 5/5 Monthly salary paycheck'
      });

      // Income: Freelance (15th of month)
      const freelanceDate = new Date(monthDate); freelanceDate.setDate(15);
      txToCreate.push({
        userId, categoryId: freelanceCatId, amount: 120000, currency: 'USD', date: freelanceDate, merchant: 'Consulting Client', description: 'Freelance Design Project', notes: '⭐ Rating: 4/5 Freelance side income'
      });

      // Housing: Rent (2nd of month)
      const rentDate = new Date(monthDate); rentDate.setDate(2);
      txToCreate.push({
        userId, categoryId: rentCatId, amount: -180000, currency: 'USD', date: rentDate, merchant: 'Oakwood Properties', description: 'Monthly Apartment Rent', notes: '⭐ Rating: 5/5 Essential housing expense'
      });

      // Housing: Utilities (5th of month)
      const utilDate = new Date(monthDate); utilDate.setDate(5);
      txToCreate.push({
        userId, categoryId: utilCatId, amount: -32000, currency: 'USD', date: utilDate, merchant: 'City Power & Water', description: 'Electricity & Water', notes: '⭐ Rating: 5/5 Necessary monthly utilities'
      });

      // Housing: Maintenance (18th of month)
      const maintDate = new Date(monthDate); maintDate.setDate(18);
      txToCreate.push({
        userId, categoryId: homeMaintCatId, amount: -15000, currency: 'USD', date: maintDate, merchant: 'HomeFix Services', description: 'Plumbing Repairs', notes: '⭐ Rating: 4/5 Necessary home repair'
      });

      // Food: Groceries (Weekly)
      [4, 11, 18, 25].forEach((day, idx) => {
        const d = new Date(monthDate); d.setDate(day);
        const merchant = idx % 2 === 0 ? 'Whole Foods' : 'Trader Joes';
        txToCreate.push({
          userId, categoryId: groceryCatId, amount: -(14000 + Math.floor(Math.random() * 6000)), currency: 'USD', date: d, merchant, description: 'Weekly Groceries', notes: '⭐ Rating: 4/5 Essential healthy food groceries'
        });
      });

      // Food: Restaurants (5x / month)
      [6, 12, 19, 23, 27].forEach((day) => {
        const d = new Date(monthDate); d.setDate(day);
        txToCreate.push({
          userId, categoryId: restaurantCatId, amount: -(4500 + Math.floor(Math.random() * 5000)), currency: 'USD', date: d, merchant: 'Sweetgreen', description: 'Dining Out', notes: '⭐ Rating: 3/5 Social meal with friends'
        });
      });

      // Food: Coffee (6x / month)
      [3, 8, 14, 17, 22, 26].forEach((day) => {
        const d = new Date(monthDate); d.setDate(day);
        txToCreate.push({
          userId, categoryId: coffeeCatId, amount: -(800 + Math.floor(Math.random() * 1200)), currency: 'USD', date: d, merchant: 'Starbucks', description: 'Morning Latte', notes: '⭐ Rating: 2/5 Impulsive coffee run'
        });
      });

      // Transport: Fuel (10th & 24th)
      [10, 24].forEach((day) => {
        const d = new Date(monthDate); d.setDate(day);
        txToCreate.push({
          userId, categoryId: fuelCatId, amount: -5500, currency: 'USD', date: d, merchant: 'Shell Oil', description: 'Gas station fuel', notes: '⭐ Rating: 4/5 Commute fuel'
        });
      });

      // Transport: Public Transit & Rideshare
      const transitDate = new Date(monthDate); transitDate.setDate(7);
      txToCreate.push({
        userId, categoryId: transitCatId, amount: -4500, currency: 'USD', date: transitDate, merchant: 'Metro Transit', description: 'Monthly Subway Pass', notes: '⭐ Rating: 5/5 Essential public transportation'
      });

      const uberDate = new Date(monthDate); uberDate.setDate(21);
      txToCreate.push({
        userId, categoryId: rideshareCatId, amount: -3500, currency: 'USD', date: uberDate, merchant: 'Uber', description: 'Late Night Ride', notes: '⭐ Rating: 2/5 Unplanned rideshare trip'
      });

      // Shopping: Electronics & Clothing & General
      const appleDate = new Date(monthDate); appleDate.setDate(13);
      txToCreate.push({
        userId, categoryId: electronicsCatId, amount: -35000, currency: 'USD', date: appleDate, merchant: 'Apple Store', description: 'Tech Accessory & Cables', notes: '⭐ Rating: 4/5 Useful work hardware accessory'
      });

      const clothingDate = new Date(monthDate); clothingDate.setDate(16);
      txToCreate.push({
        userId, categoryId: clothingCatId, amount: -18000, currency: 'USD', date: clothingDate, merchant: 'Uniqlo', description: 'Seasonal Apparel', notes: '⭐ Rating: 3/5 Casual clothes update'
      });

      const amazonDate = new Date(monthDate); amazonDate.setDate(28);
      txToCreate.push({
        userId, categoryId: genShopCatId, amount: -22000, currency: 'USD', date: amazonDate, merchant: 'Amazon', description: 'Impulse Online Shopping', notes: '⭐ Rating: 1/5 Regretful impulse purchase'
      });

      // Entertainment: Subscriptions & Gaming
      const subDate = new Date(monthDate); subDate.setDate(1);
      txToCreate.push({
        userId, categoryId: subCatId, amount: -2999, currency: 'USD', date: subDate, merchant: 'Netflix', description: 'Streaming Subscription', notes: '⭐ Rating: 4/5 Monthly entertainment'
      });

      const gameDate = new Date(monthDate); gameDate.setDate(20);
      txToCreate.push({
        userId, categoryId: gamingCatId, amount: -5999, currency: 'USD', date: gameDate, merchant: 'Steam', description: 'Video Game Purchase', notes: '⭐ Rating: 1/5 Unplayed impulse video game'
      });

      // Investments: Stocks & Crypto
      const stockDate = new Date(monthDate); stockDate.setDate(10);
      txToCreate.push({
        userId, categoryId: stocksCatId, amount: -40000, currency: 'USD', date: stockDate, merchant: 'Vanguard', description: 'Index Fund Investment', notes: '⭐ Rating: 5/5 Wealth building investment'
      });

      const cryptoDate = new Date(monthDate); cryptoDate.setDate(22);
      txToCreate.push({
        userId, categoryId: cryptoCatId, amount: -15000, currency: 'USD', date: cryptoDate, merchant: 'Coinbase', description: 'Crypto Investment', notes: '⭐ Rating: 2/5 Speculative crypto purchase'
      });
    }

    // Insert all transactions
    await prisma.transaction.createMany({
      data: txToCreate.map(tx => ({
        ...tx,
        amount: Math.round(tx.amount),
        merchant: tx.merchant || null,
        notes: tx.notes || null,
      }))
    });

    // 4. Generate Goals
    const targetDate1 = new Date(); targetDate1.setMonth(targetDate1.getMonth() + 12);
    const targetDate2 = new Date(); targetDate2.setMonth(targetDate2.getMonth() + 3);
    const targetDate3 = new Date(); targetDate3.setMonth(targetDate3.getMonth() + 6);

    await prisma.goal.createMany({
      data: [
        { userId, name: 'Emergency Reserve', targetAmount: 3000000, currentAmount: 1800000, targetDate: targetDate1, color: '#3b82f6' },
        { userId, name: 'Vacation Trip', targetAmount: 500000, currentAmount: 500000, targetDate: targetDate2, color: '#10b981' },
        { userId, name: 'New Laptop', targetAmount: 250000, currentAmount: 180000, targetDate: targetDate2, color: '#8b5cf6' },
        { userId, name: 'Investment Fund', targetAmount: 1000000, currentAmount: 650000, targetDate: targetDate3, color: '#f59e0b' }
      ]
    });

    // 5. Seed AI Chat
    const session = await prisma.chatSession.create({
      data: { userId, title: 'Health Score Analysis' }
    });

    await prisma.chatMessage.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: 'Why did my health score drop slightly this month?' },
        { sessionId: session.id, role: 'assistant', content: 'Based on your deterministic analytics, your health score dropped by 4 points because your **Spending Velocity** increased. You spent $220 in the third week of this month on impulse Amazon purchases, which is 35% higher than your historical average.\n\nTo recover, try pausing discretionary shopping for the next two weeks.' }
      ]
    });
  }
}

export const demoService = new DemoService();
