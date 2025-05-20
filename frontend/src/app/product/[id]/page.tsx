'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { apiClient } from '@/shared/api/client';
import type { Product } from '@/entities/product/types';
import type { User } from '@/entities/user/model/types';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) {
        setError('ID товара не найден');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching product with ID:', params.id);
        const response = await apiClient.get<Product>(`/products/${params.id}`);
        console.log('Product response:', response);
        setProduct(response);
        
        // Получаем информацию о продавце
        if (response.userId) {
          console.log('Fetching seller with ID:', response.userId);
          const sellerResponse = await apiClient.get<User>(`/users/${response.userId}`);
          console.log('Seller response:', sellerResponse);
          setSeller(sellerResponse);
        }
      } catch (err) {
        console.error('Ошибка при загрузке товара:', err);
        setError('Не удалось загрузить информацию о товаре');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || 'Товар не найден'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Галерея изображений */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              {!imageError[product.images[currentImageIndex]] ? (
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(product.images[currentImageIndex])}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Изображение недоступно</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {!imageError[image] ? (
                      <Image
                        src={image}
                        alt={`${product.title} - фото ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(image)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Нет фото</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-blue-600">{product.price} ₽</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Категория</h3>
                <p className="mt-1">{product.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Состояние</h3>
                <p className="mt-1">{product.condition}</p>
              </div>
            </div>

            {/* Информация о продавце */}
            {seller && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Информация о продавце</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600">
                        {seller.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{seller.username}</p>
                      <p className="text-sm text-gray-500">На сайте с {new Date(seller.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Написать продавцу
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Опубликовано: {new Date(product.createdAt).toLocaleDateString()}</p>
              <p>Обновлено: {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 