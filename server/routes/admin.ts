import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Apply admin protection to all routes in this router
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// GET DASHBOARD KPIS & STATS
router.get('/dashboard-stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setUTCHours(23, 59, 59, 999);

    // 1. Total revenue
    const revenueAggregation = await prisma.booking.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { totalPrice: true },
    });
    const totalRevenue = Number(revenueAggregation._sum.totalPrice || 0);

    // 2. Active users count
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });

    // 3. Count of venues and courts
    const totalCourts = await prisma.court.count();
    const totalVenues = await prisma.venue.count();

    // 4. Bookings count (active vs cancelled)
    const activeBookingsCount = await prisma.booking.count({
      where: { status: 'CONFIRMED' },
    });

    // 5. Today's bookings list
    const todayBookingsCount = await prisma.booking.count({
      where: {
        date: {
          gte: today,
          lte: endOfToday,
        },
        status: 'CONFIRMED',
      },
    });

    // 6. Occupancy rate calculation (bookings today vs capacity today)
    // Capacity = 14 hours (08:00 - 22:00) * total courts
    const maxCapacityHours = Math.max(1, totalCourts) * 14;
    const occupancyRate = totalCourts > 0
      ? Math.round((todayBookingsCount / maxCapacityHours) * 100)
      : 0;

    return res.json({
      kpis: {
        totalRevenue,
        totalUsers,
        totalCourts,
        totalVenues,
        activeBookingsCount,
        todayBookingsCount,
        occupancyRate,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al calcular estadísticas de administración.' });
  }
});

// GET ALL USERS
router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

// CHANGE USER ROLE
router.put('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body; // 'ADMIN' or 'USER'

  if (role !== 'ADMIN' && role !== 'USER') {
    return res.status(400).json({ message: 'Rol inválido.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return res.json({ message: 'Rol de usuario actualizado.', user: { id: updatedUser.id, role: updatedUser.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar rol de usuario.' });
  }
});

// GET ALL BOOKINGS FOR ADMIN STREAM
router.get('/bookings', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        court: {
          include: {
            venue: { select: { name: true } },
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
    return res.status(500).json({ message: 'Error al obtener reservas del sistema.' });
  }
});

// CREATE VENUE
router.post('/venues', async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, address, image } = req.body;
  if (!name || !description || !address || !image) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const venue = await prisma.venue.create({
      data: { name, description, address, image },
    });
    return res.status(201).json(venue);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear sede.' });
  }
});

// UPDATE VENUE
router.put('/venues/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, address, image } = req.body;
  try {
    const venue = await prisma.venue.update({
      where: { id },
      data: { name, description, address, image },
    });
    return res.json(venue);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar sede.' });
  }
});

// DELETE VENUE
router.delete('/venues/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.venue.delete({ where: { id } });
    return res.json({ message: 'Sede eliminada con éxito.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al eliminar sede.' });
  }
});

// CREATE COURT
router.post('/courts', async (req: AuthenticatedRequest, res: Response) => {
  const { name, surfaceType, pricePerHour, image, venueId } = req.body;
  if (!name || !surfaceType || !pricePerHour || !image || !venueId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const court = await prisma.court.create({
      data: {
        name,
        surfaceType,
        pricePerHour: parseFloat(pricePerHour),
        image,
        venueId,
      },
    });
    return res.status(201).json(court);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear cancha.' });
  }
});

// UPDATE COURT
router.put('/courts/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, surfaceType, pricePerHour, image } = req.body;
  try {
    const court = await prisma.court.update({
      where: { id },
      data: {
        name,
        surfaceType,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : undefined,
        image,
      },
    });
    return res.json(court);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar cancha.' });
  }
});

// DELETE COURT
router.delete('/courts/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.court.delete({ where: { id } });
    return res.json({ message: 'Cancha eliminada con éxito.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al eliminar cancha.' });
  }
});

export default router;
