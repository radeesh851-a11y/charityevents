// search.js
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  const form = document.getElementById('search-form');
  form.addEventListener('submit', onSearch);
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
});

function getRandomPlaceholderImage() {
  // Create data URLs for placeholder images without base64 encoding
  const images = [
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">🤝</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">Charity Event</text>
      </svg>
    `),
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad2)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">🌱</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">Environmental</text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Charity Event</text>
      </svg>
    `),
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad3)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">❤️</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">Community</text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Support Event</text>
      </svg>
    `),
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad4)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">🎓</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">Education</text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Fundraiser</text>
      </svg>
    `)
  ];
  return images[Math.floor(Math.random() * images.length)];
}

async function populateCategories() {
  const select = document.getElementById('category');
  select.innerHTML = '<option value="">Loading…</option>';
  try {
    const resp = await apiGet('/categories');
    const cats = resp.data || [];
    select.innerHTML = '<option value="">-- Any category --</option>';
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.category_id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    select.innerHTML = '<option value="">(failed to load)</option>';
  }
}

function clearFilters(e) {
  e.preventDefault();
  document.getElementById('search-form').reset();
  document.getElementById('results').innerHTML = '';
}

async function onSearch(e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value;
  const category = document.getElementById('category').value;
  const results = document.getElementById('results');
  results.innerHTML = '<div class="loading">Searching…</div>';

  try {
    const resp = await apiGet('/events/search', { date, location, category, limit: 50 });
    const events = resp.data || [];
    if (!events.length) {
      results.innerHTML = '<div class="text-center" style="padding: var(--space-12); color: var(--gray-500);"><h3>No matching events found</h3><p>Try adjusting your search criteria</p></div>';
      return;
    }
    results.innerHTML = '';
    const ul = document.createElement('div');
    ul.className = 'grid';
    events.forEach((e, index) => {
      const card = document.createElement('article');
      card.className = 'event-card';

      // Add status class based on progress
      const percent = e.progress_percent || 0;
      if (percent >= 100) {
        card.classList.add('status-completed');
      } else if (percent >= 75) {
        card.classList.add('status-urgent');
      } else {
        card.classList.add('status-active');
      }

      // Create image container with overlay
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.src = e.featured_image || getRandomPlaceholderImage();
      img.alt = e.title;
      img.loading = 'lazy';
      
      // Add error handling for image loading
      img.onerror = function() {
        // Fallback to a simple colored background if image fails to load
        this.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'white';
        this.style.fontSize = '24px';
        this.innerHTML = '🤝';
      };

      const overlay = document.createElement('div');
      overlay.className = 'event-card-image-overlay';

      imgContainer.appendChild(img);
      imgContainer.appendChild(overlay);

      // Add badge
      const badge = document.createElement('div');
      badge.className = 'event-card-badge';
      if (percent >= 100) {
        badge.textContent = 'Completed';
        badge.classList.add('completed');
      } else if (percent >= 75) {
        badge.textContent = 'Almost Full';
        badge.classList.add('urgent');
      } else {
        badge.textContent = 'Upcoming';
        badge.classList.add('upcoming');
      }

      const content = document.createElement('div');
      content.className = 'event-card-content';

      const title = document.createElement('h3');
      const a = document.createElement('a');
      a.href = `event.html?id=${e.event_id}`;
      a.textContent = e.title;
      title.appendChild(a);

      const meta = document.createElement('div');
      meta.className = 'event-card-meta';

      // Enhanced meta information with icons
      const dateP = document.createElement('p');
      dateP.innerHTML = `<span style="font-weight: 500;">📅</span> ${new Date(e.start_datetime).toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;

      const locP = document.createElement('p');
      locP.innerHTML = `<span style="font-weight: 500;">📍</span> ${e.location}`;

      const catP = document.createElement('p');
      catP.innerHTML = `<span style="font-weight: 500;">🏷️</span> ${e.category_name}`;

      meta.appendChild(dateP);
      meta.appendChild(locP);
      meta.appendChild(catP);

      // Enhanced progress bar
      const progressWrap = document.createElement('div');
      progressWrap.className = 'progress-wrap';
      progressWrap.innerHTML = `
        <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" style="width:${Math.min(percent,100)}%"></div>
        <div class="progress-text">${percent}%</div>
      `;

      content.appendChild(title);
      content.appendChild(meta);
      content.appendChild(progressWrap);

      card.appendChild(imgContainer);
      card.appendChild(badge);
      card.appendChild(content);
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');

      // Make the entire card clickable
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = `event.html?id=${e.event_id}`;
      });

      ul.appendChild(card);
    });
    results.appendChild(ul);
  } catch (err) {
    console.error(err);
    results.innerHTML = `<p class="error">Search failed: ${err.message}</p>`;
  }
}
