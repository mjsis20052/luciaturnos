'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/Providers';
import styles from '../../styles/Auth.module.scss';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
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
          <h1 className={styles.authTitle}>Ingresar</h1>
          <p className={styles.authSubtitle}>Bienvenido de vuelta a Crypto Arena</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={styles.btnSubmit}
            disabled={submitting}
          >
            {submitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.authFooter}>
          ¿No tienes una cuenta? 
          <Link href="/registro">Regístrate</Link>
        </div>
      </motion.div>
    </div>
  );
}
