import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Выход выполнен успешно' });
    response.cookies.set('auth_token', '', { expires: new Date(0) });
    
    return response;
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 