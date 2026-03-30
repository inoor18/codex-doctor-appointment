import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

type Department = { id: number; name: string; description: string; _count: { doctors: number } };

export default function LandingPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    apiFetch<Department[]>('/departments').then(setDepartments).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Find the Right Department</h1>
      <p className="subtitle">Browse specialties and connect with top doctors.</p>
      <div className="grid">
        {departments.map((department) => (
          <Link key={department.id} className="card" to={`/doctors?departmentId=${department.id}`}>
            <h3>{department.name}</h3>
            <p>{department.description}</p>
            <small>{department._count.doctors} doctors available</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
