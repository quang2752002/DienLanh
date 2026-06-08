import { useCrud } from '@/hooks/useCrud';
import { menuApi } from '@/apis/menuApi';
import { Menu, CreateMenuInput } from '@/types/menu';

export const useMenus = () => {
  const {
    data: menus,
    loading,
    error,
    refresh,
    create: createMenu,
    update: updateMenu,
    remove: removeMenu,
  } = useCrud<Menu, CreateMenuInput, Menu>(menuApi);

  return {
    menus,
    loading,
    error,
    refresh,
    createMenu,
    updateMenu,
    removeMenu,
  };
};
