'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dribbble, User, LogOut } from 'lucide-react';
import { useAuth } from './Providers';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <motion.header
      className={styles.navbar}
      initial={{ y: -50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link href="/" className={styles.logo}>
        <Dribbble />
        <span>Crypto Arena</span>
      </Link>

      <nav className={styles.navLinks}>
        <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
          Inicio
        </Link>
        <Link href="/reservas" className={`${styles.navLink} ${pathname === '/reservas' ? styles.active : ''}`}>
          Reservas
        </Link>
        {user && (
          <Link href="/dashboard" className={`${styles.navLink} ${pathname.startsWith('/dashboard') ? styles.active : ''}`}>
            Dashboard
          </Link>
        )}
      </nav>

      <div className={styles.authActions}>
        {user ? (
          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.role === 'ADMIN' ? 'Administrador' : 'Jugador'}</div>
            </div>
            <button onClick={logout} className={styles.btnLogout} title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className={styles.btnText}>
              Ingresar
            </Link>
            <Link href="/registro" className={styles.btnPrimary}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </motion.header>
  );
}
