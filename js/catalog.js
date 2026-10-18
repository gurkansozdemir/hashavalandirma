import { categories, products } from './catalog-data.js';
import { filterProducts } from './catalog-filter.js';
const search = document.querySelector('#product-search');
const form = document.querySelector('#catalog-search');
const buttons = [...document.querySelectorAll('[data-category]')];
const cards = [...document.querySelectorAll('[data-product]')];
const select = document.querySelector('#category-select');
const resetButtons = [...document.querySelectorAll('.reset-filters')];
let category = 'all';
function render(updateUrl = true) {
  const result = filterProducts(products, categories, category, search.value);
  const visible = new Set(result.map(product => product.id));
  for (const card of cards) card.hidden = !visible.has(card.dataset.product);
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.category === category));
  select.value = category;
  const resultCount = document.querySelector('#result-count');
  resultCount.replaceChildren(Object.assign(document.createElement('strong'), { textContent: String(result.length) }), document.createTextNode(' ürün / model'));
  document.querySelector('#empty-results').hidden = result.length !== 0;
  resetButtons[0].hidden = category === 'all' && !search.value.trim();
  if (updateUrl) {
    const url = new URL(location.href);
    if (category === 'all') url.searchParams.delete('kategori'); else url.searchParams.set('kategori', category);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }
}
function readUrl() {
  const params = new URLSearchParams(location.search);
  category = categories.some(item => item.id === params.get('kategori')) ? params.get('kategori') : 'all';
  search.value = params.get('q') || '';
  render(false);
}
buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
select.addEventListener('change', () => { category = select.value; render(); });
search.addEventListener('input', () => render());
form.addEventListener('submit', event => { event.preventDefault(); render(); });
resetButtons.forEach(button => button.addEventListener('click', () => { category = 'all'; search.value = ''; render(); search.focus(); }));
window.addEventListener('popstate', readUrl);
readUrl();
