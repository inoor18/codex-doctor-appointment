import { Router } from 'express';
import { z } from 'zod';
import { loginUser, registerUser } from '../services/authService.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(7),
  password: z.string().min(6),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).optional()
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const user = await registerUser(parsed.data);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  try {
    const data = await loginUser(parsed.data.email, parsed.data.password);
    return res.json(data);
  } catch (error) {
    return res.status(401).json({ message: (error as Error).message });
  }
});

export default router;
