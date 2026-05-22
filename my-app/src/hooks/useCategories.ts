import { useCrud } from './useCrud';
import { categoryApi } from '../apis/categoryApi';
import { Category, CreateCategoryInput } from '../types/category';

export const useCategories = () => {
  const {
    data: categories,
    loading,
    error,
    refresh,
    create: createCategory,
  } = useCrud<Category, CreateCategoryInput, CreateCategoryInput>(categoryApi);

  return {
    categories,
    loading,
    error,
    refresh,
    createCategory,
  };
};
