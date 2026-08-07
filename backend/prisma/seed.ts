import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Income',
    type: 'INCOME',
    icon: 'ArrowDownToLine',
    color: 'emerald-500',
    children: [
      { name: 'Salary', icon: 'Briefcase', color: 'emerald-600' },
      { name: 'Freelance', icon: 'Laptop', color: 'emerald-400' },
      { name: 'Investments', icon: 'TrendingUp', color: 'emerald-700' },
      { name: 'Other Income', icon: 'PlusCircle', color: 'emerald-300' },
    ]
  },
  {
    name: 'Housing',
    type: 'EXPENSE',
    icon: 'Home',
    color: 'blue-500',
    children: [
      { name: 'Rent/Mortgage', icon: 'Key', color: 'blue-600' },
      { name: 'Utilities', icon: 'Zap', color: 'blue-400' },
      { name: 'Maintenance', icon: 'Wrench', color: 'blue-700' },
    ]
  },
  {
    name: 'Transportation',
    type: 'EXPENSE',
    icon: 'Car',
    color: 'orange-500',
    children: [
      { name: 'Fuel', icon: 'Fuel', color: 'orange-600' },
      { name: 'Public Transit', icon: 'Bus', color: 'orange-400' },
      { name: 'Auto Maintenance', icon: 'Wrench', color: 'orange-700' },
    ]
  },
  {
    name: 'Food & Dining',
    type: 'EXPENSE',
    icon: 'Utensils',
    color: 'red-500',
    children: [
      { name: 'Groceries', icon: 'ShoppingCart', color: 'red-600' },
      { name: 'Restaurants', icon: 'UtensilsCrossed', color: 'red-400' },
      { name: 'Coffee', icon: 'Coffee', color: 'amber-600' },
    ]
  },
  {
    name: 'Savings',
    type: 'SAVINGS',
    icon: 'PiggyBank',
    color: 'purple-500',
    children: [
      { name: 'Emergency Fund', icon: 'ShieldAlert', color: 'purple-600' },
      { name: 'Vacation', icon: 'Plane', color: 'purple-400' },
    ]
  },
  {
    name: 'Investments',
    type: 'INVESTMENT',
    icon: 'TrendingUp',
    color: 'indigo-500',
    children: [
      { name: 'Stocks', icon: 'LineChart', color: 'indigo-600' },
      { name: 'Crypto', icon: 'Bitcoin', color: 'indigo-400' },
      { name: 'Retirement', icon: 'Landmark', color: 'indigo-700' },
    ]
  }
];

async function main() {
  console.log('Start seeding categories...');
  
  // Clear existing categories
  await prisma.category.deleteMany();
  
  for (const parent of categories) {
    const parentRecord = await prisma.category.create({
      data: {
        name: parent.name,
        type: parent.type,
        icon: parent.icon,
        color: parent.color,
      }
    });
    
    if (parent.children && parent.children.length > 0) {
      for (const child of parent.children) {
        await prisma.category.create({
          data: {
            name: child.name,
            type: parent.type, // inherit type
            icon: child.icon,
            color: child.color,
            parentId: parentRecord.id
          }
        });
      }
    }
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
