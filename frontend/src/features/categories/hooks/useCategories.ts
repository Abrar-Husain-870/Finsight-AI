import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api.js';

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: categoryApi.getTree,
    staleTime: 1000 * 60 * 60 * 24, // Categories rarely change (24 hours)
  });
}

export function useCategoriesFlat() {
  return useQuery({
    queryKey: ['categories', 'flat'],
    queryFn: categoryApi.getAll,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
