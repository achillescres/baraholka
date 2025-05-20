export function useAuth() {
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      throw error;
    }
  };

  return { logout };
} 