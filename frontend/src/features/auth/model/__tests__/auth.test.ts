import { login, register } from '@/features/auth/model/auth';
import { apiClient } from '@/shared/api/client';

jest.mock('@/shared/api/client');

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('должен успешно авторизовать пользователя', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: '1',
          email: 'test@test.com',
          username: 'testuser'
        }
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await login('test@test.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse);
    });

    it('должен обработать ошибку авторизации', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValue(error);

      await expect(login('test@test.com', 'wrong-password')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('должен успешно зарегистрировать пользователя', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: '1',
          email: 'new@test.com',
          username: 'newuser'
        }
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await register('new@test.com', 'password123', 'newuser');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'new@test.com',
        password: 'password123',
        username: 'newuser'
      });
      expect(result).toEqual(mockResponse);
    });

    it('должен обработать ошибку регистрации', async () => {
      const error = new Error('Email already exists');
      (apiClient.post as jest.Mock).mockRejectedValue(error);

      await expect(register('existing@test.com', 'password123', 'existinguser'))
        .rejects.toThrow('Email already exists');
    });
  });
}); 