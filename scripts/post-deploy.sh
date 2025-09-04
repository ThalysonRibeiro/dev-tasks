#!/bin/bash

# Post-deploy script for Vercel
# This script runs after the build is complete

echo "Running post-deploy migrations..."

# Wait a bit for the database to be ready
sleep 5

# Run migrations with retry logic
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((RETRY_COUNT + 1)) of $MAX_RETRIES"
  
  if npx prisma migrate deploy; then
    echo "Migrations completed successfully!"
    exit 0
  else
    echo "Migration failed, retrying..."
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 10
  fi
done

echo "Failed to run migrations after $MAX_RETRIES attempts"
exit 1
