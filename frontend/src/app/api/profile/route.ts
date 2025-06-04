import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findUserById } from '@/shared/lib/user-storage';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await findUserById(token.value);

    if (!user) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Не отправляем пароль в ответе
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 