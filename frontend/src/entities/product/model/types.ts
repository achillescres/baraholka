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

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
} 