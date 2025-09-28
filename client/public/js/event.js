// event.js

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

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    document.getElementById('event-root').innerHTML = '<p class="error">No event specified.</p>';
    return;
  }
  loadEvent(id);
  
  // Setup modal functionality
  setupModal();
});

function setupModal() {
  const modal = document.getElementById('registration-modal');
  const closeBtn = document.getElementById('close-modal');
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function showRegistrationModal() {
  const modal = document.getElementById('registration-modal');
  modal.style.display = 'flex';
}

async function loadEvent(id) {
  const root = document.getElementById('event-root');
  root.innerHTML = '<div class="loading">Loading event…</div>';
  try {
    const resp = await apiGet(`/events/${id}`);
    const { event, images, tags, registrations } = resp;
    if (!event) {
      root.innerHTML = '<p class="error">Event not found.</p>';
      return;
    }

    // Build HTML with better structure
    const eventContainer = document.createElement('div');
    eventContainer.style.cssText = 'background: var(--white); border-radius: var(--border-radius); box-shadow: var(--shadow); overflow: hidden; margin-bottom: var(--space-8);';

    const heroSection = document.createElement('div');
    heroSection.style.cssText = 'position: relative; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--white); padding: var(--space-12); text-align: center;';

    const title = document.createElement('h1');
    title.textContent = event.title;
    title.style.cssText = 'color: var(--white); margin-bottom: var(--space-4); font-size: var(--font-size-4xl);';

    const meta = document.createElement('div');
    meta.style.cssText = 'display: flex; justify-content: center; gap: var(--space-6); flex-wrap: wrap; margin-bottom: var(--space-6);';
    meta.innerHTML = `
      <div style="display: flex; align-items: center; gap: var(--space-2);">
        <span style="font-size: 1.2em;">📅</span>
        <span>${new Date(event.start_datetime).toLocaleString()}</span>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-2);">
        <span style="font-size: 1.2em;">📍</span>
        <span>${event.location}</span>
      </div>
    `;

    heroSection.appendChild(title);
    heroSection.appendChild(meta);

    const contentSection = document.createElement('div');
    contentSection.style.cssText = 'padding: var(--space-8);';

    // Description
    const desc = document.createElement('div');
    desc.style.cssText = 'margin-bottom: var(--space-8);';
    desc.innerHTML = `
      <h2 style="margin-bottom: var(--space-4); color: var(--gray-900);">About This Event</h2>
      <p style="line-height: 1.7; color: var(--gray-700); font-size: var(--font-size-lg);">${event.full_description || event.short_description || 'No description available.'}</p>
    `;

    // Gallery
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    if (images && images.length > 0) {
      gallery.style.cssText = 'margin: var(--space-6) 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);';
      images.forEach(img => {
        const im = document.createElement('img');
        im.src = img.url || getRandomPlaceholderImage();
        im.alt = img.alt_text || event.title;
        im.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: var(--border-radius); cursor: pointer; transition: transform 0.2s ease; box-shadow: var(--shadow);';
        im.addEventListener('click', () => {
          window.open(im.src, '_blank');
        });
        im.addEventListener('mouseenter', () => {
          im.style.transform = 'scale(1.05)';
        });
        im.addEventListener('mouseleave', () => {
          im.style.transform = 'scale(1)';
        });
        gallery.appendChild(im);
      });
    } else {
      // Show a placeholder image if no images are available
      gallery.style.cssText = 'margin: var(--space-6) 0; text-align: center;';
      const placeholderImg = document.createElement('img');
      placeholderImg.src = getRandomPlaceholderImage();
      placeholderImg.alt = event.title;
      placeholderImg.style.cssText = 'max-width: 400px; width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius); box-shadow: var(--shadow);';
      gallery.appendChild(placeholderImg);
    }

    // Organization info
    const org = document.createElement('div');
    org.style.cssText = 'background: var(--gray-50); padding: var(--space-6); border-radius: var(--border-radius); margin: var(--space-6) 0;';
    org.innerHTML = `
      <h3 style="margin-bottom: var(--space-3); color: var(--gray-900);">Organized by ${event.organisation.name}</h3>
      <div style="display: flex; flex-direction: column; gap: var(--space-2);">
        ${event.organisation.contact_email ? `<p style="margin: 0; color: var(--gray-600);">📧 ${event.organisation.contact_email}</p>` : ''}
        ${event.organisation.contact_phone ? `<p style="margin: 0; color: var(--gray-600);">📞 ${event.organisation.contact_phone}</p>` : ''}
      </div>
    `;

    // Tags
    const tagsWrap = document.createElement('div');
    tagsWrap.style.cssText = 'margin: var(--space-6) 0;';
    if (tags && tags.length > 0) {
      tagsWrap.innerHTML = `
        <h3 style="margin-bottom: var(--space-3); color: var(--gray-900);">Tags</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
          ${tags.map(t => `<span style="background: var(--primary); color: var(--white); padding: var(--space-1) var(--space-3); border-radius: var(--border-radius-sm); font-size: var(--font-size-sm);">${t.name}</span>`).join('')}
        </div>
      `;
    }

    // Progress bar
    const prog = document.createElement('div');
    prog.className = 'progress-full';
    prog.style.cssText = 'background: var(--gray-50); padding: var(--space-6); border-radius: var(--border-radius); margin: var(--space-6) 0;';
    prog.innerHTML = `
      <div class="progress-label" style="font-size: var(--font-size-lg);">
        <span>💰 Raised: $${Number(event.progress_amount).toFixed(2)}</span>
        <span>🎯 Goal: $${Number(event.goal_amount).toFixed(2)}</span>
        <span>📊 ${event.progress_percent}%</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar" role="progressbar" aria-valuenow="${event.progress_percent}" aria-valuemin="0" aria-valuemax="100" style="width:${Math.min(event.progress_percent,100)}%"></div>
      </div>
    `;

    // Register button
    const registerBtn = document.createElement('button');
    registerBtn.textContent = 'Register for Event';
    registerBtn.style.cssText = 'display: inline-block; padding: var(--space-3) var(--space-8); font-size: var(--font-size-base); margin-top: var(--space-6); background: var(--primary); color: var(--white); border: none; border-radius: var(--border-radius); cursor: pointer; font-weight: 500; transition: all 0.2s ease;';
    registerBtn.addEventListener('click', () => {
      showRegistrationModal();
    });
    
    // Add hover effect
    registerBtn.addEventListener('mouseenter', () => {
      registerBtn.style.background = 'var(--primary-dark)';
      registerBtn.style.transform = 'translateY(-1px)';
    });
    registerBtn.addEventListener('mouseleave', () => {
      registerBtn.style.background = 'var(--primary)';
      registerBtn.style.transform = 'translateY(0)';
    });

    contentSection.appendChild(desc);
    if (images && images.length > 0) {
      contentSection.appendChild(gallery);
    }
    contentSection.appendChild(org);
    if (tags && tags.length > 0) {
      contentSection.appendChild(tagsWrap);
    }
    contentSection.appendChild(prog);
    contentSection.appendChild(registerBtn);

    eventContainer.appendChild(heroSection);
    eventContainer.appendChild(contentSection);

    root.innerHTML = '';
    root.appendChild(eventContainer);
  } catch (err) {
    console.error(err);
    document.getElementById('event-root').innerHTML = `<p class="error">Failed to load event: ${err.message}</p>`;
  }
}
