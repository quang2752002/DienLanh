export interface Repair {
  id: number;
  name: string;
  description?: string;
  img?: string;
  content?: string;
  slug?: string;
  categoryId?: number;
  categoryName?: string;
  created?: string;
  createdBy?: string;
  lastModified?: string;
  lastModifiedBy?: string;
}

export interface CreateRepairInput {
  name: string;
  description?: string;
  img?: string;
  content?: string;
  slug?: string;
  categoryId?: number;
}
