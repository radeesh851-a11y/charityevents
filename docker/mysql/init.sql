-- charityevents_db.sql
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE charityevents_db;

-- Organisations
CREATE TABLE organisations (
  org_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Tags (for flexible tagging)
CREATE TABLE tags (
  tag_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Events
CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  short_description VARCHAR(300),
  full_description TEXT,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME,
  location VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0.00,
  goal_amount DECIMAL(12,2) DEFAULT 0.00,
  progress_amount DECIMAL(12,2) DEFAULT 0.00,
  status ENUM('active','suspended','cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(org_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Event images (one or many)
CREATE TABLE event_images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Event tags (many-to-many)
CREATE TABLE event_tags (
  event_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (event_id, tag_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- Users (attendees and admin)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('attendee','admin') DEFAULT 'attendee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations (tickets/donations)
CREATE TABLE registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT,
  num_tickets INT DEFAULT 1,
  amount_paid DECIMAL(12,2) DEFAULT 0.00,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Payments (mock; can integrate real gateway later)
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  payment_method VARCHAR(100),
  payment_amount DECIMAL(12,2) NOT NULL,
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(registration_id)
);

-- Audit logs for important actions
CREATE TABLE audit_logs (
  audit_id INT AUTO_INCREMENT PRIMARY KEY,
  entity VARCHAR(100),
  entity_id INT,
  action VARCHAR(100),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search performance
CREATE INDEX idx_events_date ON events (start_datetime);
CREATE INDEX idx_events_location ON events (location(100));
CREATE INDEX idx_events_category ON events (category_id);

-- --------- Seed data ----------
INSERT INTO organisations (name, description, contact_email, contact_phone)
VALUES
('CityCare Foundation', 'A community-driven non-profit raising funds for local healthcare.', 'contact@citycare.org', '+61 2 9000 0000'),
('GreenSteps Charity', 'Promoting environmental action via community events.', 'hello@greensteps.org', '+61 2 9000 1111');

INSERT INTO categories (name) VALUES
('Fun Run'),
('Gala'),
('Concert'),
('Auction');

INSERT INTO tags (name) VALUES
('Family-friendly'), ('Outdoors'), ('Formal'), ('Music'), ('Fundraising');

-- Users (password_hash placeholders - in real project use bcrypt)
INSERT INTO users (name,email,password_hash,role)
VALUES
('Alice Smith','alice@example.com','$2b$10$placeholderhash','attendee'),
('Bob Admin','admin@example.com','$2b$10$placeholderhash','admin'),
('Charlie Guest','charlie@example.com','$2b$10$placeholderhash','attendee');

-- Events (10 events; some past, some upcoming relative to 2025-09-28)
INSERT INTO events (org_id, category_id, title, short_description, full_description, start_datetime, end_datetime, location, price, goal_amount, progress_amount, status)
VALUES
(1, 1, 'CityCare Fun Run 2025', '5km community fun run', 'Join our 5km run to raise funds for hospital equipment.', '2025-10-15 08:00:00', '2025-10-15 11:00:00', 'Riverside Park, City', 10.00, 5000.00, 1250.00, 'active'),
(1, 2, 'Gala for Health', 'Annual fundraising gala', 'Black tie event with dinner and auction.', '2025-11-20 18:30:00', '2025-11-20 23:00:00', 'Grand Hall, City Centre', 150.00, 20000.00, 5000.00, 'active'),
(2, 3, 'GreenSteps Summer Concert', 'Outdoor concert supporting tree planting', 'Local bands perform to raise money for reforestation.', '2025-12-05 16:00:00', '2025-12-05 21:00:00', 'Botanic Gardens', 25.00, 8000.00, 3200.00, 'active'),
(2, 4, 'Silent Auction - Eco Art', 'Auction of eco-themed artworks', 'Bid on artworks; proceeds support sustainability programs.', '2025-09-10 18:00:00', '2025-09-10 21:00:00', 'Community Arts Centre', 0.00, 4000.00, 4000.00, 'active'),
(1, 1, 'CityCare Winter Walk (Past)', 'A winter charity walk', 'Short 3km walk that happened earlier in 2025.', '2025-07-20 09:00:00', '2025-07-20 11:00:00', 'Hilltop Park', 5.00, 2000.00, 2000.00, 'active'),
(2, 1, 'Family Fun Run - Past', 'Kids and families run together', 'Past event to promote family wellbeing.', '2025-06-15 09:00:00', '2025-06-15 12:00:00', 'Seaside Promenade', 8.00, 3000.00, 3000.00, 'active'),
(1, 3, 'CityCare Virtual Concert', 'Online concert to reach remote donors', 'Livestreamed performances raising funds for telehealth.', '2026-01-20 19:00:00', '2026-01-20 21:00:00', 'Online', 0.00, 5000.00, 0.00, 'active'),
(1, 2, 'GreenSteps Gala 2024 (Past)', 'Formal gala from previous year', 'Annual gala (archived).', '2024-11-23 18:00:00', '2024-11-23 23:00:00', 'Heritage Ballroom', 120.00, 15000.00, 15000.00, 'active'),
(1, 4, 'Charity Auction - Rare Books', 'Auction of rare books to fund literacy', 'Many rare books donated by collectors.', '2025-10-28 17:00:00', '2025-10-28 20:00:00', 'Old Library Hall', 0.00, 6000.00, 1800.00, 'active'),
(2, 3, 'GreenSteps Night Run', 'Night-time 10km run to light the city green', 'Glow-in-the-dark run with live DJs.', '2025-11-07 20:00:00', '2025-11-07 23:00:00', 'City Loop', 20.00, 10000.00, 1200.00, 'suspended');

-- Featured images (sample URLs; replace with real assets / relative paths in production)
INSERT INTO event_images (event_id, url, alt_text, is_featured)
VALUES
(1, 'https://example.org/images/funrun2025.jpg', 'Runners at Riverside Park', TRUE),
(2, 'https://example.org/images/gala2025.jpg', 'Gala banquet', TRUE),
(3, 'https://example.org/images/concert2025.jpg', 'Outdoor concert crowd', TRUE),
(9, 'https://example.org/images/auction_books.jpg', 'Rare books', TRUE);

-- Event tags linking
INSERT INTO event_tags (event_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 3),
(3, 4), (3, 2),
(9, 1);

-- Sample registrations and payments
INSERT INTO registrations (event_id, user_id, num_tickets, amount_paid)
VALUES
(1, 1, 2, 20.00),
(2, 3, 1, 150.00),
(3, NULL, 1, 25.00);

INSERT INTO payments (registration_id, payment_method, payment_amount)
VALUES
(1, 'card', 20.00),
(2, 'card', 150.00),
(3, 'paypal', 25.00);

-- A sample audit log entry
INSERT INTO audit_logs (entity, entity_id, action, details)
VALUES ('events', 10, 'suspension', 'Event suspended pending verification');
