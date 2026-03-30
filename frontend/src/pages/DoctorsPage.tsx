import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const slots = Array.from({ length: 32 }).map((_, idx) => {
  const total = 9 * 60 + idx * 15;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
});

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  profileImageUrl: string;
  availability: string;
  department: { name: string };
};

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [slotTime, setSlotTime] = useState(slots[0]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const { token } = useAuth();

  const departmentId = searchParams.get('departmentId');
  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    if (departmentId) query.set('departmentId', departmentId);
    if (search) query.set('search', search);
    return query.toString();
  }, [departmentId, search]);

  useEffect(() => {
    apiFetch<Doctor[]>(`/doctors${queryString ? `?${queryString}` : ''}`).then(setDoctors).catch(console.error);
  }, [queryString]);

  const onBook = async () => {
    if (!token || !selectedDoctor || !appointmentDate) return;
    try {
      await apiFetch(
        '/appointments',
        {
          method: 'POST',
          body: JSON.stringify({ doctorId: selectedDoctor, appointmentDate, slotTime })
        },
        token
      );
      setMessage('Appointment booked successfully.');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <h1>Doctors</h1>
      <div className="toolbar">
        <input placeholder="Search by name or specialization" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-secondary" onClick={() => setSearchParams(search ? { search, ...(departmentId ? { departmentId } : {}) } : {})}>
          Apply Search
        </button>
      </div>
      <div className="grid">
        {doctors.map((doctor) => (
          <div className="card" key={doctor.id}>
            <img src={doctor.profileImageUrl} alt={doctor.name} className="doctor-image" />
            <h3>{doctor.name}</h3>
            <p>{doctor.specialization}</p>
            <p>{doctor.department.name}</p>
            <small>{doctor.experience} years experience • {doctor.availability}</small>
            {token ? (
              <button className="btn-primary" onClick={() => setSelectedDoctor(doctor.id)}>
                Book Appointment
              </button>
            ) : (
              <small>Login to book</small>
            )}
          </div>
        ))}
      </div>
      {selectedDoctor ? (
        <div className="booking-panel">
          <h3>Book Appointment</h3>
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
          <select value={slotTime} onChange={(e) => setSlotTime(e.target.value)}>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <button className="btn-primary" onClick={onBook}>
            Confirm
          </button>
          <button className="btn-secondary" onClick={() => setSelectedDoctor(null)}>
            Cancel
          </button>
          {message ? <p>{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
