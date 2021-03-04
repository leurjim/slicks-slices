const formatter = Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

export default function formatMoney(cents) {
  return formatter.format(cents / 100);
}
