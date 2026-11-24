// Corrected: Use 'export const' for named exports
export const CATEGORIES = [
  { value: 'Espresso', label: 'Espresso' },
  { value: 'Cappuccino', label: 'Cappuccino' },
  { value: 'Latte', label: 'Latte' },
  { value: 'Americano', label: 'Americano' },
  { value: 'Mocha', label: 'Mocha' },
  { value: 'Frappuccino', label: 'Frappuccino' },
  { value: 'Cold Brew', label: 'Cold Brew' },
  { value: 'Specialty', label: 'Specialty Coffee' },
];

// Keep the simple array for frontend filters if needed
export const categoryFilters = CATEGORIES.map(c => c.value);
