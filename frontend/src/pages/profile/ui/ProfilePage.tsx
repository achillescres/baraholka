'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button/Button';
import { apiClient } from '@/shared/api/client';
import type { User } from '@/entities/user/model/types';
import { useAuth } from '@/shared/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User> & { password?: string; newPassword?: string }>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data);
        setEditedUser({
          email: data.email,
          username: data.username,
        });
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEdit = () => {
    if (user) {
      setEditedUser({
        email: user.email,
        username: user.username,
      });
    }
    setIsEditing(true);
    setUpdateError(null);
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        email: user.email,
        username: user.username,
      });
    }
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      const response = await apiClient.put<{ user: User; message: string }>('/auth/profile', editedUser);

      setUser(response.user);
      setIsEditing(false);
      setEditedUser({
        email: response.user.email,
        username: response.user.username,
      });
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить профиль';
      setUpdateError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch {
      setError('Ошибка при выходе из системы');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push('/login')}>Войти</Button>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-24 h-24">
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt={user.username}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {updateError && (
              <div className="text-red-500 text-sm">{updateError}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-black-700">Имя пользователя</label>
              <input
                type="text"
                name="username"
                value={editedUser.username || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedUser.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black-700">Новый пароль (оставьте пустым, если не хотите менять)</label>
              <input
                type="password"
                name="newPassword"
                value={editedUser.newPassword || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit">Сохранить</Button>
              <Button type="button" onClick={handleCancel}>Отмена</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Информация о пользователе</h2>
              <p className="mt-1 text-sm text-gray-600">
                Дата регистрации: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleEdit}>Редактировать профиль</Button>
              <Button onClick={handleLogout} variant="secondary">Выйти</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 