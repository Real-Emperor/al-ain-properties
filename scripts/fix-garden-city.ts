// Fix the existing news article in the Neon DB to remove "Garden City" reference
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_F9DtsS2zfPuh@ep-rapid-wildflower-abyotmnd.eu-west-2.aws.neon.tech/neondb?sslmode=require&schema=alain' } },
  log: ['error'],
})

async function main() {
  console.log('Updating news articles to remove "Garden City" references...')

  const allArticles = await prisma.newsArticle.findMany()
  let fixed = 0
  for (const a of allArticles) {
    const hasGardenCity =
      a.contentEn.includes('Garden City') ||
      a.contentAr.includes('مدينة الحدائق') ||
      a.titleEn.includes('Garden City') ||
      a.titleAr.includes('مدينة الحدائق') ||
      (a.excerptEn || '').includes('Garden City') ||
      (a.excerptAr || '').includes('مدينة الحدائق')

    if (hasGardenCity) {
      await prisma.newsArticle.update({
        where: { id: a.id },
        data: {
          contentEn: a.contentEn.replace(/The Garden City/g, 'Al Ain').replace(/Garden City/g, 'Al Ain'),
          contentAr: a.contentAr.replace(/مدينة الحدائق/g, 'العين'),
          titleEn: a.titleEn.replace(/Garden City/g, 'Al Ain'),
          titleAr: a.titleAr.replace(/مدينة الحدائق/g, 'العين'),
          excerptEn: (a.excerptEn || '').replace(/Garden City/g, 'Al Ain'),
          excerptAr: (a.excerptAr || '').replace(/مدينة الحدائق/g, 'العين'),
        }
      })
      console.log(`  ✓ Fixed: ${a.slug}`)
      fixed++
    }
  }
  console.log(`\n✓ Total fixed: ${fixed} articles`)
}

main().finally(async () => { await prisma.$disconnect() })
