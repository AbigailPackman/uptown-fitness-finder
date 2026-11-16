const businesses = [
  {
    id: 'hotworx', name: 'HOTWORX Uptown', type: 'Hot yoga · Pilates · Barre', types: ['Yoga', 'Pilates', 'Barre', 'HIIT'],
    address: '4933 Magazine St, Ste 101, New Orleans, LA 70115', website: 'https://www.hotworx.net/studio/neworleans-uptown',
    price: null, rating: null, amenities: ['Infrared sauna', '24/7 member access', 'Virtual instructor-led classes', 'Functional training zone'],
    classes: ['Hot Yoga', 'Hot Pilates', 'Hot Barre', 'Hot Cycle', 'Hot Stretch', 'Hot Thunder'],
    photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative yoga studio photo'
  },
  {
    id: 'trilogy', name: 'Studio Trilogy', type: 'Strength · Sculpt · Stretch', types: ['Strength training', 'Sculpt', 'Mobility'],
    address: '5924 Magazine St, New Orleans, LA 70115', website: 'https://www.studio-trilogy.com/',
    price: null, rating: null, amenities: ['Infrared sauna', 'Pilates equipment', 'Recovery and stretching'],
    classes: ['Rhythm-based Sculpt', 'LIFT', 'Core & Strength', 'Mobility', 'Infrared Heated Mat'],
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative fitness studio photo'
  },
  {
    id: 'swoot', name: 'Swoot by Jon Sloan', type: 'Group fitness · Multi-workout', types: ['Cycling', 'HIIT', 'Yoga', 'Strength training', 'Pilates'],
    address: '701 Dante St, New Orleans, LA 70118', website: 'https://swootnola.com/',
    price: null, rating: null, amenities: ['Multiple workout styles'],
    classes: ['Indoor Cycling', 'HIIT', 'Yoga', 'Weight Training', 'Lagree Pilates', 'Step Aerobics'],
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative gym photo'
  },
  {
    id: 'uptown-fitness', name: 'Uptown Fitness', type: 'Neighborhood gym', types: ['Gym', 'Strength training'],
    address: '4834 Pitt St, New Orleans, LA 70115', website: 'https://uptownfitnessnola.com/',
    price: null, rating: null, amenities: [], classes: [],
    photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative neighborhood gym photo'
  },
  {
    id: 'barre3', name: 'barre3 Uptown', type: 'Barre · Strength · Mindful movement', types: ['Barre', 'Strength training', 'Mindful movement'],
    address: '5235 Magazine St, New Orleans, LA 70115', website: 'https://www.barre3.com/studio-locations/new-orleans',
    price: null, rating: null, amenities: [], classes: ['Signature', 'B3 Strength', 'Mindful Flow'],
    photo: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative barre studio photo'
  },
  {
    id: 'orangetheory', name: 'Orangetheory Fitness Uptown', type: 'Group fitness · HIIT', types: ['HIIT', 'Cardio', 'Strength training'],
    address: '5300 Tchoupitoulas St, New Orleans, LA 70115', website: 'https://www.orangetheory.com/en-us/locations/new-orleans-louisiana-0493',
    price: null, rating: null, amenities: ['In-app performance tracking'], classes: ['Heart-rate-based interval training'],
    photo: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80', photoAlt: 'Illustrative group fitness photo'
  }
];

const grid = document.querySelector('#business-grid');
const searchInput = document.querySelector('#search-input');
const typeFilter = document.querySelector('#type-filter');
const priceFilter = document.querySelector('#price-filter');
const ratingFilter = document.querySelector('#rating-filter');
const amenityFilter = document.querySelector('#amenity-filter');
const compareSelected = new Set();
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function fillFilters() {
  const types = [...new Set(businesses.flatMap((business) => business.types))].sort();
  const amenities = [...new Set(businesses.flatMap((business) => [...business.amenities, ...business.classes]))].sort();
  types.forEach((value) => typeFilter.add(new Option(value, value)));
  amenities.forEach((value) => amenityFilter.add(new Option(value, value)));
}

function visibleBusinesses() {
  const term = searchInput.value.trim().toLowerCase();
  return businesses.filter((business) => {
    const searchable = [business.name, business.type, business.address, ...business.types, ...business.amenities, ...business.classes].join(' ').toLowerCase();
    const matchesSearch = !term || searchable.includes(term);
    const matchesType = !typeFilter.value || business.types.includes(typeFilter.value);
    const matchesAmenity = !amenityFilter.value || [...business.amenities, ...business.classes].includes(amenityFilter.value);
    const minRating = Number(ratingFilter.value);
    const matchesRating = !ratingFilter.value || (business.rating !== null && business.rating >= minRating);
    const priceRanges = {under50: [0, 50], '50to100': [50, 100], over100: [100, Infinity]};
    const range = priceRanges[priceFilter.value];
    const matchesPrice = !range || (business.price !== null && business.price >= range[0] && business.price <= range[1]);
    return matchesSearch && matchesType && matchesAmenity && matchesRating && matchesPrice;
  });
}

function cardTemplate(business) {
  const selected = compareSelected.has(business.id);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
  const tags = business.amenities.length ? business.amenities : [];
  return `<article class="business-card">
    <div class="card-photo" role="img" aria-label="${esc(business.photoAlt)}" style="background-image:url('${business.photo}')"><span class="photo-label">ILLUSTRATIVE PHOTO</span><button class="compare-toggle" type="button" data-compare="${business.id}" aria-pressed="${selected}">${selected ? '✓ Added' : '+ Compare'}</button></div>
    <div class="card-body"><p class="card-type">${esc(business.type)}</p><div class="card-title-row"><h3 class="card-title">${esc(business.name)}</h3><span class="rating">Rating: Not published</span></div>
      <p class="card-address"><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">${esc(business.address)} ↗</a></p>
      <div class="card-meta"><div class="meta-item"><span>Pricing</span><strong>Not published</strong></div><div class="meta-item"><span>Workout types</span><strong>${esc(business.types.slice(0, 3).join(' · '))}${business.types.length > 3 ? ' +' : ''}</strong></div></div>
      <div class="card-details"><div class="detail-title">Amenities</div>${tags.length ? `<div class="tag-list">${tags.map((tag) => `<span class="detail-tag">${esc(tag)}</span>`).join('')}</div>` : '<span class="detail-empty">Not published</span>'}</div>
      <div class="card-details"><div class="detail-title">Classes</div>${business.classes.length ? `<div class="tag-list">${business.classes.map((tag) => `<span class="detail-tag">${esc(tag)}</span>`).join('')}</div>` : '<span class="detail-empty">Not published</span>'}</div>
      <div class="card-links"><a href="${business.website}" target="_blank" rel="noopener noreferrer">Visit website ↗</a><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Directions ↗</a></div>
    </div></article>`;
}

function render() {
  const matches = visibleBusinesses();
  grid.innerHTML = matches.map(cardTemplate).join('');
  document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'studio' : 'studios'}`;
  document.querySelector('#empty-state').hidden = matches.length > 0;
  updateCompareBar();
  updateMap(matches);
}

function updateMap(matches) {
  const mapQuery = matches.length ? matches.map((business) => `${business.name} ${business.address}`).join(' OR ') : 'fitness studios Uptown New Orleans';
  document.querySelector('#map-embed').src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  document.querySelector('#open-map').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

function updateCompareBar() {
  const bar = document.querySelector('#compare-bar');
  bar.hidden = compareSelected.size === 0;
  document.querySelector('#compare-count').textContent = compareSelected.size;
  document.querySelector('#compare-chips').innerHTML = [...compareSelected].map((id) => `<span class="compare-chip">${esc(businesses.find((business) => business.id === id)?.name || '')}</span>`).join('');
}

function comparisonTemplate() {
  const chosen = businesses.filter((business) => compareSelected.has(business.id));
  const rows = [
    ['Studio', (business) => business.name], ['Workout types', (business) => business.types.join(', ')],
    ['Address', (business) => business.address], ['Published pricing', (business) => business.price === null ? 'Not published' : `$${business.price}/month`],
    ['Rating', (business) => business.rating === null ? 'Not published' : `${business.rating}/5`],
    ['Amenities', (business) => business.amenities.length ? business.amenities.join(', ') : 'Not published'],
    ['Classes', (business) => business.classes.length ? business.classes.join(', ') : 'Not published'],
    ['Website', (business) => `<a href="${business.website}" target="_blank" rel="noopener noreferrer">Visit official website ↗</a>`]
  ];
  return `<table class="comparison-table"><tbody>${rows.map(([label, getter]) => `<tr><th scope="row">${label}</th>${chosen.map((business) => `<td>${label === 'Website' ? getter(business) : esc(getter(business))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-compare]');
  if (!button) return;
  const id = button.dataset.compare;
  if (compareSelected.has(id)) compareSelected.delete(id);
  else if (compareSelected.size >= 3) {
    button.textContent = 'Up to 3';
    window.setTimeout(render, 900);
    return;
  } else compareSelected.add(id);
  render();
});

[searchInput, typeFilter, priceFilter, ratingFilter, amenityFilter].forEach((control) => control.addEventListener(control === searchInput ? 'input' : 'change', render));
function resetFilters() { searchInput.value = ''; typeFilter.value = ''; priceFilter.value = ''; ratingFilter.value = ''; amenityFilter.value = ''; render(); }
document.querySelector('#clear-filters').addEventListener('click', resetFilters);
document.querySelector('#empty-reset').addEventListener('click', resetFilters);
document.querySelector('#compare-clear').addEventListener('click', () => { compareSelected.clear(); render(); });
document.querySelector('#compare-open').addEventListener('click', () => {
  document.querySelector('#comparison-table').innerHTML = comparisonTemplate();
  document.querySelector('#compare-dialog').showModal();
});
document.querySelector('#dialog-close').addEventListener('click', () => document.querySelector('#compare-dialog').close());
document.querySelector('#compare-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

fillFilters();
render();
