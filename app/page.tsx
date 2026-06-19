'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ShieldCheck, MapPin, Zap, Users, Trophy, Award, PlayCircle, ChevronRight, Star, MessageSquare, Phone, Mail } from 'lucide-react';
import styles from '../styles/Landing.module.scss';

// Mock list of courts to display (matching seeds)
const featuredCourts = [
  {
    id: 'court-jordan',
    name: 'Cancha Jordan (Principal)',
    location: 'La Bombonera Arena (CABA)',
    surface: 'Parquet de Arce Canadiense',
    price: 35,
    badge: 'Interior / PRO',
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'court-kobe',
    name: 'Cancha Kobe Bryant',
    location: 'La Bombonera Arena (CABA)',
    surface: 'Parquet Clásico de Roble',
    price: 30,
    badge: 'Interior',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'court-curry',
    name: 'Cancha Curry (Exterior)',
    location: 'Rucker Park Central',
    surface: 'Asfalto Ultra Fricción',
    price: 18,
    badge: 'Exterior / LED',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600',
  },
];

// Mock complexes
const featuredVenues = [
  {
    name: 'La Bombonera Arena',
    description: 'Pisos de parquet profesionales pulidos tipo NBA, vestuarios premium y climatización integral para jugar sin preocuparte por el clima.',
    address: 'Av. Corrientes 3400, CABA',
    image: 'https://images.unsplash.com/photo-1546519638-68711109d298?auto=format&fit=crop&q=80&w=800',
    courts: 2,
  },
  {
    name: 'Rucker Park Central',
    description: 'La mística del streetball al aire libre. Superficie acrílica amortiguada de alto agarre, reflectores LED profesionales para partidos nocturnos.',
    address: 'Bosques de Palermo, CABA',
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=800',
    courts: 2,
  },
];

// Testimonios
const testimonials = [
  {
    name: 'Juan Martinez',
    role: 'Jugador Premium',
    rating: 5,
    text: '¡Increíble plataforma! Reservé una cancha en menos de un minuto y el ambiente fue perfecto. Volveré pronto.',
    avatar: '👨‍💼',
  },
  {
    name: 'Sofía Rodríguez',
    role: 'Entrenadora',
    rating: 5,
    text: 'Organizo entrenamientos regulares y Crypto Arena facilita todo. Las canchas siempre limpias y equipadas.',
    avatar: '👩‍🏫',
  },
  {
    name: 'Carlos López',
    role: 'Organizador de Torneos',
    rating: 5,
    text: 'Para organizar torneos, esto es gold. Múltiples sedes, horarios flexibles y soporte excelente.',
    avatar: '👨‍🏆',
  },
];

// Pasos para reservar
const reservationSteps = [
  {
    number: '1',
    title: 'Selecciona tu Sede',
    description: 'Elige entre nuestros complejos premium distribuidos estratégicamente en la ciudad',
    icon: '🏟️',
  },
  {
    number: '2',
    title: 'Elige tu Cancha',
    description: 'Escoge entre múltiples opciones con diferentes tipos de piso y características',
    icon: '🏀',
  },
  {
    number: '3',
    title: 'Selecciona Fecha y Hora',
    description: 'Calendario inteligente con disponibilidad real y sin conflictos',
    icon: '📅',
  },
  {
    number: '4',
    title: '¡Confirmado!',
    description: 'Recibe confirmación instantánea y estará todo listo para tu partido',
    icon: '✅',
  },
];

// Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function LandingPage() {
  return (
    <main>
      {/* 🏀 HERO SECTION */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBackground} 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=1600')` }}
        />
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Trophy size={14} style={{ marginRight: 6 }} /> Elite Court Booking
          </motion.div>
          
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Domina la cancha en <span className="text-gradient-orange glow-text">Crypto Arena</span>
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            La plataforma definitiva para reservar canchas de básquetbol premium. Madera pulida, redes perfectas, iluminación tipo estadio y disponibilidad instantánea en un solo clic.
          </motion.p>
          
          <motion.div 
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/reservas" className={styles.btnPrimary}>
              Reservar Turno
            </Link>
            <Link href="/registro" className={styles.btnSecondary}>
              Crear Cuenta
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 📊 STATS SECTION */}
      <section className={`${styles.statsSection} container`}>
        <motion.div 
          className={styles.statsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statNumber}>15k+</div>
            <div className={styles.statLabel}>Reservas Realizadas</div>
          </motion.div>
          
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statNumber}>1.2k+</div>
            <div className={styles.statLabel}>Jugadores Activos</div>
          </motion.div>
          
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statNumber}>12</div>
            <div className={styles.statLabel}>Canchas Disponibles</div>
          </motion.div>
          
          <motion.div className={styles.statCard} variants={fadeInUp}>
            <div className={styles.statNumber}>4</div>
            <div className={styles.statLabel}>Sedes Asociadas</div>
          </motion.div>
        </motion.div>
      </section>

      {/* 🏀 CANCHAS DESTACADAS */}
      <section className="section-padding container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Canchas Destacadas</h2>
            <p className={styles.sectionSubtitle}>Espacios profesionales diseñados para elevar tu juego</p>
          </div>
          <Link href="/reservas" className={styles.btnSecondary} style={{ padding: '10px 24px' }}>
            Ver Todas
          </Link>
        </div>

        <motion.div 
          className={styles.courtsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {featuredCourts.map((court) => (
            <motion.div key={court.id} className={styles.courtCard} variants={fadeInUp}>
              <div className={styles.courtImage}>
                <img src={court.image} alt={court.name} />
                <div className={styles.courtBadge}>{court.badge}</div>
              </div>
              <div className={styles.courtInfo}>
                <h3 className={styles.courtName}>{court.name}</h3>
                <div className={styles.courtLocation}>
                  <MapPin size={14} />
                  <span>{court.location}</span>
                </div>
                <div className={styles.courtMeta}>
                  <div className={styles.courtPrice}>
                    <span>${court.price}</span> / hora
                  </div>
                  <Link href="/reservas" className={styles.btnReserve}>
                    Reservar
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🏟️ SEDES DESTACADAS (COMPLEJOS) */}
      <section className="section-padding container">
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Nuestras Sedes</h2>
            <p className={styles.sectionSubtitle}>Complejos equipados con la máxima tecnología deportiva</p>
          </div>
        </div>

        <motion.div 
          className={styles.venuesGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {featuredVenues.map((venue, idx) => (
            <motion.div key={idx} className={styles.venueCard} variants={fadeInUp}>
              <div className={styles.venueImage}>
                <img src={venue.image} alt={venue.name} />
              </div>
              <div className={styles.venueInfo}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <p className={styles.venueDesc}>{venue.description}</p>
                <div className={styles.venueFooter}>
                  <div className={styles.courtLocation}>
                    <MapPin size={16} />
                    <span>{venue.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ✨ BENEFICIOS */}
      <section className="section-padding container">
        <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className={styles.sectionTitle}>La Experiencia Crypto Arena</h2>
            <p className={styles.sectionSubtitle}>Olvídate del papeleo, concéntrate en meter canastas</p>
          </div>
        </div>

        <motion.div 
          className={styles.benefitsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div className={styles.benefitCard} variants={fadeInUp}>
            <div className={styles.benefitIcon}>
              <Zap />
            </div>
            <h3 className={styles.benefitTitle}>Reserva en un clic</h3>
            <p className={styles.benefitDesc}>
              Selecciona tu sede, elige tu cancha preferida, escoge el horario y asegura tu partido en menos de 60 segundos.
            </p>
          </motion.div>

          <motion.div className={styles.benefitCard} variants={fadeInUp}>
            <div className={styles.benefitIcon}>
              <Clock />
            </div>
            <h3 className={styles.benefitTitle}>Disponibilidad Real</h3>
            <p className={styles.benefitDesc}>
              Calendario inteligente interactivo sincronizado en vivo. Dile adiós a las superposiciones y los conflictos de turnos.
            </p>
          </motion.div>

          <motion.div className={styles.benefitCard} variants={fadeInUp}>
            <div className={styles.benefitIcon}>
              <ShieldCheck />
            </div>
            <h3 className={styles.benefitTitle}>Soporte Premium</h3>
            <p className={styles.benefitDesc}>
              Nuestro personal se encarga de acondicionar la cancha, preparar balones de primer nivel y coordinar petos de juego.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* � CÓMO RESERVAR - PASOS */}
      <section className="section-padding container">
        <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className={styles.sectionTitle}>Reservar en 4 Pasos Simples</h2>
            <p className={styles.sectionSubtitle}>Un proceso transparente y sin complicaciones</p>
          </div>
        </div>

        <motion.div 
          className={styles.stepsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {reservationSteps.map((step, idx) => (
            <motion.div key={idx} className={styles.stepCard} variants={fadeInUp}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {idx < reservationSteps.length - 1 && (
                <div className={styles.stepArrow}>
                  <ChevronRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ⭐ TESTIMONIOS */}
      <section className="section-padding container">
        <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className={styles.sectionTitle}>Lo que Dicen Nuestros Jugadores</h2>
            <p className={styles.sectionSubtitle}>Historias reales de basquetbolistas como tú</p>
          </div>
        </div>

        <motion.div 
          className={styles.testimonialsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} className={styles.testimonialCard} variants={fadeInUp}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}>{testimonial.avatar}</div>
                <div className={styles.testimonialMeta}>
                  <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                  <p className={styles.testimonialRole}>{testimonial.role}</p>
                </div>
              </div>
              <div className={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#ff5500" color="#ff5500" />
                ))}
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🏀 GALERÍA DE CANCHAS */}
      <section className="section-padding container">
        <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2 className={styles.sectionTitle}>Galería de Nuestras Canchas</h2>
            <p className={styles.sectionSubtitle}>Calidad y profesionalismo en cada detalle</p>
          </div>
        </div>

        <motion.div 
          className={styles.galleryGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div className={styles.galleryItem} variants={fadeInUp}>
            <img src="https://images.unsplash.com/photo-1546519638-68711109d298?auto=format&fit=crop&q=80&w=600" alt="Cancha profesional" />
            <div className={styles.galleryOverlay}>
              <PlayCircle size={48} color="white" />
            </div>
          </motion.div>
          <motion.div className={styles.galleryItem} variants={fadeInUp}>
            <img src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600" alt="Iluminación LED" />
            <div className={styles.galleryOverlay}>
              <PlayCircle size={48} color="white" />
            </div>
          </motion.div>
          <motion.div className={styles.galleryItem} variants={fadeInUp}>
            <img src="https://images.unsplash.com/photo-1570630182677-7d65edb80dc0?auto=format&fit=crop&q=80&w=600" alt="Vestuarios" />
            <div className={styles.galleryOverlay}>
              <PlayCircle size={48} color="white" />
            </div>
          </motion.div>
          <motion.div className={styles.galleryItem} variants={fadeInUp}>
            <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600" alt="Parquet Premium" />
            <div className={styles.galleryOverlay}>
              <PlayCircle size={48} color="white" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 🏀 LEBRON JAMES BANNER */}
      <section className="section-padding container">
        <motion.div 
          className={styles.lebroBanner}
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1570630182677-7d65edb80dc0?auto=format&fit=crop&q=80&w=1200')` }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.lebroOverlay}>
            <div className={styles.lebroContent}>
              <h2 className={styles.lebroTitle}>Juega como los Profesionales</h2>
              <p className={styles.lebroDesc}>
                En Crypto Arena, tienes acceso a canchas de nivel profesional donde entrenan los mejores basquetbolistas. 
                Cada detalle está pensado para que disfrutes de la experiencia máxima.
              </p>
              <Link href="/reservas" className={styles.btnPrimary} style={{ marginTop: '20px' }}>
                Reservar Cancha Ahora
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* � COMUNIDAD */}
      <section className="section-padding container">
        <motion.div 
          className={styles.communityBanner}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.communityContent}>
            <h2 className={styles.communityTitle}>Únete a Nuestra Comunidad 🏀</h2>
            <p className={styles.communityDesc}>
              Más de 1,200 basquetbolistas ya disfrutan de Crypto Arena. Comparte tu experiencia, organiza torneos y conoce jugadores nuevos.
            </p>
            <div className={styles.communityStats}>
              <div>
                <div className={styles.communityStat}>1.2K+</div>
                <p>Miembros Activos</p>
              </div>
              <div>
                <div className={styles.communityStat}>15K+</div>
                <p>Reservas Totales</p>
              </div>
              <div>
                <div className={styles.communityStat}>4.9★</div>
                <p>Calificación</p>
              </div>
            </div>
            <Link href="/registro" className={styles.btnPrimary}>
              Crear Cuenta Gratis
            </Link>
          </div>
          <div className={styles.communityImage}>
            <img src="https://images.unsplash.com/photo-1546519638-68711109d298?auto=format&fit=crop&q=80&w=600" alt="Comunidad de Básquet" />
          </div>
        </motion.div>
      </section>

      {/* 📞 CONTACTO Y UBICACIONES - FOOTER */}
      <section className={styles.footerContact}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2 className={styles.sectionTitle}>¡Hablemos!</h2>
              <p className={styles.sectionSubtitle}>¿Preguntas? Nuestro equipo está disponible para ayudarte</p>
            </div>
          </div>

          <motion.div 
            className={styles.contactGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div className={styles.contactCard} variants={fadeInUp}>
              <div className={styles.contactIcon}>
                <Phone size={32} />
              </div>
              <h3 className={styles.contactTitle}>Llamanos</h3>
              <p className={styles.contactSubtitle}>Disponible de lunes a domingo</p>
              <a href="tel:+541145789012" className={styles.contactLink}>+54 (11) 4578-9012</a>
            </motion.div>

            <motion.div className={styles.contactCard} variants={fadeInUp}>
              <div className={styles.contactIcon}>
                <Mail size={32} />
              </div>
              <h3 className={styles.contactTitle}>Email</h3>
              <p className={styles.contactSubtitle}>Responderemos en máximo 2 horas</p>
              <a href="mailto:info@cryptoarena.com" className={styles.contactLink}>info@cryptoarena.com</a>
            </motion.div>

            <motion.div className={styles.contactCard} variants={fadeInUp}>
              <div className={styles.contactIcon}>
                <MapPin size={32} />
              </div>
              <h3 className={styles.contactTitle}>Ubicaciones</h3>
              <p className={styles.contactSubtitle}>Visitanos en cualquiera de nuestras sedes</p>
              <Link href="/reservas" className={styles.contactLink}>Ver en Mapa</Link>
            </motion.div>
          </motion.div>

          <div className={styles.footerBottom}>
            <p>© 2026 Crypto Arena. Todos los derechos reservados. | Plataforma Premium de Reservas de Canchas de Básquet</p>
          </div>
        </div>
      </section>
    </main>
  );
}
