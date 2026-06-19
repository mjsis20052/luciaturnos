'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, DollarSign, Users, LayoutGrid, Plus, Trash, Check, X, MapPin } from 'lucide-react';
import { useAuth } from '../../../components/Providers';
import api from '../../../services/api';
import styles from '../../../styles/Dashboard.module.scss';

interface KPIStats {
  totalRevenue: number;
  totalUsers: number;
  totalCourts: number;
  totalVenues: number;
  activeBookingsCount: number;
  todayBookingsCount: number;
  occupancyRate: number;
}

interface AdminBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  user: {
    name: string;
    email: string;
  };
  court: {
    name: string;
    venue: {
      name: string;
    };
  };
}

interface Venue {
  id: string;
  name: string;
  address: string;
}

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Modal open states
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);

  // Form states
  const [courtName, setCourtName] = useState('');
  const [surfaceType, setSurfaceType] = useState('Parquet de Arce Canadiense');
  const [pricePerHour, setPricePerHour] = useState('30.00');
  const [courtImage, setCourtImage] = useState('https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=600');
  const [courtVenueId, setCourtVenueId] = useState('');

  const [venueName, setVenueName] = useState('');
  const [venueDesc, setVenueDesc] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueImage, setVenueImage] = useState('https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800');

  // Redirect if not admin
  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard/usuario');
      }
    }
  }, [user, authLoading, router]);

  // Fetch KPI Stats
  const { data: statsData } = useQuery<{ kpis: KPIStats }>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/api/admin/dashboard-stats');
      return res.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Fetch System Bookings
  const { data: bookings, isLoading: loadingBookings } = useQuery<AdminBooking[]>({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await api.get('/api/admin/bookings');
      return res.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Fetch Venues
  const { data: venues } = useQuery<Venue[]>({
    queryKey: ['admin-venues'],
    queryFn: async () => {
      const res = await api.get('/api/venues');
      return res.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Set default venue select option
  React.useEffect(() => {
    if (venues && venues.length > 0) {
      setCourtVenueId(venues[0].id);
    }
  }, [venues]);

  // Cancel Booking Mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await api.put(`/api/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  // Add Venue Mutation
  const addVenueMutation = useMutation({
    mutationFn: async () => {
      return await api.post('/api/admin/venues', {
        name: venueName,
        description: venueDesc,
        address: venueAddress,
        image: venueImage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      setShowVenueModal(false);
      // Reset form
      setVenueName('');
      setVenueDesc('');
      setVenueAddress('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error al crear la sede.');
    },
  });

  // Add Court Mutation
  const addCourtMutation = useMutation({
    mutationFn: async () => {
      return await api.post('/api/admin/courts', {
        name: courtName,
        surfaceType,
        pricePerHour,
        image: courtImage,
        venueId: courtVenueId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setShowCourtModal(false);
      // Reset form
      setCourtName('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error al crear la cancha.');
    },
  });

  const handleCancelBooking = (id: string) => {
    if (confirm('¿Estás seguro de cancelar esta reserva del sistema?')) {
      cancelBookingMutation.mutate(id);
    }
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return <div className={styles.dashboardLayout} style={{ justifyContent: 'center', alignItems: 'center', color: '#ff5500' }}>Acceso restringido...</div>;
  }

  const kpis = statsData?.kpis;

  return (
    <div className={styles.dashboardLayout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Crypto Arena</div>
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: 16, marginBottom: 4 }}>{user.name}</h4>
          <span style={{ fontSize: 12, color: '#ff5500', fontWeight: 'bold', textTransform: 'uppercase' }}>Administrador</span>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/" className={styles.navItem}>
            Inicio
          </Link>
          <Link href="/reservas" className={styles.navItem}>
            Reservas (Vista Pública)
          </Link>
          <button onClick={logout} className={`${styles.navItem} ${styles.btnLogout}`} style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%' }}>
             Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* MAIN PANEL */}
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Panel Administrador</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowVenueModal(true)} className={styles.navItem} style={{ background: 'rgba(255,85,0,0.1)', color: '#ff5500', border: '1px solid rgba(255,85,0,0.2)' }}>
              <Plus size={16} /> Nueva Sede
            </button>
            <button onClick={() => setShowCourtModal(true)} className={styles.navItem} style={{ background: '#ff5500', color: 'white' }}>
              <Plus size={16} /> Nueva Cancha
            </button>
          </div>
        </div>

        {/* KPIS */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <DollarSign />
            </div>
            <div>
              <div className={styles.kpiLabel}>Ingresos Totales</div>
              <div className={styles.kpiValue}>${kpis?.totalRevenue.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <Users />
            </div>
            <div>
              <div className={styles.kpiLabel}>Usuarios Registrados</div>
              <div className={styles.kpiValue}>{kpis?.totalUsers || 0}</div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <LayoutGrid />
            </div>
            <div>
              <div className={styles.kpiLabel}>Canchas / Sedes</div>
              <div className={styles.kpiValue}>
                {kpis?.totalCourts || 0} / {kpis?.totalVenues || 0}
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <Calendar />
            </div>
            <div>
              <div className={styles.kpiLabel}>Ocupación Hoy</div>
              <div className={styles.kpiValue}>{kpis?.occupancyRate || 0}%</div>
            </div>
          </div>
        </div>

        {/* OCCUPANCY WEEKLY CHART (Pure CSS / Styled UI) */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Tasa de Ocupación por Sede</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: `${kpis?.occupancyRate || 20}%` }}>
                <span className={styles.chartTooltip}>Ocupación: {kpis?.occupancyRate || 0}%</span>
              </div>
              <span className={styles.chartLabel}>Hoy</span>
            </div>
            {/* Hardcoded mock comparison columns for sport style graph */}
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: '45%' }}>
                <span className={styles.chartTooltip}>Promedio Lunes: 45%</span>
              </div>
              <span className={styles.chartLabel}>Lun</span>
            </div>
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: '60%' }}>
                <span className={styles.chartTooltip}>Promedio Martes: 60%</span>
              </div>
              <span className={styles.chartLabel}>Mar</span>
            </div>
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: '75%' }}>
                <span className={styles.chartTooltip}>Promedio Miércoles: 75%</span>
              </div>
              <span className={styles.chartLabel}>Mié</span>
            </div>
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: '55%' }}>
                <span className={styles.chartTooltip}>Promedio Jueves: 55%</span>
              </div>
              <span className={styles.chartLabel}>Jue</span>
            </div>
            <div className={styles.chartColumn}>
              <div className={styles.chartBar} style={{ height: '90%' }}>
                <span className={styles.chartTooltip}>Promedio Viernes: 90%</span>
              </div>
              <span className={styles.chartLabel}>Vie</span>
            </div>
          </div>
        </div>

        {/* SYSTEM BOOKINGS STREAM */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Transmisión de Reservas</h2>
          {loadingBookings ? (
            <div>Cargando reservas...</div>
          ) : bookings?.length === 0 ? (
            <div style={{ padding: '24px 0', color: '#8a8d9a' }}>No hay reservas en el sistema.</div>
          ) : (
            <div className={styles.streamList}>
              {bookings?.map((b) => (
                <div key={b.id} className={styles.streamItem}>
                  <div className={styles.streamName}>
                    <h5>{b.court.name}</h5>
                    <span>Sede: {b.court.venue.name}</span>
                  </div>
                  <div className={styles.streamDetail}>
                    <div style={{ fontWeight: 'bold' }}>{b.user.name}</div>
                    <div style={{ fontSize: 12, color: '#8a8d9a' }}>{b.user.email}</div>
                  </div>
                  <div className={styles.streamDetail}>
                    <div style={{ fontWeight: 'bold' }}>{b.date.split('T')[0]}</div>
                    <div style={{ fontSize: 12, color: '#8a8d9a' }}>{b.startTime} - {b.endTime} hs</div>
                  </div>
                  <div>
                    <span className={`${styles.badge} ${b.status === 'CANCELLED' ? styles.cancelled : styles.confirmed}`}>
                      {b.status === 'CANCELLED' ? 'Cancelado' : 'Confirmado'}
                    </span>
                  </div>
                  {b.status === 'CONFIRMED' ? (
                    <button onClick={() => handleCancelBooking(b.id)} className={styles.btnCancel}>
                      Cancelar
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CREATE COURT MODAL */}
      {showCourtModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 200 }}>
          <div className={styles.modalContent}>
            <button onClick={() => setShowCourtModal(false)} className={styles.modalClose} style={{ top: 24, right: 24 }}>
              <X size={20} />
            </button>
            <h3 className={styles.sectionTitle}>Agregar Nueva Cancha</h3>
            <form onSubmit={(e) => { e.preventDefault(); addCourtMutation.mutate(); }}>
              <div className={styles.formGroup}>
                <label>Nombre de la Cancha</label>
                <input type="text" required placeholder="Cancha LeBron (Exterior)" value={courtName} onChange={(e) => setCourtName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Sede / Complejo</label>
                <select value={courtVenueId} onChange={(e) => setCourtVenueId(e.target.value)}>
                  {venues?.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Superficie</label>
                <input type="text" required value={surfaceType} onChange={(e) => setSurfaceType(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Precio por Hora ($)</label>
                <input type="number" step="0.01" required value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Imagen URL (Foto Cancha)</label>
                <input type="text" required value={courtImage} onChange={(e) => setCourtImage(e.target.value)} />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowCourtModal(false)} className={styles.btnCancel} style={{ padding: '12px 24px' }}>Cancelar</button>
                <button type="submit" className={styles.btnSubmit} style={{ marginTop: 0, width: 'auto', padding: '12px 24px' }} disabled={addCourtMutation.isPending}>
                  {addCourtMutation.isPending ? 'Creando...' : 'Crear Cancha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE VENUE MODAL */}
      {showVenueModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 200 }}>
          <div className={styles.modalContent}>
            <button onClick={() => setShowVenueModal(false)} className={styles.modalClose} style={{ top: 24, right: 24 }}>
              <X size={20} />
            </button>
            <h3 className={styles.sectionTitle}>Agregar Nueva Sede</h3>
            <form onSubmit={(e) => { e.preventDefault(); addVenueMutation.mutate(); }}>
              <div className={styles.formGroup}>
                <label>Nombre del Complejo</label>
                <input type="text" required placeholder="Madison Square Center" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Dirección</label>
                <input type="text" required placeholder="Av. Libertador 4500, CABA" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea required placeholder="Detalles de vestuarios, comodidades, etc..." value={venueDesc} onChange={(e) => setVenueDesc(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Imagen URL (Foto Complejo)</label>
                <input type="text" required value={venueImage} onChange={(e) => setVenueImage(e.target.value)} />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowVenueModal(false)} className={styles.btnCancel} style={{ padding: '12px 24px' }}>Cancelar</button>
                <button type="submit" className={styles.btnSubmit} style={{ marginTop: 0, width: 'auto', padding: '12px 24px' }} disabled={addVenueMutation.isPending}>
                  {addVenueMutation.isPending ? 'Creando...' : 'Crear Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
