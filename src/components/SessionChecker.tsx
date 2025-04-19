'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function SessionChecker() {
  const router = useRouter();
  const pathname = usePathname();

  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!shopId && !!accessToken;

  useEffect(() => {
    const publicPaths = ['/signin', '/signup'];

    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.replace('/signin');
    }
  }, [isAuthenticated, pathname, router]);

  return null;
}
