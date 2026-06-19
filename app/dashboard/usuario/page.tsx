'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Award, User as UserIcon, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../../components/Providers';
import api from '../../../services/api';
import styles from '../../../styles/Dashboard.module.scss';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  court: {
    name: string;
    surfaceType: string;
    venue: {
      name: string;
      address: string;
    };
  };
}

export default function UsuarioDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Redirect if unauthorized
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch User Bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/api/bookings/my-bookings');
      return res.data;
    },
    enabled: !!user,
  });

  // Cancel Booking Mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await api.put(`/api/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error al cancelar la reserva.');
    },
  });

  const handleCancel = (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      cancelBookingMutation.mutate(id);
    }
  };

  if (authLoading || !user) {
    return <div className={styles.dashboardLayout} style={{ justifyContent: 'center', alignItems: 'center', color: '#ff5500' }}>Cargando...</div>;
  }

  // Filter Bookings
  const activeBookings = bookings?.filter((b) => b.status === 'CONFIRMED' && new Date(b.date) >= new Date(new Date().setHours(0,0,0,0))) || [];
  const pastBookings = bookings?.filter((b) => b.status === 'CANCELLED' || new Date(b.date) < new Date(new Date().setHours(0,0,0,0))) || [];

  // Calculate statistics
  const totalMatches = bookings?.filter((b) => b.status === 'CONFIRMED').length || 0;
  const totalSpent = bookings?.filter((b) => b.status === 'CONFIRMED').reduce((acc, curr) => acc + Number(curr.totalPrice), 0) || 0;

  return (
    <div className={styles.dashboardLayout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Crypto Arena</div>
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: 16, marginBottom: 4 }}>{user.name}</h4>
          <span style={{ fontSize: 12, color: '#ff5500', fontWeight: 'bold', textTransform: 'uppercase' }}>Jugador</span>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/" className={styles.navItem}>
            Inicio
          </Link>
          <Link href="/reservas" className={styles.navItem}>
            Reservar Cancha
          </Link>
          <button onClick={logout} className={`${styles.navItem} ${styles.btnLogout}`} style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%' }}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mi Panel</h1>
        </div>

        {/* KPIS */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <Award />
            </div>
            <div>
              <div className={styles.kpiLabel}>Partidos Jugados</div>
              <div className={styles.kpiValue}>{totalMatches}</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <Calendar />
            </div>
            <div>
              <div className={styles.kpiLabel}>Reservas Activas</div>
              <div className={styles.kpiValue}>{activeBookings.length}</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <BookOpen />
            </div>
            <div>
              <div className={styles.kpiLabel}>Total Invertido</div>
              <div className={styles.kpiValue}>${totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* UPCOMING BOOKINGS */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Próximos Partidos</h2>
          {isLoading ? (
            <div>Cargando reservas...</div>
          ) : activeBookings.length === 0 ? (
            <div style={{ padding: '24px 0', color: '#8a8d9a', textAlign: 'center' }}>
              No tienes reservas programadas. 
              <Link href="/reservas" style={{ color: '#ff5500', marginLeft: 8, fontWeight: 'bold' }}>Reserva un turno ahora &rarr;</Link>
            </div>
          ) : (
            <div className={styles.streamList}>
              {activeBookings.map((booking) => (
                <div key={booking.id} className={styles.streamItem} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                  <div className={styles.streamName}>
                    <h5>{booking.court.name}</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8a8d9a', fontSize: 12, marginTop: 4 }}>
                      <MapPin size={12} />
                      <span>{booking.court.venue.name} - {booking.court.venue.address}</span>
                    </div>
                  </div>
                  <div className={styles.streamDetail}>
                    <div style={{ fontWeight: 'bold' }}>{booking.date.split('T')[0]}</div>
                    <div style={{ fontSize: 12, color: '#8a8d9a' }}>Fecha</div>
                  </div>
                  <div className={styles.streamDetail}>
                    <div style={{ fontWeight: 'bold' }}>{booking.startTime} hs</div>
                    <div style={{ fontSize: 12, color: '#8a8d9a' }}>Horario</div>
                  </div>
                  <button onClick={() => handleCancel(booking.id)} className={styles.btnCancel}>
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOOKING HISTORY */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Historial y Cancelaciones</h2>
          {isLoading ? (
            <div>Cargando historial...</div>
          ) : pastBookings.length === 0 ? (
            <div style={{ padding: '12px 0', color: '#8a8d9a' }}>Historial vacío.</div>
          ) : (
            <div className={styles.streamList}>
              {pastBookings.map((booking) => (
                <div key={booking.id} className={styles.streamItem} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', opacity: 0.65 }}>
                  <div className={styles.streamName}>
                    <h5>{booking.court.name}</h5>
                    <span style={{ fontSize: 12 }}>{booking.court.venue.name}</span>
                  </div>
                  <div className={styles.streamDetail}>{booking.date.split('T')[0]}</div>
                  <div className={styles.streamDetail}>{booking.startTime} hs</div>
                  <div>
                    <span className={`${styles.badge} ${booking.status === 'CANCELLED' ? styles.cancelled : styles.confirmed}`}>
                      {booking.status === 'CANCELLED' ? 'Cancelado' : 'Finalizado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
