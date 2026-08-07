import { Request, Response, NextFunction } from 'express';
import { categoryService } from './category.service.js';
import { sendSuccess } from '../../core/utils/response.js';

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await categoryService.getCategoryTree();
      sendSuccess(res, tree);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
