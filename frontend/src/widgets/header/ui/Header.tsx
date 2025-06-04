'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/Button/Button';
import { User } from '@/entities/user/model/types';

export function Header() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setUser(null);
        }
      } catch {
        setIsAuthorized(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  if (loading) {
    return (
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Барахолка
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Барахолка
          </Link>
          <nav className="flex items-center space-x-4">
            {(isAuthorized && user) && (
              <>
                <Link href="/create-product">
                  <Button variant="primary">Создать товар</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="primary">Профиль</Button>
                </Link>
              </>
            )}
            {!(isAuthorized && user) && (
              <>
                <Link href="/login">
                  <Button variant="primary">Войти</Button>
                </Link>
                <Link href="/registration">
                  <Button variant="secondary">Регистрация</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 