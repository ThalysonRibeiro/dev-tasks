-- Prisma Migration Configuration
-- This file helps with migration timeout issues

-- Set longer timeout for advisory locks
SET lock_timeout = '30s';

-- Set longer statement timeout
SET statement_timeout = '60s';

-- Ensure we're not in a transaction that could cause issues
COMMIT;
