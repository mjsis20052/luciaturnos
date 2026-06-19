'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/Providers';
import styles from '../../styles/Auth.module.scss';

export default function RegistroPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <motion.div 
        className={styles.authPanel}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Registrarse</h1>
          <p className={styles.authSubtitle}>Únete a la liga de reservas de Crypto Arena</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              required
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={styles.btnSubmit}
            disabled={submitting}
          >
            {submitting ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.authFooter}>
          ¿Ya tienes cuenta? 
          <Link href="/login">Ingresa</Link>
        </div>
      </motion.div>
    </div>
  );
}
