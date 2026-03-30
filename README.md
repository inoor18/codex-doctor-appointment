# Doctor Appointment Web Application

Production-ready full-stack doctor appointment system with JWT auth, role support, department/doctor catalog, and appointment booking.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt password hashing

## Features

- User registration/login (name, email, phone, password)
- Roles: PATIENT (default), DOCTOR, ADMIN
- Department and doctor listing with seeded realistic data
- Appointment booking in 15-minute slots (09:00–17:00)
- Double-booking prevention (doctor + date + slot)
- Auth-protected appointment APIs
- Dashboard for upcoming appointments
- Appointment cancellation with soft-delete
- Audit/lifecycle columns in all core tables

## Project Structure

- `backend/` Express API + Prisma schema/seeds
- `frontend/` React application

## Setup

### 1) Install dependencies

```bash
npm run install:all
```

### 2) Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Update `DATABASE_URL` and `JWT_SECRET`.

### 3) Run migrations and seed data

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4) Start app

In terminal #1:
```bash
npm run dev:backend
```

In terminal #2:
```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /departments`
- `GET /doctors?departmentId=1&search=emma`
- `POST /appointments` (auth)
- `GET /appointments/me` (auth)
- `DELETE /appointments/:id` (auth)

## Notes

- Soft-delete implemented via `deleted_at` and `deleted_by`.
- Audit fields include created/updated/deleted metadata for all tables.
