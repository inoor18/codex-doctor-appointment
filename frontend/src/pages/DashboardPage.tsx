import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

type Appointment = {
  id: number;
  appointmentDate: string;
  slotTime: string;
  doctor: { name: string; specialization: string; department: { name: string } };
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  const load = () => apiFetch<Appointment[]>('/appointments/me', {}, token ?? undefined).then(setAppointments).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id: number) => {
    try {
      await apiFetch(`/appointments/${id}`, { method: 'DELETE' }, token ?? undefined);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <h1>{user?.name}'s Upcoming Appointments</h1>
      {error ? <p>{error}</p> : null}
      <div className="grid">
        {appointments.map((appointment) => (
          <div className="card" key={appointment.id}>
            <h3>{appointment.doctor.name}</h3>
            <p>{appointment.doctor.specialization}</p>
            <p>{appointment.doctor.department.name}</p>
            <small>
              {new Date(appointment.appointmentDate).toDateString()} at {appointment.slotTime}
            </small>
            <button className="btn-secondary" onClick={() => cancel(appointment.id)}>
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
