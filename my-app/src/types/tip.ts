export interface Tip {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  author: string;
  isActive: boolean;
  created?: string;
}

export interface CreateTipInput {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  author: string;
}
