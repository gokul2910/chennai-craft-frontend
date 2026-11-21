const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function formatPrice(value) {
  return formatter.format(value);
}