import { Link } from 'react-router-dom';
import { useCart } from '../cart/useCart';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="page">
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Your cart</h1>

      {items.map((item) => (
        <div key={item.productId} className="cart-row">
          <div className="cart-info">
            <Link to={`/products/${item.productId}`}>{item.name}</Link>
            <span className="shop">{item.shopName}</span>
            <span>{formatPrice(item.price)} each</span>
          </div>

          <div className="qty">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.maxQty}
            >
              +
            </button>
          </div>

          <div className="line-total">{formatPrice(item.price * item.quantity)}</div>

          <button type="button" className="link-button" onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}

      <div className="summary">
        <strong>Total: {formatPrice(total)}</strong>
        <Link to="/checkout" className="button">Checkout</Link>
      </div>
    </main>
  );
}