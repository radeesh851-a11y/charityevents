const mysql = require('mysql2/promise');

async function updateImages() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Add password if needed
      database: 'charityevents_db'
    });

    console.log('Connected to database successfully!');

    // Update existing event images with real URLs
    const updates = [
      {
        eventId: 1,
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
        altText: 'Charity fun run participants at Riverside Park'
      },
      {
        eventId: 2,
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center',
        altText: 'Elegant charity gala dinner event'
      },
      {
        eventId: 3,
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
        altText: 'Outdoor charity concert with crowd'
      },
      {
        eventId: 9,
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center',
        altText: 'Charity auction with rare books'
      }
    ];

    // Update existing images
    for (const update of updates) {
      await connection.execute(
        'UPDATE event_images SET url = ?, alt_text = ? WHERE event_id = ?',
        [update.url, update.altText, update.eventId]
      );
      console.log(`Updated image for event ${update.eventId}`);
    }

    // Add new images for events that don't have any
    const newImages = [
      { eventId: 4, url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', altText: 'Silent auction with eco art', isFeatured: true },
      { eventId: 5, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center', altText: 'CityCare fun run participants', isFeatured: true },
      { eventId: 6, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', altText: 'GreenSteps gala event', isFeatured: true },
      { eventId: 7, url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center', altText: 'Virtual charity concert', isFeatured: true },
      { eventId: 8, url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center', altText: 'Charity auction event', isFeatured: true },
      { eventId: 10, url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', altText: 'GreenSteps night run', isFeatured: true }
    ];

    for (const image of newImages) {
      await connection.execute(
        'INSERT INTO event_images (event_id, url, alt_text, is_featured) VALUES (?, ?, ?, ?)',
        [image.eventId, image.url, image.altText, image.isFeatured]
      );
      console.log(`Added new image for event ${image.eventId}`);
    }

    // Add additional images for some events to create galleries
    const galleryImages = [
      { eventId: 1, url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', altText: 'Runners at the finish line', isFeatured: false },
      { eventId: 1, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center', altText: 'Charity run start line', isFeatured: false },
      { eventId: 2, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', altText: 'Gala attendees networking', isFeatured: false },
      { eventId: 3, url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center', altText: 'Concert stage setup', isFeatured: false }
    ];

    for (const image of galleryImages) {
      await connection.execute(
        'INSERT INTO event_images (event_id, url, alt_text, is_featured) VALUES (?, ?, ?, ?)',
        [image.eventId, image.url, image.altText, image.isFeatured]
      );
      console.log(`Added gallery image for event ${image.eventId}`);
    }

    console.log('All images updated successfully!');

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateImages();
