'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { apiClient } from '@/shared/api/client';
import type { Product, ProductFilters } from '@/entities/product/model/types';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';

export default function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const stringParams = Object.entries(filters).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value?.toString()
      }), {});
      const data = await apiClient.get<Product[]>('/products', { params: stringParams });
      setProducts(data);
    } catch (err) {
      console.error('Ошибка при загрузке товаров:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Товары</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Поиск товаров..."
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.images[0] && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-xl font-bold text-indigo-600">{product.price} ₽</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => {/* TODO: Добавить функционал покупки */}}
                >
                  Купить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 