import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;
    const path = search
      ? `/api/products?q=${encodeURIComponent(search)}`
      : '/api/products';

    apiFetch(path)
      .then((data) => {
        if (!ignore) {
          setProducts(data);
          setError('');
        }
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
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const next = input.trim();
    if (next !== search) {
      setLoading(true);
      setSearch(next);
    }
  };

  return (
    <main className="page">
      <form onSubmit={handleSearch} className="search">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search handmade products"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}