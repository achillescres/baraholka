'use client';

import Image from 'next/image';
import { Button } from '@/shared/ui/Button/Button';
import type { Product } from '@/entities/product/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">{product.price} ₽</span>
          <Button size="sm">Купить</Button>
        </div>
      </div>
    </div>
  );
} 