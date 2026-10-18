export function normalize(value) {
  return String(value).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, ' ').trim();
}
const fanCategories = new Set(['sessiz-fanlar', 'otopark-fanlari', 'atex-fanlar', 'salyangoz-ve-hucreli-fanlar']);
export function filterProducts(products, categories, category = 'all', query = '') {
  const terms = normalize(query).split(' ').filter(Boolean);
  return products.filter(product => {
    const categoryMatch = category === 'all' || (category === 'fanlar' ? fanCategories.has(product.category) : product.category === category);
    if (!categoryMatch) return false;
    const categoryName = categories.find(item => item.id === product.category)?.name || '';
    const haystack = normalize([product.name, categoryName, product.description, ...product.features].join(' '));
    return terms.every(term => haystack.includes(term));
  });
}
