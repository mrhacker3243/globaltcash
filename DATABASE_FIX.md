# Railway Database Connection Issue

## Problem
Cannot connect to Railway PostgreSQL database at `shortline.proxy.rlwy.net:48814`

## Immediate Solutions

### Option 1: Update Railway Database Credentials (RECOMMENDED)
Your Railway database credentials might have expired or changed. Please:

1. Go to https://railway.app
2. Login to your account
3. Select your project
4. Go to the PostgreSQL service
5. Click on "Connect" or "Variables"
6. Copy the new `DATABASE_URL`
7. Update your `.env` file with the new URL

### Option 2: Use Local PostgreSQL (For Development)
If you want to develop locally without Railway:

```bash
# Install PostgreSQL locally
# Then update .env to:
DATABASE_URL="postgresql://postgres:password@localhost:5432/exotic_cash"

# Push schema
npx prisma db push

# Seed database
npx prisma db seed
```

### Option 3: Check Railway Database Status
The database might be:
- Sleeping (free tier databases sleep after inactivity)
- Deleted or moved
- Having network issues

## What I've Fixed

1. ✅ Enhanced `src/lib/auth.ts` with detailed error logging
2. ✅ Added database connection testing before authentication
3. ✅ Created diagnostic scripts (`check-db.js`)

## Test Credentials
Once database is connected:
- **Email:** admin@admin.com
- **Password:** admin

## Next Steps
Please check your Railway dashboard and update the DATABASE_URL in your .env file.
