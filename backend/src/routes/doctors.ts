import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  const search = req.query.search?.toString();

  const doctors = await prisma.doctor.findMany({
    where: {
      deletedAt: null,
      departmentId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { specialization: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    include: {
      department: true
    },
    orderBy: { name: 'asc' },
    take: 100
  });

  return res.json(doctors);
});

export default router;
