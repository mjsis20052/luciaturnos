import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

// GET ALL VENUES
router.get('/venues', async (req: Request, res: Response) => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        courts: true,
      },
    });
    return res.json(venues);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener sedes.' });
  }
});

// GET VENUE BY ID
router.get('/venues/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        courts: true,
      },
    });

    if (!venue) {
      return res.status(404).json({ message: 'Sede no encontrada.' });
    }

    return res.json(venue);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener detalles de la sede.' });
  }
});

// GET ALL COURTS
router.get('/courts', async (req: Request, res: Response) => {
  try {
    const courts = await prisma.court.findMany({
      include: {
        venue: {
          select: { name: true, address: true },
        },
      },
    });
    return res.json(courts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener canchas.' });
  }
});

// GET COURT SLOTS AVAILABILITY FOR A SPECIFIC DATE
router.get('/courts/:courtId/slots', async (req: Request, res: Response) => {
  const { courtId } = req.params;
  const { date } = req.query; // Expecting YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ message: 'El parámetro de fecha es obligatorio (YYYY-MM-DD).' });
  }

  try {
    const court = await prisma.court.findUnique({ where: { id: courtId } });
    if (!court) {
      return res.status(404).json({ message: 'Cancha no encontrada.' });
    }

    // Set search range for the requested day
    const queryDate = new Date(date as string);
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({ message: 'Formato de fecha inválido.' });
    }

    const startOfDay = new Date(queryDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Fetch existing bookings for this court and day
    const bookings = await prisma.booking.findMany({
      where: {
        courtId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });

    // Define standard sports complex hours (8:00 AM to 10:00 PM)
    const hours = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    // Compute availability
    const slots = hours.map((hour) => {
      const isBooked = bookings.some((b) => b.startTime === hour);
      return {
        time: hour,
        available: !isBooked,
      };
    });

    return res.json(slots);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al calcular disponibilidad de turnos.' });
  }
});

export default router;
