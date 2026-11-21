import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../auth/useAuth';
import { useCart } from '../cart/useCart';
import { formatPrice } from '../utils/format';

export default function Checkout() {
  const { token, logout } = useAuth();
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const order = await apiFetch('/api/orders', {
        method: 'POST',
        token,
        body: {
          address,
          phone,
          pincode,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      });
      clear();
      setPlacedOrder(order);
    } catch (err) {
      if (err.status === 401) {
        // token expired: log out, RequireAuth sends the user to the login page
        logout();
        return;
      }
      setError(err.message);
      setFieldErrors(err.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <main className="page narrow">
        <h1>Order placed</h1>
        <p>
          Your order #{placedOrder.id} is placed. Total:{' '}
          <strong>{formatPrice(placedOrder.total)}</strong>
        </p>
        <ul>
          {placedOrder.items.map((item) => (
            <li key={item.id}>
              {item.productName} x {item.quantity} ({item.shopName}), status: {item.status}
            </li>
          ))}
        </ul>
        <p className="hint">
          Payment is not integrated yet (demo). Sellers can see your phone and address to
          arrange delivery.
        </p>
        <Link to="/">Continue shopping</Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="page narrow">
      <h1>Checkout</h1>

      <div className="summary-box">
        {items.map((item) => (
          <div key={item.productId} className="summary-line">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-line">
          <strong>Total</strong>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
      <p className="hint">The final price is confirmed by the server when you place the order.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Delivery address
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={500}
            rows={3}
            required
          />
          {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
        </label>
        <label>
          Phone
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            required
          />
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </label>
        <label>
          Pincode
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
            required
          />
          <span className="hint">Delivery only in Chennai (600xxx)</span>
          {fieldErrors.pincode && <span className="field-error">{fieldErrors.pincode}</span>}
        </label>

        {error && <p className="error">{error}</p>}
        {error && <Link to="/cart">Back to cart</Link>}

        <button type="submit" disabled={loading}>
          {loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  );
}