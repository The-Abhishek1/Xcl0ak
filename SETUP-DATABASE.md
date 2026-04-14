# ═══════════════════════════════════════════════════════════════
#  XCLOAK — Database & Infrastructure Setup Guide
# ═══════════════════════════════════════════════════════════════

# ┌─────────────────────────────────────────────────────────────┐
# │  OPTION 1: SUPABASE (RECOMMENDED — you already have this)  │
# └─────────────────────────────────────────────────────────────┘
#
# You already created the project "Xcloak" on Supabase (Mumbai region).
# Now you just need the connection string.
#
# STEP 1: Get your connection string
# ─────────────────────────────────────
#   1. Go to: https://supabase.com/dashboard/project/pusmulkyvompodxfbkvm
#   2. Click "Connect" (green button, top right — you can see it in your screenshot)
#   3. Select "ORMs" tab
#   4. Select "Prisma" from the dropdown
#   5. Copy the connection string — it looks like:
#
#      postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
#
#   6. ALSO grab the "Direct connection" string (needed for migrations):
#
#      postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
#
#   NOTE: Replace [YOUR-PASSWORD] with the password you set when creating the project.
#         If you forgot it: Settings → Database → Reset database password
#
# STEP 2: Configure your .env file
# ─────────────────────────────────────
#   Create .env in your project root:

# --- Copy this into your .env file ---
# Pooled connection (for the app — goes through PgBouncer)
DATABASE_URL="postgresql://postgres.pusmulkyvompodxfbkvm:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations — bypasses PgBouncer)
DIRECT_URL="postgresql://postgres.pusmulkyvompodxfbkvm:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
# --- End .env ---

# STEP 3: Update prisma/schema.prisma datasource block
# ─────────────────────────────────────────────────────────
#   (I've already updated this in the project — see below)
#
#   datasource db {
#     provider  = "postgresql"
#     url       = env("DATABASE_URL")
#     directUrl = env("DIRECT_URL")
#   }
#
# STEP 4: Push schema to Supabase
# ─────────────────────────────────────
#   cd ~/Projects/xcloak
#   npx prisma db push
#
#   You should see:
#     ✓ Your database is now in sync with your Prisma schema.
#
# STEP 5: Verify in Supabase Studio
# ─────────────────────────────────────
#   1. Go to: https://supabase.com/dashboard/project/pusmulkyvompodxfbkvm/editor
#   2. You should see all tables: Session, Exploit, CVEEntry, NewsArticle, etc.
#   3. You can browse/edit data visually here — that's why Supabase is great for management.
#
# STEP 6: (Optional) Seed with demo data
# ─────────────────────────────────────
#   npx tsx prisma/seed.ts
#
# STEP 7: Run the app
# ─────────────────────────────────────
#   npm run dev
#   # Open http://localhost:3000
#
# MANAGEMENT:
#   - Visual DB editor: Supabase Studio (web dashboard)
#   - Local DB viewer: npx prisma studio  (opens at localhost:5555)
#   - SQL console: Supabase Dashboard → SQL Editor


# ┌─────────────────────────────────────────────────────────────┐
# │  OPTION 2: NEON (alternative to Supabase)                   │
# └─────────────────────────────────────────────────────────────┘
#
# Your Node v18 can't run neonctl v2.22 (needs Node ≥22).
# BUT YOU DON'T NEED THE CLI. Just use the web dashboard.
#
# STEP 1: Create a Neon project
# ─────────────────────────────────────
#   1. Go to: https://neon.tech
#   2. Sign up / log in
#   3. Click "New Project"
#   4. Name: "xcloak"
#   5. Region: Asia Pacific (Mumbai) — closest to you
#   6. Click "Create Project"
#
# STEP 2: Get connection string
# ─────────────────────────────────────
#   1. After creation, you'll see the connection string immediately
#   2. Select "Prisma" from the dropdown
#   3. Copy both the pooled and direct URLs
#   4. They look like:
#
#      postgresql://xcloak_owner:password@ep-xxx-yyy-123.ap-south-1.aws.neon.tech/xcloak?sslmode=require
#
# STEP 3: Same as Supabase steps 2-7 above
#
# NOTE: If you still want to use neonctl, upgrade Node first:
#   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
#   sudo apt-get install -y nodejs
#   # OR use nvm:
#   nvm install 22
#   nvm use 22


# ┌─────────────────────────────────────────────────────────────┐
# │  OPTION 3: LOCAL POSTGRESQL (for offline development)       │
# └─────────────────────────────────────────────────────────────┘
#
# STEP 1: Install PostgreSQL
# ─────────────────────────────────────
#   # Ubuntu/Debian:
#   sudo apt update
#   sudo apt install postgresql postgresql-contrib
#
#   # macOS:
#   brew install postgresql@16
#   brew services start postgresql@16
#
#   # Or use Docker:
#   docker run -d --name xcloak-db \
#     -e POSTGRES_DB=xcloak \
#     -e POSTGRES_USER=xcloak \
#     -e POSTGRES_PASSWORD=xcloak_secret \
#     -p 5432:5432 \
#     postgres:16-alpine
#
# STEP 2: Create database
# ─────────────────────────────────────
#   sudo -u postgres psql
#   CREATE DATABASE xcloak;
#   CREATE USER xcloak WITH ENCRYPTED PASSWORD 'xcloak_secret';
#   GRANT ALL PRIVILEGES ON DATABASE xcloak TO xcloak;
#   \q
#
# STEP 3: Set .env
# ─────────────────────────────────────
#   DATABASE_URL="postgresql://xcloak:xcloak_secret@localhost:5432/xcloak"
#   DIRECT_URL="postgresql://xcloak:xcloak_secret@localhost:5432/xcloak"
#
# STEP 4: Push + run (same as above)
#   npx prisma db push
#   npm run dev


# ┌─────────────────────────────────────────────────────────────┐
# │  REDIS SETUP (optional — for production rate limiting)      │
# └─────────────────────────────────────────────────────────────┘
#
# For development, Xcloak uses in-memory rate limiting (no Redis needed).
# For production with multiple server instances, add Redis.
#
# ── OPTION A: Upstash (recommended — free, serverless, no maintenance) ──
#
#   1. Go to: https://upstash.com
#   2. Sign up → Create Database
#   3. Name: "xcloak-cache"
#   4. Region: AP-South-1 (Mumbai)
#   5. Copy the connection string:
#      REDIS_URL="rediss://default:xxxxx@apn1-xxxxx.upstash.io:6379"
#   6. Add to .env:
#      REDIS_URL="rediss://default:xxxxx@apn1-xxxxx.upstash.io:6379"
#
# ── OPTION B: Local Redis (for development) ──
#
#   # Ubuntu:
#   sudo apt install redis-server
#   sudo systemctl start redis
#
#   # macOS:
#   brew install redis
#   brew services start redis
#
#   # Docker:
#   docker run -d --name xcloak-redis -p 6379:6379 redis:7-alpine
#
#   # .env:
#   REDIS_URL="redis://localhost:6379"
#
# ── OPTION C: Docker Compose (PostgreSQL + Redis together) ──
#
#   Just run from the project root:
#   docker-compose up -d
#
#   This starts both PostgreSQL and Redis.
#   Connection strings are pre-configured in docker-compose.yml.


# ┌─────────────────────────────────────────────────────────────┐
# │  QUICK START (FASTEST PATH — using your existing Supabase)  │
# └─────────────────────────────────────────────────────────────┘
#
#   cd ~/Projects/xcloak
#
#   # 1. Create .env
#   cat > .env << 'EOF'
#   DATABASE_URL="postgresql://postgres.pusmulkyvompodxfbkvm:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
#   DIRECT_URL="postgresql://postgres.pusmulkyvompodxfbkvm:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
#   NODE_ENV="development"
#   NEXT_PUBLIC_APP_URL="http://localhost:3000"
#   EOF
#
#   # 2. Replace [YOUR-PASSWORD] with your actual Supabase password
#   nano .env
#
#   # 3. Install deps (if not done)
#   npm install
#
#   # 4. Push database schema
#   npx prisma db push
#
#   # 5. (Optional) View your DB
#   npx prisma studio
#
#   # 6. Run the app
#   npm run dev
#
#   Done! Open http://localhost:3000

