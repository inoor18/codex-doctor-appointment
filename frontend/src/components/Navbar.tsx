import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        HealthLink
      </Link>
      <div className="nav-links">
        <Link to="/">Departments</Link>
        <Link to="/doctors">Doctors</Link>
        {user ? <Link to="/dashboard">Dashboard</Link> : null}
        {user ? (
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        ) : (
          <Link to="/auth" className="btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
