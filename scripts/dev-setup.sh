#!/bin/bash

# Dev Tasks - Development Setup Script
echo "🚀 Setting up development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start databases
echo "📦 Starting databases with Docker Compose..."
docker-compose up -d

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations for development database
echo "🗄️ Running database migrations..."
npm run db:test:migrate

# Create .env.test if it doesn't exist
if [ ! -f .env.test ]; then
    echo "📝 Creating .env.test file..."
    cat > .env.test << EOF
# Test Environment Variables
DATABASE_URL="postgresql://myuser:mypassword@localhost:5435/mydb_test"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-key-change-in-production"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT=1025
EMAIL_FROM="test@example.com"
NODE_ENV="test"
EOF
    echo "✅ Created .env.test file"
fi

echo "✅ Development environment setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run dev:test     - Start development server with test env"
echo "  npm run test:unit    - Run unit tests"
echo "  npm run test:e2e     - Run E2E tests"
echo "  npm run test:all     - Run all tests"
echo ""
echo "🗄️ Database URLs:"
echo "  Development: postgresql://myuser:mypassword@localhost:5434/mydb"
echo "  Test:        postgresql://myuser:mypassword@localhost:5435/mydb_test"
