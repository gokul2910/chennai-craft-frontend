import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { formatPrice } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    apiFetch(`/api/products/${id}`)
      .then((data) => {
        if (!ignore) setProduct(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <main className="page"><p>Loading...</p></main>;

  if (error) {
    return (
      <main className="page">
        <p className="error">{error}</p>
        <Link to="/">Back to products</Link>
      </main>
    );
  }

  return (
    <main className="page detail">
      <Link to="/">&larr; Back to products</Link>
      <h1>{product.name}</h1>
      <p className="shop">Sold by {product.shopName}</p>
      <p className="price big">{formatPrice(product.price)}</p>
      {product.description && <p>{product.description}</p>}
      <p>{product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}</p>
    </main>
  );
}