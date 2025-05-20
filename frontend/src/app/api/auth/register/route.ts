import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { findUserByEmail, createUser } from '@/shared/lib/user-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    const user = await createUser({
      email,
      password,
      username,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });

    // Не отправляем пароль в ответе
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Регистрация успешна',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 