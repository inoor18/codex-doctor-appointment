import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validSlots } from '../utils/timeSlots.js';

const router = Router();

const createSchema = z.object({
  doctorId: z.number().int().positive(),
  appointmentDate: z.string().date(),
  slotTime: z.string(),
  notes: z.string().optional()
});

router.post('/', authenticate, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  if (!validSlots.has(parsed.data.slotTime)) {
    return res.status(400).json({ message: 'Invalid slot. Use 15-minute interval between 09:00 and 17:00.' });
  }

  const date = new Date(parsed.data.appointmentDate);

  const exists = await prisma.appointment.findFirst({
    where: {
      doctorId: parsed.data.doctorId,
      appointmentDate: date,
      slotTime: parsed.data.slotTime,
      deletedAt: null
    }
  });

  if (exists) {
    return res.status(409).json({ message: 'Slot already booked' });
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: parsed.data.doctorId,
      userId: req.user!.id,
      appointmentDate: date,
      slotTime: parsed.data.slotTime,
      notes: parsed.data.notes,
      createdBy: req.user!.id
    },
    include: { doctor: true }
  });

  return res.status(201).json(appointment);
});

router.get('/me', authenticate, async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: req.user!.id,
      deletedAt: null,
      appointmentDate: { gte: new Date(new Date().toDateString()) }
    },
    include: {
      doctor: { include: { department: true } }
    },
    orderBy: [{ appointmentDate: 'asc' }, { slotTime: 'asc' }]
  });

  return res.json(appointments);
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const found = await prisma.appointment.findFirst({ where: { id, userId: req.user!.id, deletedAt: null } });
  if (!found) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy: req.user!.id,
      updatedAt: new Date(),
      updatedBy: req.user!.id
    }
  });

  return res.status(204).send();
});

export default router;
