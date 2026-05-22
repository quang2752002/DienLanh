export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  created?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}
