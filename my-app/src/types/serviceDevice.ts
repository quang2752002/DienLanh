export interface ServiceDevice {
  id: string;
  name: string;
  brand: string;
  modelNumber?: string;
  serialNumber?: string;
  description?: string;
  price?: string;
  rating?: number;
  icon?: string;
  isActive?: boolean;
  content?: string;
  categoryId: string;
  categoryName?: string;
  created?: string;
}

export interface CreateServiceDeviceInput {
  name: string;
  brand: string;
  modelNumber?: string;
  serialNumber?: string;
  description?: string;
  price?: string;
  rating?: number;
  icon?: string;
  isActive?: boolean;
  content?: string;
  categoryId: string;
}
