import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth';
import venuesRouter from './routes/venues';
import bookingsRouter from './routes/bookings';
import adminRouter from './routes/admin';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Next.js frontend
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'crypto-arena-backend', timestamp: new Date() });
});

// Base route registers
app.use('/api/auth', authRouter);
app.use('/api', venuesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🏀 Crypto Arena API Server running on port ${PORT}`);
  console.log(`🏀 Environment: ${process.env.NODE_ENV}`);
  console.log(`=============================================`);
});
