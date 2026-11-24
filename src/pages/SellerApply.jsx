import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../auth/useAuth';

const EMPTY_FORM = { shopName: '', phone: '', area: '', pincode: '' };

const STATUS_TEXT = {
  PENDING: 'Your application is waiting for admin approval.',
  APPROVED: 'Approved! Click Check status to open your shop.',
  REJECTED: 'Your application was rejected.',
};

export default function SellerApply() {
  const { token, user, refreshUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    apiFetch('/api/seller/application', { token })
      .then((data) => {
        if (!ignore) setApplication(data);
      })
      .catch((err) => {
        // 404 only means: no application yet, so show the form
        if (!ignore && err.status !== 404) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  if (user.role === 'SELLER') {
    return <Navigate to="/seller/products" replace />;
  }

  if (user.role === 'ADMIN') {
    return (
      <main className="page">
        <p>Admins cannot become sellers.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading...</p>
      </main>
    );
  }

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      const data = await apiFetch('/api/seller/apply', {
        method: 'POST',
        token,
        body: form,
      });
      setApplication(data);
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fieldErrors || {});
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setError('');
    try {
      const data = await apiFetch('/api/seller/application', { token });
      setApplication(data);
      await refreshUser();
    } catch (err) {
      setError(err.message);
    }
  };

  if (application) {
    return (
      <main className="page narrow">
        <h1>Seller application</h1>
        <div className="status-box">
          <p>
            <strong>{application.shopName}</strong> ({application.area}, {application.pincode})
          </p>
          <p>
            Status: <strong>{application.status}</strong>
          </p>
          <p>{STATUS_TEXT[application.status]}</p>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handleRefresh}>Check status</button>
      </main>
    );
  }

  return (
    <main className="page narrow">
      <h1>Become a seller</h1>
      <p className="hint">Sell your handmade products to customers in Chennai.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Shop name
          <input value={form.shopName} onChange={handleChange('shopName')} maxLength={100} required />
          {fieldErrors.shopName && <span className="field-error">{fieldErrors.shopName}</span>}
        </label>
        <label>
          Phone
          <input type="tel" value={form.phone} onChange={handleChange('phone')} maxLength={10} required />
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </label>
        <label>
          Area
          <input value={form.area} onChange={handleChange('area')} maxLength={100} required />
          {fieldErrors.area && <span className="field-error">{fieldErrors.area}</span>}
        </label>
        <label>
          Pincode
          <input value={form.pincode} onChange={handleChange('pincode')} maxLength={6} required />
          <span className="hint">Chennai pincode only (600xxx)</span>
          {fieldErrors.pincode && <span className="field-error">{fieldErrors.pincode}</span>}
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Apply'}
        </button>
      </form>
    </main>
  );
}