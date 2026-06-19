import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crypto Arena - Reservas de Canchas de Básquet Premium',
  description: 'Gestiona y reserva canchas de básquetbol profesional en tiempo real. La plataforma definitiva para complejos deportivos y jugadores exigentes.',
  keywords: 'reserva de canchas, basquetbol, complejos deportivos, turnos online, nba, rucker park',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
