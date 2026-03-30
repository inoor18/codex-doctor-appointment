import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const departments = await prisma.department.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { doctors: true }
      }
    }
  });
  return res.json(departments);
});

export default router;
