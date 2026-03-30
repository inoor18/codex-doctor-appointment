import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export const registerUser = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: Role;
}) => {
  const existing = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      OR: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }]
    }
  });

  if (existing) {
    throw new Error('Email or phone number already exists');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      passwordHash,
      role: payload.role ?? Role.PATIENT
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    }
  };
};
