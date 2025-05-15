'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/client';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import type { User } from '@/entities/user/model/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<User>('/auth/profile');
      setUser(data);
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
      setError('Не удалось загрузить профиль');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout', {});
      router.push('/login');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      setError('Не удалось выйти из системы');
    }
  };

  if (loading) {
    return <div className="text-center">Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Профиль</h1>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                value={user.email}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
              <Input
                value={user.username}
                disabled
                className="mt-1"
              />
            </div>
            {user.avatar && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Аватар</label>
                <div className="relative w-32 h-32 mt-2">
                  <Image
                    src={user.avatar}
                    alt="Аватар"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 