import { getProducts, getProductById, createProduct, deleteProduct } from '@/shared/api/client';
import { apiClient } from '@/shared/api/client';

jest.mock('@/shared/api/client');

describe('Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('должен получить список товаров с фильтрами', async () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Test Product',
          price: '1000',
          category: 'Электроника',
          condition: 'Новое',
          images: ['image1.jpg'],
          userId: 'user1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockProducts);

      const filters = {
        search: 'test',
        category: 'Электроника',
        condition: 'Новое',
        minPrice: '500',
        maxPrice: '2000',
        sortBy: 'newest'
      };

      const result = await getProducts(filters);

      expect(apiClient.get).toHaveBeenCalledWith('/products', { params: filters });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('должен получить товар по ID', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        price: '1000',
        category: 'Электроника',
        condition: 'Новое',
        images: ['image1.jpg'],
        userId: 'user1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockProduct);

      const result = await getProductById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('должен создать новый товар', async () => {
      const mockProduct = {
        id: '1',
        title: 'New Product',
        price: '1000',
        category: 'Электроника',
        condition: 'Новое',
        images: ['image1.jpg'],
        userId: 'user1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      const formData = new FormData();
      formData.append('title', 'New Product');
      formData.append('price', '1000');
      formData.append('category', 'Электроника');
      formData.append('condition', 'Новое');
      formData.append('image0', new File([], 'image1.jpg'));

      (apiClient.post as jest.Mock).mockResolvedValue(mockProduct);

      const result = await createProduct(formData);

      expect(apiClient.post).toHaveBeenCalledWith('/products', formData);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('должен удалить товар', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ success: true });

      const result = await deleteProduct('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual({ success: true });
    });
  });
}); 