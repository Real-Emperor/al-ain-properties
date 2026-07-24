// Maintenance script: create/verify schema
// Uses DATABASE_URL from .env (no hardcoded connection string)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database schema...')
  // Add your schema verification/migration logic here
  const result = await prisma.$queryRaw`SELECT current_database(), current_schema()`
  console.log('Connected to:', result)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
