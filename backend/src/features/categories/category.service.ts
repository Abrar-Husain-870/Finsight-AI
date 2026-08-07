import { categoryRepository } from './category.repository.js';
import { CategoryResponse, CategoryTreeNode, CategoryType } from '@finsight/shared';
import { Category } from '@prisma/client';

type CatWithChildren = Category & { children?: CatWithChildren[] };

export class CategoryService {
  async getAllCategories(): Promise<CategoryResponse[]> {
    const categories = await categoryRepository.findAll();
    return categories.map(c => ({
      ...c,
      type: c.type as CategoryType
    }));
  }

  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    const rootCategories = await categoryRepository.findTree();
    
    const mapToTree = (cat: CatWithChildren): CategoryTreeNode => ({
      id: cat.id,
      name: cat.name,
      type: cat.type as CategoryType,
      icon: cat.icon,
      color: cat.color,
      parentId: cat.parentId,
      children: cat.children ? cat.children.map(mapToTree) : []
    });

    return rootCategories.map(mapToTree);
  }
}

export const categoryService = new CategoryService();
