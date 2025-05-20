import Image from 'next/image';
import { User } from '../model/types';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20">
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
} 