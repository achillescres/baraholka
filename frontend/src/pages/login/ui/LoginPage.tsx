'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { apiClient } from '@/shared/api/client';
import type { UserCredentials, User } from '@/entities/user/model/types';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post<{ message: string; user: User }>('/auth/login', formData);
      console.log('Успешный вход:', response);
      router.push('/');
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при входе';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            Вход в систему
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              required
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
} 