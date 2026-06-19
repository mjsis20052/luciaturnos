import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET ACTIVE USER BOOKINGS
router.get('/my-bookings', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado.' });

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        court: {
          include: {
            venue: {
              select: { name: true, address: true },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener historial de reservas.' });
  }
});

// CREATE BOOKING (TRANSACTION COMPATIBLE FOR DOUBLE-BOOKING PREVENTION)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado.' });

  const { courtId, date, startTime } = req.body;

  if (!courtId || !date || !startTime) {
    return res.status(400).json({ message: 'Cancha, fecha y hora de inicio son requeridos.' });
  }

  try {
    // Generate end hour by adding 1 hour to startTime (e.g. "18:00" -> "19:00")
    const startHourInt = parseInt(startTime.split(':')[0]);
    if (isNaN(startHourInt) || startHourInt < 8 || startHourInt > 21) {
      return res.status(400).json({ message: 'Hora de inicio inválida. Canchas disponibles de 08:00 a 22:00.' });
    }
    const endTime = `${String(startHourInt + 1).padStart(2, '0')}:00`;

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Formato de fecha inválido.' });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if court exists
      const court = await tx.court.findUnique({
        where: { id: courtId },
      });
      if (!court) {
        throw new Error('COURT_NOT_FOUND');
      }

      // 2. Check if already booked
      const existingBooking = await tx.booking.findFirst({
        where: {
          courtId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          startTime,
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      });

      if (existingBooking) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      // 3. Create reservation
      const totalPrice = court.pricePerHour;
      const newBooking = await tx.booking.create({
        data: {
          courtId,
          userId: req.user!.id,
          date: startOfDay,
          startTime,
          endTime,
          totalPrice,
          status: 'CONFIRMED',
        },
      });

      return newBooking;
    });

    return res.status(201).json(result);
  } catch (err: any) {
    if (err.message === 'COURT_NOT_FOUND') {
      return res.status(404).json({ message: 'La cancha seleccionada no existe.' });
    }
    if (err.message === 'SLOT_ALREADY_BOOKED') {
      return res.status(409).json({ message: 'El horario seleccionado ya está reservado por otra persona.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Error al procesar la reserva.' });
  }
});

// CANCEL BOOKING
router.put('/:id/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado.' });
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Authorization check: User can only cancel their own, Admins can cancel any
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'No tienes permisos para cancelar esta reserva.' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return res.json({ message: 'Reserva cancelada con éxito.', booking: updatedBooking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al cancelar la reserva.' });
  }
});

export default router;
