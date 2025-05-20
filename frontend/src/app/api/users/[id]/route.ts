import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import mockData from '@/shared/data/users.json';

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const params = await context.params;
  try {
    const user = mockData.users.find(u => u.id === params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении информации о пользователе' },
      { status: 500 }
    );
  }
} 