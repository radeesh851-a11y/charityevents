// home.js
document.addEventListener('DOMContentLoaded', () => {
  loadUpcomingEvents();
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

async function loadUpcomingEvents() {
  const list = document.getElementById('events-list');
  list.innerHTML = '<div class="loading">Loading events…</div>';
  try {
    const resp = await apiGet('/events', { upcoming: true, limit: 12, page: 1 });
    const events = resp.data || [];
    if (!events.length) {
      list.innerHTML = '<div class="text-center" style="padding: var(--space-12); color: var(--gray-500);"><h3>No upcoming events found</h3><p>Check back later for new charity events!</p></div>';
      return;
    }
    list.innerHTML = '';
    events.forEach((ev, index) => {
      const card = createEventCard(ev);
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');
      list.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = `<div class="error">Failed to load events: ${err.message}</div>`;
  }
}

function createEventCard(ev) {
  const article = document.createElement('article');
  article.className = 'event-card';

  // Add status class based on progress
  const percent = ev.progress_percent || 0;
  if (percent >= 100) {
    article.classList.add('status-completed');
  } else if (percent >= 75) {
    article.classList.add('status-urgent');
  } else {
    article.classList.add('status-active');
  }

  // Create image container with overlay
  const imgContainer = document.createElement('div');
  imgContainer.style.position = 'relative';
  imgContainer.style.overflow = 'hidden';

  const imgSrc = ev.featured_image || getRandomPlaceholderImage();
  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = ev.title || 'Event image';
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

  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = `event.html?id=${ev.event_id}`;
  a.textContent = ev.title;
  h3.appendChild(a);

  const meta = document.createElement('div');
  meta.className = 'event-card-meta';

  // Enhanced meta information with icons
  const dateP = document.createElement('p');
  dateP.innerHTML = `<span style="font-weight: 500;">📅</span> ${(ev.start_datetime) ? new Date(ev.start_datetime).toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'TBD'}`;

  const locP = document.createElement('p');
  locP.innerHTML = `<span style="font-weight: 500;">📍</span> ${ev.location || 'Location TBD'}`;

  const catP = document.createElement('p');
  catP.innerHTML = `<span style="font-weight: 500;">🏷️</span> ${ev.category_name || 'Event'}`;

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

  content.appendChild(h3);
  content.appendChild(meta);
  content.appendChild(progressWrap);

  article.appendChild(imgContainer);
  article.appendChild(badge);
  article.appendChild(content);

  // Make the entire card clickable
  article.style.cursor = 'pointer';
  article.addEventListener('click', () => {
    window.location.href = `event.html?id=${ev.event_id}`;
  });

  return article;
}
