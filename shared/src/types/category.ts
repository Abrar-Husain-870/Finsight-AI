
export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  TRANSFER = 'TRANSFER'
}

export interface CategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  parentId: string | null;
}

export interface CategoryTreeNode extends CategoryResponse {
  children: CategoryTreeNode[];
}
