export interface Menu {
  id: string;
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  created?: string;
}

export interface CreateMenuInput {
  title: string;
  url: string;
  icon?: string;
  sortOrder: number;
}
