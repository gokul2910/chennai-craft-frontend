import { useState } from 'react';

export default function ProductForm({ initial = {}, submitLabel, onSubmit, onCancel, resetOnSuccess }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    description: initial.description ?? '',
    price: initial.price ?? '',
    stock: initial.stock ?? '',
    imageUrl: initial.imageUrl ?? '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setSaving(true);
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl,
      });
      if (resetOnSuccess) {
        setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
      }
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fieldErrors || {});
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form product-form">
      <label>
        Name
        <input value={form.name} onChange={handleChange('name')} maxLength={120} required />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={handleChange('description')} maxLength={1000} rows={2} />
        {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
      </label>
      <div className="form-row">
        <label>
          Price (Rs.)
          <input type="number" min="1" step="0.01" value={form.price} onChange={handleChange('price')} required />
          {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
        </label>
        <label>
          Stock
          <input type="number" min="0" step="1" value={form.stock} onChange={handleChange('stock')} required />
          {fieldErrors.stock && <span className="field-error">{fieldErrors.stock}</span>}
        </label>
      </div>
      <label>
        Image URL (optional)
        <input value={form.imageUrl} onChange={handleChange('imageUrl')} maxLength={500} />
        {fieldErrors.imageUrl && <span className="field-error">{fieldErrors.imageUrl}</span>}
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row-actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
        {onCancel && (
          <button type="button" className="link-button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}