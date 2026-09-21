# Booking App Deployment Guide

## Quick Start (Local)

```bash
git clone https://github.com/YOUR-USERNAME/booking-app.git
cd booking-app
npm install
docker compose up
# Access at http://localhost:3000
```

## Heroku Deployment (Production)

Your app is deployed at: **https://booking-app-prod.herokuapp.com**

### Manual Deployment

```bash
heroku login
heroku create booking-app-prod
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=change-me-in-production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
git push heroku main
heroku logs --tail
```

### Auto-Deployment (GitHub Actions)

1. Set these secrets in GitHub:
   - `HEROKU_API_KEY` - From https://dashboard.heroku.com/account/applications
   - `HEROKU_APP_NAME` - Your Heroku app name
   - `HEROKU_EMAIL` - Your Heroku email

2. Push to `main` branch → Auto-deploys to Heroku

## Using Docker Images

Team members can use your Docker Hub images:

```bash
docker compose -f docker-compose.production.yml up --pull always
```

Or individually:
```bash
docker run -p 3001:3001 paulakhere/booking-app-backend:latest
docker run -p 3000:3000 paulakhere/booking-app-frontend:latest
```

## Environment Variables

Create `.env` in project root:

```
DATABASE_URL=postgresql://user:[REDACTED]@host/dbname
NODE_ENV=production
JWT_SECRET=your-super-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**For Heroku**, set these in Dashboard or CLI:
```bash
heroku config:set VAR_NAME=value
```

## API Endpoints

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login (returns JWT token)
- `GET /services` - List all services
- `POST /bookings` - Create booking (requires JWT)
- `GET /bookings` - Get user's bookings (requires JWT)
- `PATCH /bookings/:id` - Update booking status (requires JWT)

## Database

PostgreSQL with 3 tables:
- `users` - Registered users
- `services` - Available services (pre-populated with 3 samples)
- `bookings` - User bookings

## Troubleshooting

**Images won't pull:**
```bash
docker logout && docker login
docker login
docker compose pull
```

**Database connection fails:**
```bash
heroku config
heroku logs --tail
```

**Email not sending:**
- Enable 2FA on Gmail
- Generate App Password: https://myaccount.google.com/apppasswords
- Set `EMAIL_PASS` to the 16-character password

## Team Usage

1. Clone repo: `git clone https://github.com/YOUR-USERNAME/booking-app.git`
2. Install: `npm install`
3. Run locally: `docker compose up`
4. Or use Docker Hub images directly

## Next Steps

- Add user profile management
- Implement payment processing
- Add service provider dashboard
- Set up monitoring/alerts
- Configure custom domain

---

**Questions?** Check `README.md` or raise an issue on GitHub.
