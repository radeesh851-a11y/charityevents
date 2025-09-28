# Charity Events Platform

A full-stack web application for discovering and managing charity events in your community.

## 🚀 Features

- **Event Discovery**: Browse and search charity events with advanced filtering
- **Progress Tracking**: Visual progress bars showing fundraising goals
- **Responsive Design**: Clean, modern UI that works on all devices
- **RESTful API**: Comprehensive backend API with pagination and search
- **Database Management**: MySQL with optimized schema and relationships
- **Docker Support**: Easy deployment with containers
- **Testing**: Jest test suite with Supertest for API testing
- **Code Quality**: ESLint configuration for consistent code style

## 🏗️ Architecture

### Backend (API)
- Node.js with Express.js
- MySQL database with connection pooling
- RESTful API endpoints
- Input validation and error handling
- MVC architecture pattern

### Frontend (Client)
- Vanilla JavaScript with modern ES6+
- Responsive HTML5 and CSS3
- Modular JavaScript architecture
- API integration with async/await

### Infrastructure
- Docker containerization
- MySQL database with sample data
- GitHub Actions CI/CD
- Production-ready deployment

## 📁 Project Structure

```
charityevents/
├── api/                       # Backend API
│   ├── controllers/           # Request handlers
│   │   ├── eventsController.js
│   │   └── categoriesController.js
│   ├── routes/               # API routes
│   │   ├── events.js
│   │   └── categories.js
│   ├── middlewares/          # Custom middleware
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── event_db.js          # Database connection
│   ├── app.js               # Main application
│   ├── package.json         # Dependencies
│   └── Dockerfile           # Container config
├── client/                   # Frontend
│   ├── public/              # Static files
│   │   ├── index.html       # Homepage
│   │   ├── search.html      # Search page
│   │   ├── event.html       # Event details
│   │   ├── css/style.css    # Styles
│   │   └── js/              # JavaScript modules
│   └── package.json         # Frontend config
├── docker/                  # Containerization
│   ├── docker-compose.yml   # Multi-container setup
│   └── mysql/
│       └── init.sql         # Database initialization
├── .github/workflows/       # CI/CD
│   └── ci.yml              # GitHub Actions
├── docs/                   # Documentation
│   ├── project_report.md   # Technical documentation
│   └── video_script.md     # Demo script
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0 (or Docker)
- Git

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd charityevents

# Start with Docker Compose
cd docker
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Option 2: Manual Setup
```bash
# Clone the repository
git clone <repository-url>
cd charityevents

# Install dependencies
cd api
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Set up database
mysql -u root -p < docker/mysql/init.sql

# Start the development server
npm run dev

# Access the application
open http://localhost:3000
```

### Testing
```bash
cd api
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
```

### Code Quality
```bash
cd api
npx eslint .          # Check code quality
npx eslint . --fix    # Auto-fix issues
```

## 🔧 API Endpoints

### Events
- `GET /api/events` - List events (with filtering)
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

## 🗄️ Database Schema

### Core Tables
- **organisations**: Charity organization information
- **categories**: Event categories for classification
- **events**: Main events table with relationships

### Key Features
- Proper foreign key relationships
- Optimized indexes for performance
- Soft delete implementation
- Sample data included

## 🛠️ Development

### Backend Development
```bash
cd api
npm install
npm run dev  # Start with nodemon
```

### Frontend Development
The frontend is served statically by the Express server. No build process required.

### Database Management
```bash
# Access MySQL container
docker exec -it charityevents_mysql mysql -u charityevents_user -p charityevents_db

# Or use your local MySQL client
mysql -h localhost -u charityevents_user -p charityevents_db
```

## 🧪 Testing

```bash
# Run tests (when implemented)
cd api
npm test

# Test API endpoints
curl http://localhost:3000/api/events
curl http://localhost:3000/api/categories
```

## 📦 Deployment

### Docker Production
```bash
cd docker
docker-compose -f docker-compose.yml up -d
```

### Environment Variables
```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=example
DB_NAME=charityevents_db
PORT=3000
NODE_ENV=development
```

## 🔒 Security Features

- SQL injection prevention with parameterized queries
- Input validation and sanitization
- CORS configuration
- Error handling without information leakage
- Environment variable protection

## 🚀 Future Enhancements

- User authentication and authorization
- Event registration system
- Email/SMS notifications
- Admin dashboard
- Mobile application
- Advanced search with Elasticsearch
- File upload for event images
- Analytics and reporting

## 📚 Documentation

- [Project Report](docs/project_report.md) - Comprehensive technical documentation
- [Video Script](docs/video_script.md) - Demo presentation script
- [API Documentation](api/) - Backend API structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

Developed as part of PROG2002 coursework, demonstrating full-stack web development skills and modern best practices.

---

**Note**: This is a demonstration project showcasing full-stack web development capabilities with modern technologies and best practices.
