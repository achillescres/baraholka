'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { apiClient } from '@/shared/api/client';
import type { CreateProductData } from '@/entities/product/types';

const categories = ['Электроника', 'Одежда', 'Книги', 'Спорт', 'Другое'];
const conditions = ['Новое', 'Как новое', 'Б/у'];
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProductData>({
    title: '',
    description: '',
    price: '',
    category: categories[0],
    condition: conditions[0],
    images: [],
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Проверяем количество файлов
    if (imageFiles.length + files.length > MAX_IMAGES) {
      setError(`Можно загрузить максимум ${MAX_IMAGES} изображений`);
      return;
    }

    // Проверяем размер каждого файла
    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      setError(`Некоторые файлы превышают максимальный размер ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // Проверяем тип файлов
    const invalidTypes = files.filter(file => !file.type.startsWith('image/'));
    if (invalidTypes.length > 0) {
      setError('Можно загружать только изображения');
      return;
    }

    if (files.length > 0) {
      setError(null);
      // Сохраняем файлы
      setImageFiles(prev => [...prev, ...files]);
      
      // Создаем превью для новых изображений
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Освобождаем URL для удаленного изображения
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image${index}`, file);
      });

      console.log('Sending request to /products');
      const response = await apiClient.post('/products', formDataToSend);
      console.log('Response:', response);
      
      router.push('/profile');
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании товара';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Очищаем URL при размонтировании компонента
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Создать новый товар</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Input
            label="Название товара"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Введите название товара"
          />

          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Опишите ваш товар"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <Input
            label="Цена"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Введите цену"
          />

          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">
              Категория
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">
              Состояние
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black-700 mb-1">
              Изображения ({imageFiles.length}/{MAX_IMAGES})
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={imageFiles.length >= MAX_IMAGES}
              >
                {imageFiles.length >= MAX_IMAGES 
                  ? 'Достигнут лимит изображений' 
                  : 'Добавить изображения'}
              </Button>

              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={url} className="relative aspect-square group">
                      <Image
                        src={url}
                        alt={`Превью ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Создать товар'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 