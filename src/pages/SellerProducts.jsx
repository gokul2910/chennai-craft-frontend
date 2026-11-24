import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../auth/useAuth';
import ProductForm from '../components/ProductForm';
import { formatPrice } from '../utils/format';

export default function SellerProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    apiFetch('/api/seller/products', { token })
      .then((data) => {
        if (!ignore) setProducts(data);
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
  }, [token]);

  const handleCreate = async (body) => {
    const created = await apiFetch('/api/seller/products', { method: 'POST', token, body });
    setProducts([created, ...products]);
  };

  const handleUpdate = async (id, body) => {
    const updated = await apiFetch(`/api/seller/products/${id}`, { method: 'PUT', token, body });
    setProducts(products.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError('');
    try {
      await apiFetch(`/api/seller/products/${product.id}`, { method: 'DELETE', token });
      setProducts(products.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <h1>My shop</h1>

      <section className="panel">
        <h2>Add a product</h2>
        <ProductForm submitLabel="Add product" onSubmit={handleCreate} resetOnSuccess />
      </section>

      <h2>My products</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && products.length === 0 && <p>No products yet. Add your first product above.</p>}

      {products.map((product) =>
        editingId === product.id ? (
          <section key={product.id} className="panel">
            <h3>Edit product</h3>
            <ProductForm
              initial={product}
              submitLabel="Save changes"
              onSubmit={(body) => handleUpdate(product.id, body)}
              onCancel={() => setEditingId(null)}
            />
          </section>
        ) : (
          <div key={product.id} className="product-row">
            <div className="cart-info">
              <strong>{product.name}</strong>
              <span>
                {formatPrice(product.price)} | Stock: {product.stock}
                {product.stock === 0 && <span className="badge">Hidden from customers</span>}
              </span>
            </div>
            <div className="row-actions">
              <button type="button" onClick={() => setEditingId(product.id)}>Edit</button>
              <button type="button" className="link-button" onClick={() => handleDelete(product)}>
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </main>
  );
}