import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import mockData from '@/entities/product/model/mock-data.json';
import type { Product } from '@/entities/product/types';
import { writeFile } from 'fs/promises';
import path from 'path';

const MOCK_DATA_PATH = path.join(process.cwd(), 'src', 'entities', 'product', 'model', 'mock-data.json');

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const params = await context.params;
  try {
    const product = mockData.products.find(p => p.id === params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    // Преобразуем цену в строку для соответствия типу Product
    const formattedProduct: Product = {
      ...product,
      price: product.price.toString()
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении информации о товаре' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const params = await context.params;
  try {
    const productIndex = mockData.products.findIndex(p => p.id === params.id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    // Удаляем товар из массива
    mockData.products.splice(productIndex, 1);

    // Сохраняем изменения в файл
    await writeFile(MOCK_DATA_PATH, JSON.stringify(mockData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    );
  }
} 