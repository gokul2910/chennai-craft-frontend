import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <main className="page">
        <h1>No access</h1>
        <p>You do not have permission to open this page.</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return children;
}