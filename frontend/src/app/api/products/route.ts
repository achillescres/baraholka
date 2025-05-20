import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findUserById } from '@/shared/lib/user-storage';
import type { Product } from '@/entities/product/types';
import { writeFile } from 'fs/promises';
import path from 'path';
import mockData from '@/entities/product/model/mock-data.json';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MOCK_DATA_PATH = path.join(process.cwd(), 'src', 'entities', 'product', 'model', 'mock-data.json');

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    console.log('Token from cookie:', token);

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await findUserById(token);
    console.log('Found user:', user);

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const condition = formData.get('condition') as string;

    if (!title || !description || !price || !category || !condition) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Обработка изображений
    const images: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        const file = value as File;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Создаем уникальное имя файла
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Сохраняем файл
        await writeFile(filePath, buffer);
        images.push(`/uploads/${fileName}`);
      }
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      title,
      description,
      price,
      category,
      condition,
      images,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Добавляем новый товар в массив
    mockData.products.push(newProduct);

    // Сохраняем изменения в файл
    await writeFile(MOCK_DATA_PATH, JSON.stringify(mockData, null, 2));

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(mockData.products);
} 