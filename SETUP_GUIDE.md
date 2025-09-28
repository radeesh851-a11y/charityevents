# Charity Events Platform - Setup Guide

This guide will help you set up the Charity Events Platform safely and legitimately.

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed (or Docker)
- Git installed

## Step 1: Install Dependencies

Navigate to the API directory and install dependencies:

```bash
cd api
npm install
```

This will install all production and development dependencies including:
- Express.js for the web server
- MySQL2 for database connectivity
- Jest and Supertest for testing
- ESLint for code quality
- Nodemon for development

## Step 2: Database Setup

### Option A: Using Docker (Recommended)

1. Navigate to the docker directory:
```bash
cd docker
```

2. Start the database and API:
```bash
docker-compose up -d
```

This will:
- Start MySQL 8.0 with the pre-configured schema
- Start the API server in development mode
- Automatically seed the database with sample data

### Option B: Manual MySQL Setup

1. Create a MySQL database:
```sql
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. Import the schema and seed data:
```bash
mysql -u root -p charityevents_db < docker/mysql/init.sql
```

3. Create a `.env` file in the `api/` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=charityevents_db
PORT=3000
NODE_ENV=development
```

## Step 3: Start the Development Server

### If using Docker:
The server should already be running. Check at http://localhost:3000

### If using manual setup:
```bash
cd api
npm run dev
```

The API will be available at http://localhost:3000

## Step 4: Test the Setup

### Test the API:
```bash
cd api
npm test
```

### Test individual endpoints:
- Health check: http://localhost:3000/health
- Events API: http://localhost:3000/api/events
- Categories API: http://localhost:3000/api/categories

## Step 5: Frontend Setup

### Option A: Using Express Static Server (Recommended)
The API server already serves the frontend files. Visit:
- Homepage: http://localhost:3000
- Search: http://localhost:3000/search
- Event details: http://localhost:3000/event.html?id=1

### Option B: Using a separate static server
```bash
# Install serve globally
npm install -g serve

# Serve the client files
npx serve client/public -p 3001
```

Then visit http://localhost:3001

## Step 6: Development Workflow

### Running Tests
```bash
cd api
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Code Quality
```bash
cd api
npx eslint .          # Check code quality
npx eslint . --fix    # Auto-fix issues
```

### Database Management
```bash
# Access MySQL container (if using Docker)
docker exec -it charityevents_mysql mysql -u root -p charityevents_db

# Or use your local MySQL client
mysql -h localhost -u root -p charityevents_db
```

## Project Structure

```
charityevents/
├── api/                    # Backend API
│   ├── controllers/        # Request handlers
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middleware
│   ├── tests/            # Test files
│   ├── app.js            # Main application
│   ├── event_db.js       # Database connection
│   └── package.json      # Dependencies
├── client/               # Frontend
│   └── public/           # Static files
├── docker/               # Containerization
│   ├── docker-compose.yml
│   └── mysql/init.sql    # Database schema
└── docs/                 # Documentation
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/events` - List events (with pagination and filtering)
- `GET /api/events/search` - Search events
- `GET /api/events/:id` - Get single event
- `GET /api/categories` - List categories

## Troubleshooting

### Database Connection Issues
1. Check if MySQL is running
2. Verify database credentials in `.env`
3. Ensure the database exists and is accessible

### Port Already in Use
1. Check if port 3000 is already in use: `netstat -an | findstr :3000`
2. Kill the process or change the port in `.env`

### Docker Issues
1. Ensure Docker is running
2. Check container logs: `docker-compose logs`
3. Restart containers: `docker-compose down && docker-compose up -d`

## Next Steps

1. **Explore the API**: Use tools like Postman or curl to test endpoints
2. **Run Tests**: Ensure all tests pass with `npm test`
3. **Check Frontend**: Verify the UI loads and functions correctly
4. **Review Code**: Go through each file and understand the implementation
5. **Add Features**: Consider adding new functionality or improvements

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Implement proper authentication for production
- Add input validation and sanitization
- Use HTTPS in production

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure the database is properly set up
4. Check that all required environment variables are set
