const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, message, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
  }
}

function defaultMessage(status) {
  if (status === 401) return 'Please log in again.';
  if (status === 403) return 'You do not have permission to do that.';
  return 'Something went wrong.';
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  }

  if (response.status === 204) return null;

  let data = null;
  let parsed = true;
  try {
    data = await response.json();
  } catch {
    parsed = false;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || defaultMessage(response.status),
      data?.fieldErrors
    );
  }

  if (!parsed) {
    throw new ApiError(
      response.status,
      'Unexpected response from the server. Check VITE_API_URL in .env.'
    );
  }

  return data;
}