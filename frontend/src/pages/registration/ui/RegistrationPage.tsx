'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { apiClient } from '@/shared/api/client';
import type { RegisterData } from '@/entities/user/model/types';

interface ApiResponse {
  message?: string;
}

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post<ApiResponse>('/auth/register', formData);
      setSuccess(response.message || 'Регистрация успешна! Перенаправление на страницу входа...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации. Попробуйте еще раз.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Регистрация
          </h2>
          {error && (
            <div className="mt-2 text-red-500 text-center text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-2 text-green-500 text-center text-sm">
              {success}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Имя пользователя"
              name="username"
              type="text"
              required
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              required
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" fullWidth>
            Зарегистрироваться
          </Button>
        </form>
      </div>
    </div>
  );
} 