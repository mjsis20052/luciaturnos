'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Calendar as CalendarIcon, Clock, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../../components/Providers';
import api from '../../services/api';
import styles from '../../styles/Booking.module.scss';

interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  courts: Court[];
}

interface Court {
  id: string;
  name: string;
  surfaceType: string;
  pricePerHour: number;
  image: string;
}

interface Slot {
  time: string;
  available: boolean;
}

export default function ReservasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Selected state
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState(false);

  // Horizontal Date List (Next 14 days)
  const [dateList, setDateList] = useState<Date[]>([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    setDateList(list);
  }, []);

  // Fetch Venues
  const { data: venues, isLoading: loadingVenues } = useQuery<Venue[]>({
    queryKey: ['venues'],
    queryFn: async () => {
      const res = await api.get('/api/venues');
      return res.data;
    },
  });

  // Fetch Slots
  const dateString = selectedDate.toISOString().split('T')[0];
  const { data: slots, isLoading: loadingSlots } = useQuery<Slot[]>({
    queryKey: ['slots', selectedCourt?.id, dateString],
    queryFn: async () => {
      const res = await api.get(`/api/courts/${selectedCourt?.id}/slots?date=${dateString}`);
      return res.data;
    },
    enabled: !!selectedCourt,
  });

  // Handle Venue Select
  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setSelectedCourt(null);
    setSelectedSlot(null);
  };

  // Handle Court Select
  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
  };

  // Handle Date Select
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  // Create Booking Mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCourt || !selectedSlot) return;
      return await api.post('/api/bookings', {
        courtId: selectedCourt.id,
        date: dateString,
        startTime: selectedSlot,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots', selectedCourt?.id, dateString] });
      setSuccessModal(true);
      setSelectedSlot(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Error al procesar reserva.');
    },
  });

  const handleBook = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    createBookingMutation.mutate();
  };

  const getDayName = (date: Date) => {
    const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    return days[date.getDay()];
  };

  return (
    <div className={styles.bookingLayout}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 className={styles.title}>🏀 Reservar Cancha de Básquet</h1>
        </div>
        <p className={styles.subtitle}>Encuentra el horario y la cancha ideal para tu partido</p>

        <div className={styles.bookingGrid}>
          {/* LEFT COLUMN: SELECTORS */}
          <div>
            {/* STEP 1: VENUE */}
            <div className={styles.selectionStep}>
              <h2 className={styles.stepTitle}>
                <span>1️⃣</span> Selecciona la Cancha
              </h2>
              {loadingVenues ? (
                <div>Cargando canchas...</div>
              ) : (
                <div className={styles.selectorGrid}>
                  {venues?.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleVenueSelect(v)}
                      className={`${styles.selectorCard} ${selectedVenue?.id === v.id ? styles.active : ''}`}
                    >
                      <h3 className={styles.selectorCardTitle}>{v.name}</h3>
                      <div className={styles.courtLocation} style={{ margin: '4px 0 8px 0' }}>
                        <MapPin size={12} />
                        <span>{v.address}</span>
                      </div>
                      <p className={styles.selectorCardDesc}>{v.description}</p>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#ff5500', fontWeight: 'bold' }}>
                        📊 {v.courts?.length || 0} canchas disponibles
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2: COURT */}
            <AnimatePresence>
              {selectedVenue && (
                <motion.div
                  className={styles.selectionStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className={styles.stepTitle}>
                    <span>2️⃣</span> Selecciona tu Cancha
                  </h2>
                  <div className={styles.selectorGrid}>
                    {selectedVenue.courts.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleCourtSelect(c)}
                        className={`${styles.selectorCard} ${selectedCourt?.id === c.id ? styles.active : ''}`}
                      >
                        <h3 className={styles.selectorCardTitle}>🏀 {c.name}</h3>
                        <p className={styles.selectorCardDesc} style={{ marginBottom: 4 }}>
                          <strong>{c.surfaceType}</strong>
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className={styles.selectorCardDesc}>Máximo 10 jugadores</span>
                          <span style={{ color: '#ff5500', fontWeight: 'bold', fontSize: '16px' }}>
                            ${c.pricePerHour}/h
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 3: DATE & TIME */}
            <AnimatePresence>
              {selectedCourt && (
                <motion.div
                  className={styles.selectionStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className={styles.stepTitle}>
                    <span>3️⃣</span> Elige la Fecha y Hora
                  </h2>

                  {/* Horizontal Sports Calendar picker */}
                  <div className={styles.calendarContainer}>
                    <div className={styles.calendarHeader}>
                      <h4>Selecciona un Día</h4>
                    </div>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10 }}>
                      {dateList.map((date, idx) => {
                        const isSelected = selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth();
                        return (
                          <button
                            key={idx}
                            onClick={() => handleDateSelect(date)}
                            style={{
                              flexShrink: 0,
                              width: 64,
                              height: 76,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 8,
                              background: isSelected ? '#ff5500' : 'rgba(255, 255, 255, 0.02)',
                              border: isSelected ? '1px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: isSelected ? 'white' : '#8a8d9a',
                            }}
                          >
                            <span style={{ fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }}>
                              {getDayName(date)}
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: isSelected ? 'white' : 'white' }}>
                              {date.getDate()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slots Grid */}
                  <div className={styles.slotsSection}>
                    <h4 style={{ marginBottom: 16 }}>Turnos Disponibles (1 Hora)</h4>
                    {loadingSlots ? (
                      <div>Calculando disponibilidad...</div>
                    ) : (
                      <div className={styles.slotsGrid}>
                        {slots?.map((slot) => {
                          const isSelected = selectedSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`${styles.slotCard} ${
                                !slot.available
                                  ? styles.booked
                                  : isSelected
                                  ? styles.selected
                                  : styles.available
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: STICKY CHECKOUT SIDEBAR */}
          <div className={styles.checkoutSidebar}>
            <h2 className={styles.summaryTitle}>📋 Tu Reserva</h2>

            <div style={{ background: 'rgba(255, 85, 0, 0.08)', borderRadius: '8px', padding: '12px', marginBottom: '16px', borderLeft: '4px solid #ff5500' }}>
              <div className={styles.summaryRow}>
                <span>🏀 Cancha:</span>
                <span>{selectedVenue ? selectedVenue.name : 'No seleccionada'}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>📍 Ubicación:</span>
                <span style={{ fontSize: '12px' }}>{selectedVenue?.address || '-'}</span>
              </div>
            </div>

            <div className={styles.summaryRow}>
              <span>🎯 Nombre:</span>
              <span>{selectedCourt ? selectedCourt.name : 'No seleccionada'}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>🛢️ Piso:</span>
              <span>{selectedCourt ? selectedCourt.surfaceType : '-'}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>📅 Fecha:</span>
              <span>{selectedCourt ? dateString : '-'}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>⏰ Horario:</span>
              <span>{selectedSlot ? `${selectedSlot} - ${parseInt(selectedSlot) + 1}:00` : 'No seleccionado'}</span>
            </div>

            <div className={styles.summaryRow} style={{ background: 'rgba(0, 230, 118, 0.08)', padding: '8px', borderRadius: '6px', marginTop: '12px' }}>
              <span style={{ fontWeight: 'bold' }}>👥 Capacidad:</span>
              <span>Hasta 10 jugadores</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>💰 Total:</span>
              <span style={{ fontSize: '24px' }}>${selectedCourt ? selectedCourt.pricePerHour : '0.00'}</span>
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedCourt || !selectedSlot || createBookingMutation.isPending}
              className={styles.btnBook}
            >
              {createBookingMutation.isPending
                ? 'Reservando...'
                : !user
                ? 'Ingresa para Reservar'
                : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {successModal && (
          <div className={styles.modalOverlay}>
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(0, 230, 118, 0.1)',
                    border: '1px solid #00e676',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    fontSize: 32,
                  }}
                >
                  🏀
                </div>
                <h3 style={{ fontSize: 24, textTransform: 'uppercase', marginBottom: 12 }}>¡Cancha Reservada!</h3>
                <p style={{ color: '#8a8d9a', lineHeight: 1.6, marginBottom: 12 }}>
                  Tu turno en <strong>{selectedCourt?.name}</strong> ha sido confirmado.
                </p>
                <p style={{ color: '#8a8d9a', lineHeight: 1.6, marginBottom: 32, fontSize: '14px' }}>
                  📅 {dateString} • ⏰ {selectedSlot} - {parseInt(selectedSlot || '0') + 1}:00 • 💰 ${selectedCourt?.pricePerHour}
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      setSuccessModal(false);
                      router.push('/dashboard');
                    }}
                    className={styles.btnBook}
                    style={{ flexGrow: 1 }}
                  >
                    Ver mis Reservas 🎯
                  </button>
                  <button
                    onClick={() => setSuccessModal(false)}
                    className={styles.btnBook}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      boxShadow: 'none',
                    }}
                  >
                    Seguir Reservando 🏀
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
