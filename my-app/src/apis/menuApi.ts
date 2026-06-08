import { BaseApiService } from './baseApi';
import { Menu, CreateMenuInput } from '@/types/menu';

class MenuApiService extends BaseApiService<Menu, CreateMenuInput, Menu> {
  constructor() {
    super('/Menus');
  }
}

export const menuApi = new MenuApiService();
