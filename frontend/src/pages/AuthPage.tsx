import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      }
      const login = await apiFetch<{ token: string; user: { id: number; name: string; email: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      setAuth(login.token, login.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="auth-card">
      <h1>{isRegister ? 'Create account' : 'Sign in'}</h1>
      <form onSubmit={submit} className="form">
        {isRegister ? <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /> : null}
        {isRegister ? (
          <input
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            required
          />
        ) : null}
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn-primary" type="submit">
          {isRegister ? 'Register & Sign In' : 'Sign In'}
        </button>
      </form>
      {error ? <p>{error}</p> : null}
      <button className="btn-secondary" onClick={() => setIsRegister((prev) => !prev)}>
        {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
      </button>
    </div>
  );
}
