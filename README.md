# E-Commerce Full Stack Application

A complete e-commerce application built with Go (Fiber) backend and React (TypeScript) frontend, featuring PostgreSQL database and Redis caching.

## 🚀 Tech Stack

### Backend
- **Go 1.21** - Programming language
- **Fiber v2** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **JWT** - Authentication
- **GORM** - ORM for database operations
- **Swagger** - API documentation

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
ecommerce-fullstack/
├── backend/                 # Go backend API
│   ├── config/             # Configuration files
│   ├── database/           # Database setup and migrations
│   ├── handlers/           # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # Route definitions
│   ├── main.go            # Application entry point
│   ├── go.mod             # Go module file
│   └── Dockerfile         # Backend Docker configuration
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── .env           # Environment variables
│   ├── package.json       # Node dependencies
│   └── Dockerfile.dev     # Frontend Docker configuration
├── docker-compose.yml      # Multi-container setup
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-fullstack
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger/index.html
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run the application**
   ```bash
   go run main.go
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp src/.env.example src/.env
   # Edit .env with your API URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/auth/profile` | Get user profile (protected) |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products (with pagination) |
| GET | `/api/v1/products/:id` | Get single product |
| GET | `/api/v1/categories` | Get all categories |
| POST | `/api/v1/admin/products` | Create product (admin) |
| PUT | `/api/v1/admin/products/:id` | Update product (admin) |
| DELETE | `/api/v1/admin/products/:id` | Delete product (admin) |

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cart` | Get user cart (protected) |
| POST | `/api/v1/cart/add` | Add item to cart (protected) |
| PUT | `/api/v1/cart/items/:id` | Update cart item (protected) |
| DELETE | `/api/v1/cart/items/:id` | Remove cart item (protected) |
| DELETE | `/api/v1/cart/clear` | Clear cart (protected) |

## 🔐 Default Credentials

### Admin User
- **Email**: admin@ecommerce.com
- **Password**: admin123

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: db_ecommerce
- **Username**: postgres
- **Password**: 1337

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **categories** - Product categories
- **products** - Product information
- **carts** - User shopping carts
- **cart_items** - Items in shopping carts
- **orders** - Customer orders
- **order_items** - Items in orders
- **reviews** - Product reviews
- **addresses** - User shipping addresses

## 🚀 Features

### User Features
- User registration and login
- Product browsing and search
- Shopping cart management
- Order placement
- Product reviews
- Profile management

### Admin Features
- Product management (CRUD)
- User management
- Order management
- Analytics dashboard
- Category management

### Technical Features
- JWT authentication
- Role-based access control
- RESTful API design
- Database migrations
- Redis caching
- API documentation
- Docker containerization

## 🧪 Testing

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=8080
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1337
DB_NAME=db_ecommerce
DB_SSLMODE=disable

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=168h

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENV=development
```

### Frontend (src/.env)
```env
VITE_API_URL=http://localhost:8080/api/v1
```

## 🚀 Deployment

### Production Deployment

1. **Build Docker images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Run production containers**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Considerations

- Change JWT secret in production
- Use environment-specific database credentials
- Enable HTTPS
- Set up proper CORS origins
- Configure Redis with password
- Use proper logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Redis connection failed**
   - Check Redis is running
   - Verify Redis configuration

3. **Frontend API errors**
   - Check backend is running
   - Verify API URL in frontend .env
   - Check CORS configuration

4. **Authentication issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure user is active

### Getting Help

- Check the logs: `docker-compose logs [service-name]`
- Review API documentation at `/swagger/index.html`
- Check environment variables
- Verify network connectivity between services

## 🔄 Development Workflow

1. Make changes to code
2. Test locally
3. Update documentation if needed
4. Commit changes
5. Push to repository
6. Deploy to staging/production

## 📈 Performance Considerations

- Database queries are optimized with proper indexing
- Redis caching for frequently accessed data
- Pagination for large datasets
- Image optimization for product photos
- Lazy loading in frontend
- API rate limiting (to be implemented)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- SQL injection prevention with GORM
- XSS protection in frontend
