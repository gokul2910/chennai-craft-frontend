import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="card-image" />
      ) : (
        <div className="card-image placeholder">{product.name.charAt(0)}</div>
      )}
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="shop">{product.shopName}</p>
        <p className="price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}