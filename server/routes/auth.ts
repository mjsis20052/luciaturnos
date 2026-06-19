import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'crypto_arena_super_jwt_secret_key_12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'crypto_arena_super_jwt_refresh_secret_key_12345';

function generateTokens(user: { id: string; email: string; name: string; role: string }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// REGISTER
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Introduce un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'USER', // Default role
        },
      });

      const tokens = generateTokens(user);

      // Save refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        ...tokens,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
);

// LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Introduce un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales incorrectas.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales incorrectas.' });
      }

      const tokens = generateTokens(user);

      // Save refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        ...tokens,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
);

// REFRESH TOKEN
router.post('/refresh', async (req: any, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token requerido.' });
  }

  try {
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
      if (dbToken) {
        await prisma.refreshToken.delete({ where: { id: dbToken.id } });
      }
      return res.status(403).json({ message: 'Refresh token expirado o no encontrado.' });
    }

    // Verify JWT structure
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    if (decoded.id !== dbToken.userId) {
      return res.status(403).json({ message: 'Token no autorizado.' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: dbToken.user.id, email: dbToken.user.email, name: dbToken.user.name, role: dbToken.user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Error al verificar token de refresco.' });
  }
});

// LOGOUT
router.post('/logout', async (req: any, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token requerido.' });
  }

  try {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return res.json({ message: 'Sesión cerrada con éxito.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al cerrar sesión.' });
  }
});

export default router;
