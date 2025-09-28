# Charity Events Platform - Project Report

## Project Overview

The Charity Events Platform is a web application designed to help users discover, search, and learn about charity events in their community. The platform provides a user-friendly interface for browsing events, filtering by various criteria, and accessing detailed event information.

## Technical Architecture

### Backend (API)
- **Framework**: Node.js with Express.js
- **Database**: MySQL 8.0
- **Architecture**: RESTful API with MVC pattern
- **Key Features**:
  - Event management (CRUD operations)
  - Category management
  - Advanced search and filtering
  - Input validation and error handling
  - Database connection pooling

### Frontend (Client)
- **Technology**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: Single Page Application (SPA) with modular JavaScript
- **Key Features**:
  - Responsive design
  - Dynamic content loading
  - Search functionality
  - Event detail pages
  - API integration

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Database**: MySQL with sample data
- **CI/CD**: GitHub Actions workflow
- **Deployment**: Containerized deployment ready

## Database Schema

### Core Tables
1. **organisations** - Stores charity organization information
2. **categories** - Event categories for classification
3. **events** - Main events table with relationships

### Key Relationships
- Events belong to organizations (many-to-one)
- Events belong to categories (many-to-one)
- Soft delete implementation for events

## API Endpoints

### Events
- `GET /api/events` - List events with filtering
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Features Implemented

### User Features
1. **Home Page**: Featured events display
2. **Search Functionality**: Filter by date, location, category
3. **Event Details**: Comprehensive event information
4. **Responsive Design**: Mobile-friendly interface

### Admin Features
1. **Event Management**: Full CRUD operations
2. **Category Management**: Organize events by type
3. **Organization Management**: Manage charity organizations

### Technical Features
1. **Input Validation**: Server-side validation with express-validator
2. **Error Handling**: Comprehensive error handling middleware
3. **Database Optimization**: Indexed queries for performance
4. **Security**: SQL injection prevention, input sanitization

## Development Process

### Project Structure
```
charityevents/
├── api/                    # Backend API
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   └── event_db.js        # Database connection
├── client/                # Frontend
│   └── public/           # Static files
├── docker/               # Containerization
└── docs/                 # Documentation
```

### Development Workflow
1. **Planning**: Requirements analysis and architecture design
2. **Backend Development**: API endpoints and database schema
3. **Frontend Development**: User interface and interactions
4. **Testing**: Manual testing and validation
5. **Documentation**: Comprehensive documentation
6. **Deployment**: Docker containerization

## Challenges and Solutions

### Challenge 1: Database Design
**Problem**: Designing a flexible schema for events with multiple relationships
**Solution**: Normalized database design with proper foreign keys and indexes

### Challenge 2: Search Functionality
**Problem**: Implementing efficient search with multiple optional filters
**Solution**: Dynamic SQL query building with parameterized queries

### Challenge 3: Frontend-Backend Integration
**Problem**: Seamless communication between frontend and API
**Solution**: RESTful API design with consistent JSON responses

## Future Enhancements

### Planned Features
1. **User Authentication**: User accounts and login system
2. **Event Registration**: Users can register for events
3. **Notifications**: Email/SMS notifications for event updates
4. **Admin Dashboard**: Web-based admin interface
5. **Mobile App**: Native mobile application
6. **Analytics**: Event attendance and engagement metrics

### Technical Improvements
1. **Caching**: Redis for improved performance
2. **Search**: Elasticsearch for advanced search capabilities
3. **File Uploads**: Image uploads for events
4. **API Documentation**: Swagger/OpenAPI documentation
5. **Testing**: Comprehensive test suite

## Conclusion

The Charity Events Platform successfully provides a foundation for charity event management and discovery. The modular architecture allows for easy expansion and maintenance. The use of modern web technologies ensures good performance and user experience.

The project demonstrates proficiency in:
- Full-stack web development
- Database design and optimization
- API development and integration
- Frontend development and user experience
- Containerization and deployment
- Project organization and documentation

## Technical Specifications

- **Backend**: Node.js 18+, Express.js 4.18+
- **Database**: MySQL 8.0
- **Frontend**: HTML5, CSS3, ES6+ JavaScript
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git with GitHub
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- Docker (optional)

### Installation
1. Clone the repository
2. Install dependencies: `npm install` (in api directory)
3. Set up environment variables
4. Initialize database with sample data
5. Start the application

### Docker Deployment
1. Navigate to docker directory
2. Run `docker-compose up -d`
3. Access application at http://localhost:3000

---

*This project was developed as part of PROG2002 coursework, demonstrating full-stack web development skills and best practices.*
