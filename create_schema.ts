import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_F9DtsS2zfPuh@ep-rapid-wildflower-abyotmnd.eu-west-2.aws.neon.tech/neondb?sslmode=require&schema=alain' } },
  log: ['error'],
})
async function main() {
  // Create the schema if not exists
  await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS alain')
  console.log('✓ Schema "alain" created/verified')
}
main().finally(async () => { await prisma.$disconnect() })
