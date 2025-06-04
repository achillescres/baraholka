import { apiClient } from '@/shared/api/client';

// Сначала объявляем моки
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

// Затем мокаем модуль
jest.mock('@/shared/api/client', () => ({
  apiClient: {
    get: () => mockGet(),
    post: (...args: unknown[]) => mockPost(...args),
    delete: (...args: unknown[]) => mockDelete(...args)
  }
}));

const MOCK_PRODUCT = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  category: 'electronics',
  images: ['image1.jpg', 'image2.jpg'],
  seller: {
    id: '1',
    username: 'testuser'
  }
};

const MOCK_PRODUCTS = [MOCK_PRODUCT];

describe('Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('должен получить список товаров с фильтрами', async () => {
      const filters = { category: 'electronics', minPrice: '100' };
      mockGet.mockResolvedValue(MOCK_PRODUCTS);

      const result = await apiClient.get('/products', { params: filters });

      expect(mockGet).toHaveBeenCalledWith('/products', { params: filters });
      expect(result).toEqual(MOCK_PRODUCTS);
    });

    it('должен получить список товаров без фильтров', async () => {
      mockGet.mockResolvedValue(MOCK_PRODUCTS);

      const result = await apiClient.get('/products', { params: {} });

      expect(mockGet).toHaveBeenCalledWith('/products', { params: {} });
      expect(result).toEqual(MOCK_PRODUCTS);
    });

    it('должен обработать ошибку при получении списка товаров', async () => {
      const error = new Error('Failed to fetch products');
      mockGet.mockRejectedValue(error);

      await expect(apiClient.get('/products', { params: {} }))
        .rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductById', () => {
    it('должен получить товар по ID', async () => {
      mockGet.mockResolvedValue(MOCK_PRODUCT);

      const result = await apiClient.get('/products/1');

      expect(mockGet).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(MOCK_PRODUCT);
    });

    it('должен обработать ошибку при получении товара', async () => {
      const error = new Error('Product not found');
      mockGet.mockRejectedValue(error);

      await expect(apiClient.get('/products/999'))
        .rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('должен создать новый товар', async () => {
      const formData = new FormData();
      formData.append('name', 'New Product');
      formData.append('description', 'New Description');
      formData.append('price', '200');
      formData.append('category', 'electronics');
      formData.append('images', 'image1.jpg');

      const mockResponse = {
        id: '2',
        name: 'New Product',
        description: 'New Description',
        price: 200,
        category: 'electronics',
        images: ['image1.jpg']
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/products', formData);

      expect(mockPost).toHaveBeenCalledWith('/products', formData);
      expect(result).toEqual(mockResponse);
    });

    it('должен обработать ошибку при создании товара', async () => {
      const error = new Error('Invalid product data');
      mockPost.mockRejectedValue(error);

      const formData = new FormData();
      await expect(apiClient.post('/products', formData))
        .rejects.toThrow('Invalid product data');
    });
  });

  describe('deleteProduct', () => {
    it('должен удалить товар', async () => {
      mockDelete.mockResolvedValue({ success: true });

      const result = await apiClient.delete('/products/1');

      expect(mockDelete).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual({ success: true });
    });

    it('должен обработать ошибку при удалении товара', async () => {
      const error = new Error('Product not found');
      mockDelete.mockRejectedValue(error);
      
      await expect(apiClient.delete('/products/999'))
        .rejects.toThrow('Product not found');
    });
  });
}); 