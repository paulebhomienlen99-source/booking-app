# 📅 Booking App - Full Stack with Authentication & Email

A complete booking application with JWT authentication, email notifications, and Docker containerization.

## Features

✅ **User Authentication** - Sign up, login with JWT tokens  
✅ **Email Notifications** - Booking confirmations via Gmail  
✅ **Service Booking** - Browse and book available services  
✅ **Docker Ready** - Production-ready containers on Docker Hub  
✅ **Multi-tier Architecture** - Frontend, Backend API, PostgreSQL Database

---

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose installed
- Gmail account (for email notifications)

### Run Locally

```bash
# Clone or download the project
cd booking-app

# Start all services
docker compose up --build

# Access the app
Frontend: http://localhost:3000
API: http://localhost:3001
```

### Environment Variables (`.env`)

```
DATABASE_URL=postgresql://postgres:[REDACTED]@postgres:5432/postgres
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**To get Gmail app password:**
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an "App Password" for Mail
4. Use it in `EMAIL_PASS`

---

## Docker Hub Images

Both images are hosted on Docker Hub and automatically pulled:

```bash
paulakhere/booking-app-backend:latest
paulakhere/booking-app-frontend:latest
```

To run directly from Docker Hub:

```bash
docker pull paulakhere/booking-app-backend:latest
docker pull paulakhere/booking-app-frontend:latest
```

---

## Production Deployment

Use `docker-compose.production.yml` to deploy with images from Docker Hub:

```bash
docker compose -f docker-compose.production.yml up --pull always
```

---

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login and get JWT token

### Services
- `GET /services` - List all available services (no auth required)

### Bookings (requires JWT token in `Authorization: Bearer <token>` header)
- `POST /bookings` - Create a booking
- `GET /bookings` - Get user's bookings
- `PATCH /bookings/:id` - Update booking status

---

## Example API Calls

### Sign Up
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Signup successful"
}
```

### Create Booking
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "service_id": "550e8400-e29b-41d4-a716-446655440001",
    "booking_date": "2026-10-01",
    "booking_time": "14:00"
  }'
```

---

## Files & Structure

```
booking-app/
├── server.js                    # Backend Express API with JWT & email
├── index.html                   # Frontend React-like UI
├── package.json                 # Node dependencies
├── Dockerfile.backend           # Backend multi-stage Dockerfile
├── Dockerfile.frontend          # Frontend multi-stage Dockerfile
├── docker-compose.yml           # Local development compose
├── docker-compose.production.yml # Production compose (uses Docker Hub images)
├── .env                         # Environment variables
└── .dockerignore                # Exclude files from Docker build
```

---

## Key Improvements Made

**1. JWT Authentication**
- Secure user signup/login
- Token-based session management
- Password hashing with bcryptjs

**2. Email Notifications**
- Booking confirmations sent to user email
- HTML formatted emails
- Configured for Gmail

**3. Docker Deployment**
- Multi-stage builds for smaller images
- Environment variable configuration
- Production-ready docker-compose file
- Published on Docker Hub for easy access

**4. Database**
- PostgreSQL with tables for users, services, bookings
- User-scoped bookings (can only see their own)
- Automatic sample data seeding

---

## Troubleshooting

### Images won't pull from Docker Hub
```bash
docker logout
docker login
docker compose -f docker-compose.production.yml pull
```

### Email not sending
- Check Gmail app password is correct
- Ensure 2FA is enabled on your Google account
- Verify `EMAIL_USER` matches the account with app password

### Database connection failed
- Ensure `docker compose down -v` was run before starting
- Check DATABASE_URL in `.env` matches the container name

---

## Next Steps

1. **Database Backups** - Add automated PostgreSQL backups
2. **API Documentation** - Generate Swagger/OpenAPI docs
3. **Frontend Enhancements** - Add calendar UI, service filters
4. **Analytics** - Track bookings, popular services
5. **Payment Integration** - Add Stripe for paid bookings

---

## License

MIT - Free to use and modify

