import { BaseApiService } from './baseApi';
import { Category, CreateCategoryInput } from '@/types/category';

class CategoryApiService extends BaseApiService<Category, CreateCategoryInput, CreateCategoryInput> {
  constructor() {
    super('/Categories');
  }

  // Bạn có thể viết thêm các hàm đặc thù của Category ngoài CRUD cơ bản tại đây
  // Ví dụ: getActiveCategories = async () => { ... }
}

export const categoryApi = new CategoryApiService();
