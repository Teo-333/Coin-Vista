# CoinVista Backend Setup Guide

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your actual values (see required variables below)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev --schema=./src/prisma/schema.prisma
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Required Environment Variables

### ✅ **Must Configure These:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./src/prisma/dev.db` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-32-character-secret-key` |
| `EMAIL_USER` | Email address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `your-app-password` |
| `FRONTEND_URL` | Frontend URL for reset links | `http://localhost:3000` |

### 🔧 **Gmail Setup (for forgot password):**

1. Enable 2-Factor Authentication in your Google Account
2. Go to **Google Account Settings** → **Security** → **2-Step Verification** → **App passwords**
3. Generate a new app password for "Mail"
4. Use this app password in `EMAIL_PASSWORD` (not your regular Gmail password)

### 📋 **Optional Variables:**

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (info/debug/error)

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Run database migrations
npx prisma migrate dev --schema=./src/prisma/schema.prisma

# Generate Prisma client
npx prisma generate --schema=./src/prisma/schema.prisma

# View database in browser
npx prisma studio --schema=./src/prisma/schema.prisma

# Run tests (if available)
npm test
```

## API Endpoints

Once running on `http://localhost:3001`:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Watchlist (requires authentication)
- `GET /watchlist` - Get user watchlist
- `POST /watchlist` - Toggle coin in watchlist

### Documentation
- `GET /api-docs` - Swagger API documentation

