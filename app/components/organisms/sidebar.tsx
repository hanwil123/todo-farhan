'use client';

import { useAuth } from '../../context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isLead = user.role === 'lead';
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'My Tasks' },
    ...(isLead ? [{ href: '/team', label: 'Team Management' }] : []),
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <aside className="w-64 border-r bg-gray-50 h-[calc(100vh-60px)] p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
