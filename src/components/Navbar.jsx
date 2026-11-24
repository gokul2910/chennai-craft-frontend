import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useCart } from '../cart/useCart';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">Chennai Craft</Link>
      <nav>
        <Link to="/cart">Cart ({count})</Link>
        {user?.role === 'CUSTOMER' && <Link to="/seller/apply">Become a seller</Link>}
        {user?.role === 'SELLER' && <Link to="/seller/products">My shop</Link>}
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}