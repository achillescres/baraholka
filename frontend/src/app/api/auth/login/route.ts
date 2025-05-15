import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Здесь должна быть реальная проверка учетных данных
    // Это временная заглушка для демонстрации
    if (email === 'test@example.com' && password === 'password') {
      return NextResponse.json(
        { message: 'Успешный вход' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Неверные учетные данные' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 