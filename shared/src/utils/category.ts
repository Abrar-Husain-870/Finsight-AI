import { CategoryType } from '../types/category.js';

export const isExpense = (type: CategoryType | string): boolean => type === CategoryType.EXPENSE;
export const isIncome = (type: CategoryType | string): boolean => type === CategoryType.INCOME;
export const isSavings = (type: CategoryType | string): boolean => type === CategoryType.SAVINGS;
export const isInvestment = (type: CategoryType | string): boolean => type === CategoryType.INVESTMENT;
export const isTransfer = (type: CategoryType | string): boolean => type === CategoryType.TRANSFER;
