-- Update event images with real URLs from free sources
-- These are direct links to images from Unsplash and Pexels

-- Update existing event images with real URLs
UPDATE event_images SET 
  url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
  alt_text = 'Charity fun run participants at Riverside Park'
WHERE event_id = 1;

UPDATE event_images SET 
  url = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center',
  alt_text = 'Elegant charity gala dinner event'
WHERE event_id = 2;

UPDATE event_images SET 
  url = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
  alt_text = 'Outdoor charity concert with crowd'
WHERE event_id = 3;

UPDATE event_images SET 
  url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center',
  alt_text = 'Charity auction with rare books'
WHERE event_id = 9;

-- Add more images for events that don't have any
INSERT INTO event_images (event_id, url, alt_text, is_featured) VALUES
(4, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', 'Silent auction with eco art', TRUE),
(5, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center', 'CityCare fun run participants', TRUE),
(6, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', 'GreenSteps gala event', TRUE),
(7, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center', 'Virtual charity concert', TRUE),
(8, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center', 'Charity auction event', TRUE),
(10, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', 'GreenSteps night run', TRUE);

-- Add additional images for some events to create galleries
INSERT INTO event_images (event_id, url, alt_text, is_featured) VALUES
(1, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', 'Runners at the finish line', FALSE),
(1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center', 'Charity run start line', FALSE),
(2, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', 'Gala attendees networking', FALSE),
(3, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center', 'Concert stage setup', FALSE);
