import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, updateUser } from '@/shared/lib/user-storage';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { message: 'Не авторизован', redirect: '/login' },
        { status: 401 }
      );
    }

    // Временно используем моковые данные
    const user = await getUserById(token.value);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Не отправляем пароль в ответе
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, username, password, newPassword } = body;

    // Получаем текущего пользователя
    const currentUser = await getUserById(token.value);
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем текущий пароль, если он был введен
    if (password && password !== currentUser.password) {
      return NextResponse.json(
        { message: 'Неверный текущий пароль' },
        { status: 400 }
      );
    }

    // Обновляем данные пользователя
    const updatedUser = await updateUser(token.value, {
      ...currentUser,
      email: email || currentUser.email,
      username: username || currentUser.username,
      password: newPassword || currentUser.password,
      updatedAt: new Date().toISOString(),
    });

    // Не отправляем пароль в ответе
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Профиль успешно обновлен',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 