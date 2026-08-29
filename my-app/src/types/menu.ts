export interface Menu {
  id: string | number;
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  parentId?: string | number | null;
  parentTitle?: string | null;
  created?: string;
  children?: Menu[];
}

export interface CreateMenuInput {
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
  parentId?: string | number | null;
  isActive?: boolean;
}

