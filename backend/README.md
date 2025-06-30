# Meta You Backend - Modular Monolith

A comprehensive backend system for the Meta You AI-powered personal operating system, built as a modular monolith for simplified deployment and maintenance.

## 🏗️ Architecture Overview

The backend is structured as a modular monolith with clear separation of concerns:

```
src/
├── server.js              # Main application entry point
├── database/              # Database connections and utilities
│   ├── connection.js      # MongoDB connection
│   └── redis.js          # Redis connection
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling middleware
├── modules/              # Feature modules
│   ├── auth/             # Authentication & authorization
│   ├── user/             # User profiles & growth tracking
│   ├── ai/               # AI mentorship & interactions
│   ├── analytics/        # User analytics & insights
│   ├── collaboration/    # Multi-generational collaboration
│   ├── security/         # Security monitoring & events
│   └── notification/     # Notification system
└── utils/               # Shared utilities
    └── logger.js        # Logging configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Redis 7+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📊 Module Details

### Authentication Module (`/api/auth`)
- User registration and login
- JWT token management
- Password reset functionality
- Account security features

### User Module (`/api/users`)
- User profile management
- Growth metrics tracking
- Achievement system
- Innovation project management

### AI Module (`/api/ai`)
- AI mentor interactions
- Learning pattern analysis
- Predictive insights
- Conversation history

### Analytics Module (`/api/analytics`)
- Event tracking
- User engagement metrics
- Growth trend analysis
- Dashboard data

### Collaboration Module (`/api/collaboration`)
- Multi-generational projects
- Wisdom exchange system
- Mentorship connections
- Community features

### Security Module (`/api/security`)
- Security event logging
- Risk assessment
- User security profiles
- Threat monitoring

### Notification Module (`/api/notifications`)
- In-app notifications
- Notification preferences
- Real-time alerts
- Delivery tracking

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/meta-you
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# AI Configuration
OPENAI_API_KEY=your-openai-api-key

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 📡 API Documentation

Interactive API documentation is available at:
- **Development**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔍 Monitoring & Logging

### Health Monitoring
- Health check endpoint: `GET /health`
- Real-time system status
- Database connection monitoring

### Logging
- Structured JSON logging with Winston
- Separate error and combined log files
- Console output in development
- Log rotation and retention

### Error Handling
- Centralized error handling middleware
- Detailed error logging with context
- User-friendly error responses
- Stack traces in development only

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
# Build image
docker build -t meta-you-backend .

# Run container
docker run -p 3000:3000 meta-you-backend
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Security event logging
- Account lockout protection
- CORS configuration
- Helmet.js security headers

## 📈 Performance Optimizations

- Redis caching for frequently accessed data
- Database query optimization
- Connection pooling
- Compression middleware
- Efficient data structures
- Lazy loading where appropriate

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Development Guidelines

### Code Organization
- Each module is self-contained with its own routes, models, and logic
- Shared utilities are placed in the `utils/` directory
- Database models are co-located with their respective modules
- Middleware is centralized for reusability

### Error Handling
- Use try-catch blocks for async operations
- Log errors with appropriate context
- Return user-friendly error messages
- Include correlation IDs for request tracing

### Database Operations
- Use Mongoose for MongoDB operations
- Implement proper indexing for performance
- Use transactions for multi-document operations
- Cache frequently accessed data in Redis

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add tests for new functionality
3. Update documentation as needed
4. Use meaningful commit messages
5. Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License.

---

**Meta You Backend** - Empowering personal growth through AI-driven insights and multi-generational collaboration.