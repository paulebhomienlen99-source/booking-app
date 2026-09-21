# Complete Deployment Instructions

## ✅ What's Done

1. **GitHub Repository** - https://github.com/paulebhomienlen99-source/booking-app
   - All code pushed (frontend, backend, Docker setup)
   - GitHub Actions configured for auto-deployment
   
2. **Docker Hub Images** - Ready to use
   - Backend: `paulakhere/booking-app-backend:latest`
   - Frontend: `paulakhere/booking-app-frontend:latest`

3. **Local Development** - Works on your machine
   - `docker compose up` to run everything locally

---

## 🚀 Deploy to Heroku (Next Step)

### Step 1: Create Heroku Account & Install CLI

```bash
# Go to https://www.heroku.com and sign up (free)
# Download Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# Verify installation
heroku --version
```

### Step 2: Login to Heroku

```bash
heroku login
# Opens browser to authenticate
```

### Step 3: Create Heroku App

```bash
# Navigate to project directory
cd C:\booking-app

# Create new Heroku app (choose unique name)
heroku create booking-app-prod

# This will show:
# Creating ⬢ booking-app-prod... done
# https://booking-app-prod.herokuapp.com/
```

### Step 4: Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:hobby-dev -a booking-app-prod
# This gives you a free PostgreSQL database
```

### Step 5: Set Environment Variables

```bash
heroku config:set NODE_ENV=production -a booking-app-prod
heroku config:set JWT_SECRET=your-super-secret-key-12345 -a booking-app-prod
heroku config:set EMAIL_USER=your-email@gmail.com -a booking-app-prod
heroku config:set EMAIL_PASS=your-gmail-app-password -a booking-app-prod
```

**⚠️ For EMAIL_PASS:**
1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Select "Mail" and "Windows Computer"
4. You'll get a 16-character password
5. Use that for `EMAIL_PASS`

### Step 6: Deploy from GitHub

```bash
# Set up git remote for Heroku
heroku git:remote -a booking-app-prod

# Deploy your main branch
git push heroku main

# View logs to see if it's working
heroku logs --tail -a booking-app-prod
```

### Step 7: Access Your App

```
Frontend: https://booking-app-prod.herokuapp.com
API: https://booking-app-prod.herokuapp.com:3001/services
```

---

## 📋 Enable Auto-Deployment (GitHub Actions)

After first manual push, set these GitHub Secrets:

1. Go to your GitHub repo settings: https://github.com/paulebhomienlen99-source/booking-app/settings/secrets/actions

2. Add these secrets:
   - `HEROKU_API_KEY` → Get from https://dashboard.heroku.com/account/applications
   - `HEROKU_APP_NAME` → `booking-app-prod`
   - `HEROKU_EMAIL` → Your Heroku email

3. Now every `git push origin main` auto-deploys to Heroku

---

## 🐳 Share Docker Images with Team

Team members can run your app without GitHub or Heroku:

```bash
# Pull and run backend
docker run -d -p 3001:3001 \
  -e DATABASE_URL="your-db-url" \
  paulakhere/booking-app-backend:latest

# Pull and run frontend
docker run -d -p 3000:3000 \
  paulakhere/booking-app-frontend:latest

# Or use full compose (recommended)
docker compose -f docker-compose.production.yml up --pull always
```

---

## ✨ Your Complete Setup

```
GitHub (Code)
    ↓
Push to main branch
    ↓
GitHub Actions (CI)
    ↓
Auto-Deploy to Heroku
    ↓
Live at https://booking-app-prod.herokuapp.com

PLUS:
Docker Hub Images available for team use
```

---

## 🔍 Troubleshooting

**App crashes on Heroku:**
```bash
heroku logs --tail -a booking-app-prod
```

**Database not connecting:**
```bash
# Check DATABASE_URL was set
heroku config -a booking-app-prod

# Reset database
heroku pg:reset DATABASE -a booking-app-prod
```

**Email not working:**
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check 2FA is enabled on Gmail
- Ensure "Less secure app access" is ON (if using Gmail)

**Images not pulling from Docker Hub:**
```bash
docker logout
docker login -u paulakhere
docker compose -f docker-compose.production.yml pull
```

---

## 📱 API Examples

### Sign Up
```bash
curl -X POST https://booking-app-prod.herokuapp.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST https://booking-app-prod.herokuapp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Services (No auth needed)
```bash
curl https://booking-app-prod.herokuapp.com/services
```

### Create Booking
```bash
curl -X POST https://booking-app-prod.herokuapp.com/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "service_id": "550e8400-e29b-41d4-a716-446655440001",
    "booking_date": "2026-10-15",
    "booking_time": "14:00"
  }'
```

---

## 🎯 Summary

- **GitHub**: Code backup + version control ✅
- **Docker Hub**: Share images with team ✅
- **Heroku**: Production deployment 🚀
- **Auto-Deploy**: GitHub Actions + Heroku ✅

Your app is production-ready!

---

**Next time you update code:**
```bash
cd C:\booking-app
git add .
git commit -m "Your changes"
git push origin main
# → Auto-deploys to Heroku
```
