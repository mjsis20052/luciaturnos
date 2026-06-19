# 🏀 Crypto Arena - SaaS de Reservas de Canchas de Básquet

Crypto Arena es una aplicación SaaS premium para la gestión y reserva de canchas de básquetbol en tiempo real. Cuenta con una fuerte identidad visual deportiva inspirada en el mundo del básquet profesional (NBA, Nike Basketball) y un flujo de reservas interactivo inspirado en Airbnb y Ticketmaster.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, TypeScript, SCSS Modules, Framer Motion, Axios, TanStack Query.
- **Backend**: Node.js, Express, TypeScript, JWT (Access & Refresh Tokens), Role-Based Access Control, validaciones en backend.
- **Base de Datos**: PostgreSQL, Prisma ORM.

---

## 🛠️ Requisitos de Instalación

1. Asegúrate de tener instalado **Node.js** (versión 18 o superior).
2. Tener una instancia de **PostgreSQL** corriendo localmente o en la nube.

---

## 💻 Configuración Local

1. **Instalar Dependencias**:
   En la raíz del proyecto, ejecuta:
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno**:
   El archivo `.env` en la raíz del proyecto viene pre-configurado para pruebas locales. Modifica la variable `DATABASE_URL` con tus credenciales de PostgreSQL si es necesario:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crypto_arena?schema=public"
   ```

3. **Migrar Base de Datos**:
   Ejecuta las migraciones de Prisma para configurar el esquema relacional en tu base de datos:
   ```bash
   npm run db:migrate
   ```

4. **Poblar Base de Datos (Seed)**:
   Ejecuta el script de semilla para crear los complejos (La Bombonera Arena, Rucker Park), las canchas (Jordan, Kobe, Black Mamba, Curry) y los usuarios de prueba:
   ```bash
   npm run db:seed
   ```

---

## 🎮 Ejecución en Desarrollo

Para levantar tanto el **frontend** en Next.js como el **backend** en Express simultáneamente, simplemente ejecuta:
```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Usuarios de Prueba (Seed)

El script de semilla genera automáticamente dos roles funcionales para probar la aplicación completa:

### 1. Rol Administrador
- **Email**: `admin@cryptoarena.com`
- **Contraseña**: `admin123`
- *Permisos*: Crear y modificar complejos/sedes, canchas, ver estadísticas de ocupación e ingresos (KPIs), y cancelar cualquier reserva activa del sistema.

### 2. Rol Usuario (Jugador)
- **Email**: `lucia@cryptoarena.com`
- **Contraseña**: `lucia123`
- *Permisos*: Ver disponibilidad de horarios en tiempo real en formato de tarjetas de estado, realizar reservas, cancelar sus propias reservas, ver su historial de partidos jugados y estadísticas de tiempo transcurrido en la cancha.
