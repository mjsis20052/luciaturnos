'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/Providers';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/usuario');
      }
    }
  }, [user, loading, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#060608',
        color: '#ff5500',
        fontFamily: 'Outfit, sans-serif',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
      }}
    >
      🏀 CARGANDO PANEL...
    </div>
  );
}
