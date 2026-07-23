// Rotate admin credentials in the Neon DB
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_F9DtsS2zfPuh@ep-rapid-wildflower-abyotmnd.eu-west-2.aws.neon.tech/neondb?sslmode=require&schema=alain' } },
  log: ['error'],
})

async function main() {
  const NEW_EMAIL = 'manager.mosa@alainproperties.ae'
  const NEW_PASSWORD = 'AlAin@Prop_2026!Secure'
  const NEW_HASH = bcrypt.hashSync(NEW_PASSWORD, 12)

  console.log('Rotating admin credentials...')
  console.log(`  Old email: admin@alainproperties.com`)
  console.log(`  New email: ${NEW_EMAIL}`)
  console.log(`  New password: ${NEW_PASSWORD}`)

  // Find the existing admin user
  const existing = await prisma.adminUser.findUnique({ where: { email: 'admin@alainproperties.com' } })
  if (!existing) {
    console.log('❌ Existing admin user not found — creating new one')
    await prisma.adminUser.create({
      data: {
        email: NEW_EMAIL,
        passwordHash: NEW_HASH,
        name: 'Mohammad Mosa Ali',
        phone: '+971542311225',
      }
    })
  } else {
    // Delete the old admin user and create a new one with new email
    // (We can't simply update email because email is @unique and we want a different value)
    await prisma.adminUser.delete({ where: { id: existing.id } })
    await prisma.adminUser.create({
      data: {
        email: NEW_EMAIL,
        passwordHash: NEW_HASH,
        name: 'Mohammad Mosa Ali',
        phone: '+971542311225',
      }
    })
    console.log('✓ Old admin user deleted, new admin user created')
  }

  // Verify
  const verify = await prisma.adminUser.findUnique({ where: { email: NEW_EMAIL } })
  if (verify) {
    const match = bcrypt.compareSync(NEW_PASSWORD, verify.passwordHash)
    console.log(`✓ Verification: ${match ? 'PASSWORD MATCHES' : 'PASSWORD MISMATCH'}`)
    console.log(`✓ New admin user:`)
    console.log(`    id: ${verify.id}`)
    console.log(`    email: ${verify.email}`)
    console.log(`    name: ${verify.name}`)
    console.log(`    phone: ${verify.phone}`)
  }
}

main().finally(async () => { await prisma.$disconnect() })
