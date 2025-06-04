import { v4 as uuidv4 } from 'uuid';
import { User } from '@/entities/user/model/types';
import fs from 'fs';
import path from 'path';

const USERS_STORAGE_KEY = 'users';
const USERS_FILE_PATH = path.join(process.cwd(), 'src/shared/data/users.json');

interface UsersStorage {
  users: User[];
}

// Инициализация начальных данных
const initialUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1632661674596-79b3d5d2b3c1?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Инициализация файла с пользователями, если он не существует
if (typeof window === 'undefined') {
  try {
    if (!fs.existsSync(USERS_FILE_PATH)) {
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify({ users: initialUsers }, null, 2));
    }
  } catch (error) {
    console.error('Ошибка при инициализации файла пользователей:', error);
  }
}

export async function readUsers(): Promise<UsersStorage> {
  if (typeof window === 'undefined') {
    try {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка при чтении файла пользователей:', error);
      return { users: initialUsers };
    }
  } else {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : { users: initialUsers };
  }
}

export async function writeUsers(data: UsersStorage): Promise<void> {
  if (typeof window === 'undefined') {
    try {
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Ошибка при записи файла пользователей:', error);
      throw error;
    }
  } else {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const { users } = await readUsers();
  return users.find(user => user.id === id) || null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { users } = await readUsers();
  return users.find(user => user.email === email) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const { users } = await readUsers();
  return users.find(user => user.id === id) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const { users } = await readUsers();
  
  // Проверяем, не существует ли уже пользователь с таким email
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const newUser: User = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers({ users });

  return newUser;
}

export async function updateUser(id: string, updatedUser: User): Promise<User> {
  const { users } = await readUsers();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    throw new Error('Пользователь не найден');
  }

  users[userIndex] = updatedUser;
  await writeUsers({ users });

  return updatedUser;
} 