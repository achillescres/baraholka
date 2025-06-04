export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  images: string[];
} 