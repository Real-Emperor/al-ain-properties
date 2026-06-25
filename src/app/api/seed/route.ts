import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

// POST /api/seed — seed initial demo data (properties, news, admin user)
// Idempotent: safe to call multiple times
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const adminEmail = body.adminEmail || "manager.mosa@alainproperties.ae"
    const adminPassword = body.adminPassword || "AlAin@Prop_2026!Secure"

    const results = {
      adminUser: false,
      properties: 0,
      news: 0,
    }

    // 1. Create admin user if not exists
    const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } })
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12)
      await db.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash,
          name: "Mohammad Mosaa Ali",
          phone: "+971542311225",
        },
      })
      results.adminUser = true
    }

    // 2. Seed properties if none exist
    const existingProps = await db.property.count()
    if (existingProps === 0) {
      const properties = SEED_PROPERTIES
      for (const p of properties) {
        await db.property.create({ data: p })
      }
      results.properties = properties.length
    }

    // 3. Seed news if none exist
    const existingNews = await db.newsArticle.count()
    if (existingNews === 0) {
      for (const n of SEED_NEWS) {
        await db.newsArticle.create({ data: n })
      }
      results.news = SEED_NEWS.length
    }

    return NextResponse.json({
      success: true,
      message: "Seed completed",
      results,
    })
  } catch (error) {
    console.error("POST /api/seed error:", error)
    return NextResponse.json({ error: "Failed to seed data", details: String(error) }, { status: 500 })
  }
}

// ─── Sample properties ───
const PHOTO_POOL = {
  villa: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd311?w=1200&q=80",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  ],
  shop: [
    "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  ],
  farm: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
  ],
  land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200&q=80",
  ],
}

function pickPhotos(type: string, count: number = 3): string {
  const pool = (PHOTO_POOL as any)[type] || PHOTO_POOL.villa
  const selected: string[] = []
  for (let i = 0; i < count && i < pool.length; i++) {
    selected.push(pool[i])
  }
  return JSON.stringify(selected)
}

const SEED_PROPERTIES = [
  // ─── Villas for Rent ───
  {
    slug: "luxury-5bed-villa-al-jimi-maid-room",
    titleEn: "Luxury 5-Bedroom Villa with Maid Room in Al Jimi",
    titleAr: "فيلا فاخرة 5 غرف نوم مع غرفة خادمة في الجيمي",
    descriptionEn: "Spacious family villa in the heart of Al Jimi, featuring 5 large bedrooms, dedicated maid room, private garden, covered parking for 2 cars, and modern kitchen. Walking distance to Al Jimi Mall and major schools. Premium finishes throughout with marble flooring and elegant fixtures.",
    descriptionAr: "فيلا عائلية واسعة في قلب الجيمي، تضم 5 غرف نوم كبيرة، غرفة خادمة مخصصة، حديقة خاصة، موقف سيارات مغطى لسيارتين، ومطبخ عصري. على بعد دقائق سيراً من مول الجيمي والمدارس الرئيسية. تشطيبات راقية بأرضيات رخامية وتجهيزات أنيقة.",
    type: "villa", listingType: "rent", area: "al-jimi",
    addressEn: "Street 14, Al Jimi, Al Ain",
    addressAr: "الشارع 14، الجيمي، العين",
    latitude: 24.2275, longitude: 55.7447,
    price: 165000, bedrooms: 5, bathrooms: 6, sizeSqft: 5200,
    furnished: false, photos: pickPhotos("villa", 4),
    features: JSON.stringify(["Maid Room", "Private Garden", "Covered Parking (2)", "Modern Kitchen", "Marble Flooring", "Central AC", "Majlis"]),
    status: "active", featured: true,
  },
  {
    slug: "modern-4bed-villa-al-towayya-pool",
    titleEn: "Modern 4-Bedroom Villa with Private Pool in Al Towayya",
    titleAr: "فيلا عصرية 4 غرف نوم مع مسبح خاص في الطوية",
    descriptionEn: "Contemporary villa with stunning architecture in Al Towayya. Features 4 en-suite bedrooms, private swimming pool, landscaped garden, open-plan living area, and a rooftop terrace with panoramic views of Al Ain. Close to Al Towayya Park and major amenities.",
    descriptionAr: "فيلا عصرية بتصميم معماري مذهل في الطوية. تضم 4 غرف نوم مع حمامات خاصة، مسبح خاص، حديقة منسقة، منطقة معيشة مفتوحة، وتراس على السطح بإطلالة بانورامية على العين. قريبة من حديقة الطوية والمرافق الرئيسية.",
    type: "villa", listingType: "rent", area: "al-towayya",
    addressEn: "Street 9, Al Towayya, Al Ain",
    addressAr: "الشارع 9، الطوية، العين",
    latitude: 24.2175, longitude: 55.7547,
    price: 195000, bedrooms: 4, bathrooms: 5, sizeSqft: 4500,
    furnished: true, photos: pickPhotos("villa", 4),
    features: JSON.stringify(["Private Pool", "Landscaped Garden", "Rooftop Terrace", "Open-Plan Living", "En-Suite Bedrooms", "Smart Home System", "Solar Panels"]),
    status: "active", featured: true,
  },
  {
    slug: "spacious-6bed-villa-falaj-hazza-family",
    titleEn: "Spacious 6-Bedroom Family Villa in Falaj Hazza",
    titleAr: "فيلا عائلية واسعة 6 غرف نوم في فلج هزاع",
    descriptionEn: "Perfect for large families, this 6-bedroom villa in Falaj Hazza offers generous living spaces, separate majlis, large kitchen, and a big backyard. Located in a quiet, family-friendly neighborhood close to UAE University.",
    descriptionAr: "مثالية للعائلات الكبيرة، هذه الفيلا بـ 6 غرف نوم في فلج هزاع تقدم مساحات معيشة واسعة، مجلس منفصل، مطبخ كبير، وفناء خلفي كبير. تقع في حي هادئ وعائلي قريب من جامعة الإمارات.",
    type: "villa", listingType: "rent", area: "falaj-hazza",
    addressEn: "Near UAE University, Falaj Hazza, Al Ain",
    addressAr: "بالقرب من جامعة الإمارات، فلج هزاع، العين",
    latitude: 24.1875, longitude: 55.7647,
    price: 180000, bedrooms: 6, bathrooms: 7, sizeSqft: 6800,
    furnished: false, photos: pickPhotos("villa", 3),
    features: JSON.stringify(["Separate Majlis", "Large Backyard", "Covered Parking (3)", "Storage Room", "Central AC", "Near University"]),
    status: "active", featured: false,
  },
  {
    slug: "elegant-3bed-villa-zakher-garden",
    titleEn: "Elegant 3-Bedroom Villa with Garden in Zakher",
    titleAr: "فيلا أنيقة 3 غرف نوم مع حديقة في زاخر",
    descriptionEn: "Charming 3-bedroom villa in Zakher with a beautiful garden, modern kitchen, and open-plan living. Perfect for small families or expats. Close to Zakher Lake and Al Ain Mall.",
    descriptionAr: "فيلا ساحرة بـ 3 غرف نوم في زاخر مع حديقة جميلة، مطبخ عصري، ومنطقة معيشة مفتوحة. مثالية للعائلات الصغيرة أو المغتربين. قريبة من بحيرة زاخر ومول العين.",
    type: "villa", listingType: "rent", area: "zakher",
    addressEn: "Street 22, Zakher, Al Ain",
    addressAr: "الشارع 22، زاخر، العين",
    latitude: 24.1675, longitude: 55.7747,
    price: 125000, bedrooms: 3, bathrooms: 4, sizeSqft: 3200,
    furnished: true, photos: pickPhotos("villa", 3),
    features: JSON.stringify(["Garden", "Modern Kitchen", "Open-Plan Living", "Covered Parking", "Furnished", "Near Mall"]),
    status: "active", featured: false,
  },

  // ─── Villas for Sale ───
  {
    slug: "luxury-7bed-mansion-al-hili-pool",
    titleEn: "Luxury 7-Bedroom Mansion with Pool in Al Hili",
    titleAr: "قصر فاخر 7 غرف نوم مع مسبح في الهيلي",
    descriptionEn: "An exceptional mansion in the prestigious Al Hili area. This property boasts 7 bedrooms, grand entrance hall, private pool, landscaped gardens, home cinema, gym, and 4-car garage. A rare opportunity to own a trophy property in Al Ain.",
    descriptionAr: "قصر استثنائي في منطقة الهيلي الراقية. يضم هذا العقار 7 غرف نوم، قاعة دخول كبرى، مسبح خاص، حدائق منسقة، سينما منزلية، صالة رياضية، وكراج لـ 4 سيارات. فرصة نادرة لامتلاك عقار مميز في العين.",
    type: "villa", listingType: "sale", area: "al-hili",
    addressEn: "Street 1, Al Hili, Al Ain",
    addressAr: "الشارع 1، الهيلي، العين",
    latitude: 24.2875, longitude: 55.7847,
    price: 8500000, bedrooms: 7, bathrooms: 9, sizeSqft: 12000,
    furnished: false, photos: pickPhotos("villa", 4),
    features: JSON.stringify(["Private Pool", "Home Cinema", "Gym", "4-Car Garage", "Grand Entrance", "Landscaped Gardens", "Majlis", "Maid Room", "Driver Room"]),
    status: "active", featured: true,
  },
  {
    slug: "5bed-villa-sale-al-mutaredh-modern",
    titleEn: "5-Bedroom Modern Villa for Sale in Al Mutaredh",
    titleAr: "فيلا عصرية 5 غرف نوم للبيع في المترع",
    descriptionEn: "Brand new modern villa in Al Mutaredh with contemporary architecture, 5 spacious bedrooms, open-concept kitchen, rooftop terrace, and high-end finishes throughout. Excellent investment opportunity in a developing area.",
    descriptionAr: "فيلا عصرية جديدة بالكامل في المترع بتصميم معاصر، 5 غرف نوم واسعة، مطبخ مفتوح، تراس على السطح، وتشطيبات راقية في جميع أنحاء العقار. فرصة استثمارية ممتازة في منطقة نامية.",
    type: "villa", listingType: "sale", area: "al-mutaredh",
    addressEn: "Street 5, Al Mutaredh, Al Ain",
    addressAr: "الشارع 5، المترع، العين",
    latitude: 24.2375, longitude: 55.7347,
    price: 4200000, bedrooms: 5, bathrooms: 6, sizeSqft: 5500,
    furnished: false, photos: pickPhotos("villa", 3),
    features: JSON.stringify(["Brand New", "Modern Architecture", "Rooftop Terrace", "Open Kitchen", "High-End Finishes", "Smart Home Ready"]),
    status: "active", featured: false,
  },

  // ─── Apartments for Rent ───
  {
    slug: "2bed-apartment-al-jimi-furnished",
    titleEn: "Furnished 2-Bedroom Apartment in Al Jimi",
    titleAr: "شقة مفروشة بغرفتي نوم في الجيمي",
    descriptionEn: "Fully furnished 2-bedroom apartment in a prime Al Jimi location. Features modern furniture, built-in wardrobes, balcony with city view, and access to building gym and pool. Walking distance to Al Jimi Mall.",
    descriptionAr: "شقة مفروشة بالكامل بغرفتي نوم في موقع مميز بالجيمي. تتميز بأثاث عصري، خزائن مدمجة، شرفة بإطلالة على المدينة، وإمكانية الوصول إلى صالة رياضية ومسبح المبنى. على بعد دقائق سيراً من مول الجيمي.",
    type: "apartment", listingType: "rent", area: "al-jimi",
    addressEn: "Tower B, Al Jimi, Al Ain",
    addressAr: "برج B، الجيمي، العين",
    latitude: 24.2275, longitude: 55.7447,
    price: 68000, bedrooms: 2, bathrooms: 2, sizeSqft: 1150,
    furnished: true, photos: pickPhotos("apartment", 3),
    features: JSON.stringify(["Fully Furnished", "Balcony", "Building Gym", "Building Pool", "Covered Parking", "24/7 Security", "Near Mall"]),
    status: "active", featured: true,
  },
  {
    slug: "studio-apartment-al-maqam-affordable",
    titleEn: "Affordable Studio Apartment in Al Maqam",
    titleAr: "شقة استوديو بأسعار مناسبة في المقام",
    descriptionEn: "Compact and affordable studio apartment in Al Maqam, ideal for single professionals. Includes kitchenette, bathroom, and balcony. Close to public transport and local amenities.",
    descriptionAr: "شقة استوديو مدمجة وبأسعار مناسبة في المقام، مثالية للمحترفين العزاب. تشمل مطبخ صغير، حمام، وشرفة. قريبة من النقل العام والمرافق المحلية.",
    type: "apartment", listingType: "rent", area: "al-maqam",
    addressEn: "Building 12, Al Maqam, Al Ain",
    addressAr: "المبنى 12، المقام، العين",
    latitude: 24.1975, longitude: 55.7247,
    price: 32000, bedrooms: 0, bathrooms: 1, sizeSqft: 450,
    furnished: false, photos: pickPhotos("apartment", 2),
    features: JSON.stringify(["Kitchenette", "Balcony", "Covered Parking", "Affordable", "Near Transport"]),
    status: "active", featured: false,
  },
  {
    slug: "3bed-apartment-hili-family-friendly",
    titleEn: "Family-Friendly 3-Bedroom Apartment in Al Hili",
    titleAr: "شقة عائلية 3 غرف نوم في الهيلي",
    descriptionEn: "Spacious 3-bedroom apartment in a family-oriented building in Al Hili. Features large living room, separate dining area, two balconies, and access to building amenities including pool and playground.",
    descriptionAr: "شقة واسعة بـ 3 غرف نوم في مبنى عائلي في الهيلي. تتميز بغرفة معيشة كبيرة، منطقة طعام منفصلة، شرفتان، وإمكانية الوصول إلى مرافق المبنى بما في ذلك المسبح وملعب الأطفال.",
    type: "apartment", listingType: "rent", area: "al-hili",
    addressEn: "Tower C, Al Hili, Al Ain",
    addressAr: "برج C، الهيلي، العين",
    latitude: 24.2875, longitude: 55.7847,
    price: 95000, bedrooms: 3, bathrooms: 3, sizeSqft: 1650,
    furnished: false, photos: pickPhotos("apartment", 3),
    features: JSON.stringify(["Two Balconies", "Separate Dining", "Building Pool", "Playground", "Family Building", "Covered Parking (2)"]),
    status: "active", featured: false,
  },
  {
    slug: "1bed-apartment-zakher-modern",
    titleEn: "Modern 1-Bedroom Apartment in Zakher",
    titleAr: "شقة عصرية بغرفة نوم واحدة في زاخر",
    descriptionEn: "Stylish 1-bedroom apartment in a new Zakher development. Open-plan kitchen, modern bathroom, and balcony with community view. Perfect for young professionals.",
    descriptionAr: "شقة أنيقة بغرفة نوم واحدة في تطوير زاخر الجديد. مطبخ مفتوح، حمام عصري، وشرفة بإطلالة على المجتمع. مثالية للمحترفين الشباب.",
    type: "apartment", listingType: "rent", area: "zakher",
    addressEn: "Building 7, Zakher, Al Ain",
    addressAr: "المبنى 7، زاخر، العين",
    latitude: 24.1675, longitude: 55.7747,
    price: 45000, bedrooms: 1, bathrooms: 1, sizeSqft: 750,
    furnished: false, photos: pickPhotos("apartment", 2),
    features: JSON.stringify(["Open Kitchen", "Balcony", "Modern Bathroom", "New Building", "Covered Parking"]),
    status: "active", featured: false,
  },

  // ─── Apartments for Sale ───
  {
    slug: "2bed-apartment-sale-al-foah-investment",
    titleEn: "2-Bedroom Apartment for Sale in Al Foah — Investment Opportunity",
    titleAr: "شقة بغرفتي نوم للبيع في الفوعة — فرصة استثمارية",
    descriptionEn: "Excellent investment apartment in Al Foah. Currently tenanted, generating steady rental income. 2 bedrooms, 2 bathrooms, balcony, and dedicated parking. Strong rental demand in the area.",
    descriptionAr: "شقة استثمارية ممتازة في الفوعة. مؤجرة حالياً وتولد دخلاً إيجارياً ثابتاً. غرفتا نوم، حمامان، شرفة، وموقف سيارات مخصص. طلب إيجاري قوي في المنطقة.",
    type: "apartment", listingType: "sale", area: "al-foah",
    addressEn: "Building 3, Al Foah, Al Ain",
    addressAr: "المبنى 3، الفوعة، العين",
    latitude: 24.2575, longitude: 55.7147,
    price: 850000, bedrooms: 2, bathrooms: 2, sizeSqft: 1100,
    furnished: false, photos: pickPhotos("apartment", 3),
    features: JSON.stringify(["Tenanted", "Investment Property", "Balcony", "Dedicated Parking", "Strong ROI"]),
    status: "active", featured: false,
  },

  // ─── Shops ───
  {
    slug: "commercial-shop-al-jimi-mall-area",
    titleEn: "Commercial Shop Near Al Jimi Mall",
    titleAr: "محل تجاري بالقرب من مول الجيمي",
    descriptionEn: "High-visibility commercial shop on a busy street near Al Jimi Mall. Ground floor, large display windows, storage room, and dedicated parking. Ideal for retail, F&B, or services.",
    descriptionAr: "محل تجاري عالي الرؤية في شارع مزدحم بالقرب من مول الجيمي. الطابق الأرضي، نوافذ عرض كبيرة، غرفة تخزين، وموقف سيارات مخصص. مثالي للتجزئة أو المطاعم أو الخدمات.",
    type: "shop", listingType: "rent", area: "al-jimi",
    addressEn: "Main Road, Near Al Jimi Mall, Al Ain",
    addressAr: "الطريق الرئيسي، بالقرب من مول الجيمي، العين",
    latitude: 24.2275, longitude: 55.7447,
    price: 120000, bedrooms: 0, bathrooms: 1, sizeSqft: 1200,
    furnished: false, photos: pickPhotos("shop", 2),
    features: JSON.stringify(["Ground Floor", "Large Display Windows", "Storage Room", "Dedicated Parking", "High Foot Traffic", "Main Road Frontage"]),
    status: "active", featured: true,
  },
  {
    slug: "retail-shop-city-center",
    titleEn: "Retail Shop in Al Ain City Center",
    titleAr: "محل تجزئة في وسط مدينة العين",
    descriptionEn: "Prime retail space in Al Ain City Center. Excellent location with high pedestrian traffic. Suitable for boutique, pharmacy, or specialty store. Modern fittings and 24/7 AC.",
    descriptionAr: "مساحة تجزئة مميزة في وسط مدينة العين. موقع ممتاز بحركة المشاة العالية. مناسبة للبوتيك أو الصيدلية أو المتجر المتخصص. تجهيزات عصرية وتكييف على مدار الساعة.",
    type: "shop", listingType: "rent", area: "al-towayya",
    addressEn: "City Center, Al Towayya, Al Ain",
    addressAr: "وسط المدينة، الطوية، العين",
    latitude: 24.2175, longitude: 55.7547,
    price: 95000, bedrooms: 0, bathrooms: 1, sizeSqft: 850,
    furnished: false, photos: pickPhotos("shop", 2),
    features: JSON.stringify(["Prime Location", "High Pedestrian Traffic", "Modern Fittings", "24/7 AC", "Glass Frontage"]),
    status: "active", featured: false,
  },

  // ─── Offices ───
  {
    slug: "executive-office-al-mutaredh-fitted",
    titleEn: "Fitted Executive Office in Al Mutaredh",
    titleAr: "مكتب تنفيذي مجهز في المترع",
    descriptionEn: "Ready-to-move-in executive office space in Al Mutaredh. Comes fully fitted with partitions, meeting room, pantry, and workstations for 12 people. Includes 4 parking spots.",
    descriptionAr: "مكتب تنفيذي جاهز للانتقال في المترع. مجهز بالكامل بمكاتب partitions، غرفة اجتماعات، مطبخ، ومحطات عمل لـ 12 شخصاً. يشمل 4 مواقف سيارات.",
    type: "office", listingType: "rent", area: "al-mutaredh",
    addressEn: "Office Tower, Al Mutaredh, Al Ain",
    addressAr: "برج المكاتب، المترع، العين",
    latitude: 24.2375, longitude: 55.7347,
    price: 145000, bedrooms: 0, bathrooms: 2, sizeSqft: 1800,
    furnished: true, photos: pickPhotos("office", 3),
    features: JSON.stringify(["Fully Fitted", "Meeting Room", "Pantry", "12 Workstations", "4 Parking Spots", "24/7 Access", "Backup Power"]),
    status: "active", featured: false,
  },
  {
    slug: "open-plan-office-al-yahar-growing-area",
    titleEn: "Open-Plan Office Space in Al Yahar",
    titleAr: "مساحة مكتب مفتوحة في اليحر",
    descriptionEn: "Spacious open-plan office in the growing Al Yahar area. Blank canvas ready for your fit-out. Ideal for startups, agencies, or corporate back-offices. Competitive rate for the area.",
    descriptionAr: "مكتب واسع مفتوح في منطقة اليحر النامية. لوحة فارغة جاهزة للتجهيز. مثالي للشركات الناشئة أو الوكالات أو المكاتب الخلفية للشركات. سعر تنافسي للمنطقة.",
    type: "office", listingType: "rent", area: "al-yahar",
    addressEn: "Commercial Block, Al Yahar, Al Ain",
    addressAr: "الكتلة التجارية، اليحر، العين",
    latitude: 24.2675, longitude: 55.8047,
    price: 88000, bedrooms: 0, bathrooms: 2, sizeSqft: 2200,
    furnished: false, photos: pickPhotos("office", 2),
    features: JSON.stringify(["Open Plan", "Ready for Fit-Out", "2 Parking Spots", "Competitive Rate", "Growing Area"]),
    status: "active", featured: false,
  },

  // ─── Warehouses ───
  {
    slug: "warehouse-5000sqft-al-towayya-industrial",
    titleEn: "5,000 sqft Warehouse in Al Towayya Industrial Area",
    titleAr: "مستودع 5000 قدم مربع في المنطقة الصناعية الطوية",
    descriptionEn: "Industrial warehouse with 5,000 sqft of storage space, 6m ceiling height, loading dock, and 3-phase power. Suitable for logistics, manufacturing, or distribution. Gated compound with 24/7 security.",
    descriptionAr: "مستودع صناعي بمساحة تخزين 5000 قدم مربع، ارتفاع سقف 6 أمتار، رصيف تحميل، وكهرباء ثلاثية الطور. مناسب للخدمات اللوجستية أو التصنيع أو التوزيع. مجمع مسور بأمن على مدار الساعة.",
    type: "warehouse", listingType: "rent", area: "al-towayya",
    addressEn: "Industrial Area, Al Towayya, Al Ain",
    addressAr: "المنطقة الصناعية، الطوية، العين",
    latitude: 24.2175, longitude: 55.7547,
    price: 220000, bedrooms: 0, bathrooms: 2, sizeSqft: 5000,
    furnished: false, photos: pickPhotos("warehouse", 2),
    features: JSON.stringify(["6m Ceiling Height", "Loading Dock", "3-Phase Power", "Gated Compound", "24/7 Security", "Truck Access"]),
    status: "active", featured: false,
  },
  {
    slug: "warehouse-8000sqft-al-yahar-logistics",
    titleEn: "8,000 sqft Logistics Warehouse in Al Yahar",
    titleAr: "مستودع لوجستي 8000 قدم مربع في اليحر",
    descriptionEn: "Large logistics warehouse with 8,000 sqft, perfect for distribution companies. Features roller shutter door, office space included, cold storage option, and easy truck access to Dubai/Abu Dhabi highways.",
    descriptionAr: "مستودع لوجستي كبير بمساحة 8000 قدم مربع، مثالي لشركات التوزيع. يضم باباً معدنياً متدحرجاً، مساحة مكتبية مشمولة، خيار تخزين مبرد، ووصول سهل للشاحنات إلى طرق دبي/أبوظبي السريعة.",
    type: "warehouse", listingType: "rent", area: "al-yahar",
    addressEn: "Logistics Zone, Al Yahar, Al Ain",
    addressAr: "منطقة الخدمات اللوجستية، اليحر، العين",
    latitude: 24.2675, longitude: 55.8047,
    price: 320000, bedrooms: 0, bathrooms: 2, sizeSqft: 8000,
    furnished: false, photos: pickPhotos("warehouse", 2),
    features: JSON.stringify(["Roller Shutter Door", "Included Office Space", "Cold Storage Option", "Highway Access", "Truck Parking", "Loading Bay"]),
    status: "active", featured: false,
  },

  // ─── Farms ───
  {
    slug: "date-palm-farm-al-foah-5acres",
    titleEn: "Date Palm Farm — 5 Acres in Al Foah",
    titleAr: "مزرعة نخيل — 5 أفدنة في الفوعة",
    descriptionEn: "Productive date palm farm in the famous Al Foah agricultural area. 5 acres with 200+ mature date palms (Khalas and Fard varieties), irrigation system, worker accommodation, and storage. Excellent investment.",
    descriptionAr: "مزرعة نخيل منتجة في منطقة الفوعة الزراعية الشهيرة. 5 أفدنة مع أكثر من 200 نخلة ناضجة (أصناف خلاص وفرد)، نظام ري، سكن للعمال، وتخزين. استثمار ممتاز.",
    type: "farm", listingType: "sale", area: "al-foah",
    addressEn: "Al Foah Agricultural Area, Al Ain",
    addressAr: "المنطقة الزراعية الفوعة، العين",
    latitude: 24.2575, longitude: 55.7147,
    price: 2800000, bedrooms: 1, bathrooms: 1, sizeSqft: 217800,
    furnished: false, photos: pickPhotos("farm", 3),
    features: JSON.stringify(["200+ Date Palms", "Irrigation System", "Worker Accommodation", "Storage Room", "Khalas & Fard Varieties", "Productive Farm"]),
    status: "active", featured: true,
  },
  {
    slug: "family-farm-falaj-hazza-3acres",
    titleEn: "Family Farm with Villa — 3 Acres in Falaj Hazza",
    titleAr: "مزرعة عائلية مع فيلا — 3 أفدنة في فلج هزاع",
    descriptionEn: "Charming family farm with a 3-bedroom villa, mature trees, vegetable garden, and falaj irrigation. Perfect weekend retreat. 3 acres of greenery in Falaj Hazza.",
    descriptionAr: "مزرعة عائلية ساحرة مع فيلا بـ 3 غرف نوم، أشجار ناضجة، حديقة خضروات، وري فلج. ملاذ مثالي لعطلة نهاية الأسبوع. 3 أفدنة من الخضرة في فلج هزاع.",
    type: "farm", listingType: "sale", area: "falaj-hazza",
    addressEn: "Falaj Hazza, Al Ain",
    addressAr: "فلج هزاع، العين",
    latitude: 24.1875, longitude: 55.7647,
    price: 1950000, bedrooms: 3, bathrooms: 2, sizeSqft: 130680,
    furnished: false, photos: pickPhotos("farm", 3),
    features: JSON.stringify(["3-Bedroom Villa", "Mature Trees", "Vegetable Garden", "Falaj Irrigation", "Weekend Retreat", "Family Farm"]),
    status: "active", featured: false,
  },

  // ─── Land ───
  {
    slug: "residential-land-al-maqam-10000sqft",
    titleEn: "Residential Land — 10,000 sqft in Al Maqam",
    titleAr: "أرض سكنية — 10000 قدم مربع في المقام",
    descriptionEn: "Prime residential land plot in Al Maqam, 10,000 sqft. Ready for construction with all utilities available at the plot. Approved for G+1 residential building. Excellent location near schools and mosques.",
    descriptionAr: "قطعة أرض سكنية مميزة في المقام، 10000 قدم مربع. جاهزة للبناء مع توفر جميع المرافق عند القطعة. معتمدة لمبنى سكني G+1. موقع ممتاز قريب من المدارس والمساجد.",
    type: "land", listingType: "sale", area: "al-maqam",
    addressEn: "Plot 45, Al Maqam, Al Ain",
    addressAr: "القطعة 45، المقام، العين",
    latitude: 24.1975, longitude: 55.7247,
    price: 1200000, bedrooms: 0, bathrooms: 0, sizeSqft: 10000,
    furnished: false, photos: pickPhotos("land", 2),
    features: JSON.stringify(["10,000 sqft", "G+1 Approved", "All Utilities Available", "Near Schools", "Near Mosque", "Ready for Construction"]),
    status: "active", featured: false,
  },
  {
    slug: "commercial-land-al-jimi-corner-plot",
    titleEn: "Commercial Land — Corner Plot in Al Jimi",
    titleAr: "أرض تجارية — قطعة زاوية في الجيمي",
    descriptionEn: "Highly visible corner plot in Al Jimi, perfect for mixed-use development. 15,000 sqft with two road frontages. Approved for G+4 commercial building. Strong investment potential.",
    descriptionAr: "قطعة زاوية عالية الرؤية في الجيمي، مثالية للتطوير متعدد الاستخدامات. 15000 قدم مربع بيواجهتين على الطريق. معتمدة لمبنى تجاري G+4. إمكانات استثمارية قوية.",
    type: "land", listingType: "sale", area: "al-jimi",
    addressEn: "Corner Plot, Street 10, Al Jimi, Al Ain",
    addressAr: "قطعة زاوية، الشارع 10، الجيمي، العين",
    latitude: 24.2275, longitude: 55.7447,
    price: 3500000, bedrooms: 0, bathrooms: 0, sizeSqft: 15000,
    furnished: false, photos: pickPhotos("land", 2),
    features: JSON.stringify(["Corner Plot", "15,000 sqft", "Two Road Frontages", "G+4 Approved", "Mixed-Use Potential", "High Visibility"]),
    status: "active", featured: true,
  },
]

// ─── Sample news articles ───
const SEED_NEWS = [
  {
    slug: "al-ain-property-market-2026-outlook",
    titleEn: "Al Ain Property Market 2026: Strong Growth Expected",
    titleAr: "سوق عقارات العين 2026: نمو قوي متوقع",
    excerptEn: "Experts predict a 8-12% growth in Al Ain's property market in 2026, driven by infrastructure investment and increasing demand from families.",
    excerptAr: "يتوقع الخبراء نمواً بنسبة 8-12% في سوق العقارات في العين عام 2026، مدعوماً بالاستثمار في البنية التحتية والطلب المتزايد من العائلات.",
    contentEn: "Al Ain's property market is poised for strong growth in 2026, according to a new report by leading UAE real estate analysts. Al Ain, often overshadowed by Dubai and Abu Dhabi, is emerging as a preferred destination for families seeking affordable luxury.\n\nKey drivers include the ongoing AED 10 billion infrastructure investment by Al Ain City Municipality, expansion of educational institutions, and the city's growing reputation as a wellness destination. Villa prices in popular areas like Al Jimi and Al Hili have already risen 6% year-on-year, with apartments seeing 4% growth.\n\nExperts recommend that investors consider Al Foah and Al Mutaredh as emerging areas with high growth potential. Rental yields remain attractive at 6-8% for residential properties.",
    contentAr: "يشهد سوق العقارات في العين نمواً قوياً في عام 2026، وفقاً لتقرير جديد من كبار محللي العقارات في الإمارات. العين، التي غالباً ما تطغى عليها دبي وأبوظبي، تبرز كوجهة مفضلة للعائلات التي تبحث عن فاخر بأسعار معقولة.\n\nتشمل المحركات الرئيسية استثمار بلدية مدينة العين المستمر بقيمة 10 مليار درهم في البنية التحتية، وتوسع المؤسسات التعليمية، والسمعة المتنامية للمدينة كوجهة علاجية. ارتفعت أسعار الفلل في مناطق شائعة مثل الجيمي والهيلي بالفعل بنسبة 6% على أساس سنوي، بينما شهدت الشقق نمواً بنسبة 4%.\n\nينصح الخبراء المستثمرين بالنظر إلى الفوعة والمترع كمناطق ناشئة ذات إمكانات نمو عالية. تظل العوائد الإيجارية جذابة بنسبة 6-8% للعقارات السكنية.",
    category: "Al Ain Property News",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "uae-rental-law-updates-2026",
    titleEn: "UAE Rental Law Updates 2026: What Tenants and Landlords Need to Know",
    titleAr: "تحديثات قانون الإيجار الإماراتي 2026: ما يحتاج المستأجرون والملاك معرفته",
    excerptEn: "New rental regulations came into effect in 2026, affecting rent increases, eviction notices, and dispute resolution across the UAE.",
    excerptAr: "دخلت لوائح إيجار جديدة حيز التنفيذ في عام 2026، تؤثر على زيادات الإيجار وإشعارات الإخلاء وحل النزاعات في جميع أنحاء الإمارات.",
    contentEn: "The UAE has introduced several updates to its rental laws in 2026, aiming to create a more balanced relationship between tenants and landlords.\n\nKey changes include:\n\n1. Rent increases are now capped at 5% annually for residential properties\n2. Eviction notices must be given 12 months in advance (up from 6 months)\n3. Security deposits are capped at 2 months' rent for unfurnished, 3 months for furnished\n4. New dispute resolution committee established for faster case processing\n5. Mandatory property condition report at lease signing\n\nFor Al Ain specifically, the new regulations are expected to stabilize the rental market and encourage long-term tenancy. Property owners should review their existing contracts and update them to comply with the new regulations.",
    contentAr: "أدخلت الإمارات عدة تحديثات على قوانين الإيجار في عام 2026، بهدف خلق علاقة أكثر توازناً بين المستأجرين والملاك.\n\nتشمل التغييرات الرئيسية:\n\n1. تحديد زيادات الإيجار بـ 5% سنوياً للعقارات السكنية\n2. يجب إعطاء إشعارات الإخلاء قبل 12 شهراً (بدلاً من 6 أشهر)\n3. تحديد التأمين بـ شهرين للعقارات غير المفروشة، و3 أشهر للمفروشة\n4. إنشاء لجنة جديدة لحل النزاعات لمعالجة أسرع للقضايا\n5. تقرير حالة العقار الإلزامي عند توقيع العقد\n\nبالنسبة للعين تحديداً، من المتوقع أن تستقر اللوائح الجديدة في سوق الإيجار وتشجع الإيجار طويل الأمد. يجب على ملاك العقارات مراجعة عقودهم الحالية وتحديثها لتتوافق مع اللوائح الجديدة.",
    category: "Rental Market Updates",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "al-ain-new-mall-development-al-hili",
    titleEn: "New Mega Mall Announced for Al Hili Area",
    titleAr: "الإعلان عن مول ضخم جديد في منطقة الهيلي",
    excerptEn: "A AED 1.2 billion shopping and entertainment destination is set to open in Al Hili by 2028, expected to boost nearby property values.",
    excerptAr: "وجهة تسوق وترفيه بقيمة 1.2 مليار درهم من المقرر أن تفتتح في الهيلي بحلول 2028، ومن المتوقع أن تعزز قيم العقارات القريبة.",
    contentEn: "Al Ain Municipality has approved plans for a new AED 1.2 billion shopping and entertainment complex in Al Hili, scheduled to open in Q3 2028.\n\nThe development, named \"Hili Gardens Mall\", will feature:\n- 350 retail outlets\n- 60 food and beverage venues\n- 14-screen cinema\n- Indoor theme park\n- 3,000 parking spaces\n- Family entertainment center\n\nReal estate experts predict that properties within a 2km radius of the new mall could see 15-20% value appreciation over the next 3 years. The Al Hili area is already attracting investor interest, with land prices rising 8% since the announcement.\n\nAl Ain Properties has several listings in Al Hili that present excellent investment opportunities ahead of this major development.",
    contentAr: "وافقت بلدية العين على خطط لمجمع تسوق وترفيه جديد بقيمة 1.2 مليار درهم في الهيلي، من المقرر افتتاحه في الربع الثالث من عام 2028.\n\nسيشمل التطوير، الذي يحمل اسم \"مول حدائق الهيلي\":\n- 350 منفذ تجزئة\n- 60 مطعماً ومقهى\n- سينما بـ 14 شاشة\n- مدينة ملاهي داخلية\n- 3000 موقف سيارات\n- مركز ترفيه عائلي\n\nيتوقع خبراء العقارات أن العقارات ضمن نطاق 2 كم من المول الجديد قد تشهد ارتفاعاً في القيمة بنسبة 15-20% على مدى السنوات الثلاث المقبلة. تجذب منطقة الهيلي بالفعل اهتمام المستثمرين، حيث ارتفعت أسعار الأراضي بنسبة 8% منذ الإعلان.\n\nلدى العين العقارية عدة إدراجات في الهيلي تقدم فرصاً استثمارية ممتازة قبل هذا التطوير الكبير.",
    category: "New Property Projects",
    coverImage: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "uae-real-estate-investment-tips-2026",
    titleEn: "Top 7 Real Estate Investment Tips for UAE in 2026",
    titleAr: "أهم 7 نصائح للاستثمار العقاري في الإمارات 2026",
    excerptEn: "From emerging areas to financing strategies, here are the top tips for property investors in the UAE this year.",
    excerptAr: "من المناطق الناشئة إلى استراتيجيات التمويل، إليك أهم النصائح للمستثمرين العقاريين في الإمارات هذا العام.",
    contentEn: "The UAE real estate market continues to offer attractive opportunities for investors in 2026. Here are our top 7 tips:\n\n1. **Look beyond Dubai**: Cities like Al Ain and Sharjah offer better rental yields (6-8%) at lower entry prices.\n\n2. **Consider off-plan properties**: Developers offer attractive payment plans, but always verify the developer's track record.\n\n3. **Focus on family-friendly areas**: Properties near schools, parks, and mosques command premium rents and have lower vacancy rates.\n\n4. **Diversify property types**: Mix residential, commercial, and land investments to spread risk.\n\n5. **Long-term rentals over short-term**: New regulations favor long-term tenancy, providing more stable income.\n\n6. **Inspect before you invest**: Always visit the property, check for structural issues, and review the title deed.\n\n7. **Work with licensed agents**: Only deal with RERA-registered agents to ensure legal protection.\n\nAl Ain Properties offers free investment consultations. Contact us via WhatsApp to schedule yours.",
    contentAr: "يواصل سوق العقارات الإماراتي تقديم فرص جذابة للمستثمرين في عام 2026. إليك أهم 7 نصائح:\n\n1. **انظر إلى ما هو أبعد من دبي**: مدن مثل العين والشارقة تقدم عوائد إيجار أفضل (6-8%) بأسعار دخول أقل.\n\n2. **فكر في العقارات قيد التخطيط**: يقدم المطورون خطط دفع جذابة، لكن تحقق دائماً من سجل المطور.\n\n3. **ركز على المناطق العائلية**: العقارات القريبة من المدارس والحدائق والمساجد تحصل على إيجارات مميزة ومعدلات إشغال أقل.\n\n4. **نوع أنواع العقارات**: امزج بين الاستثمارات السكنية والتجارية والأراضي لتوزيع المخاطر.\n\n5. **الإيجار طويل الأمد أفضل**: اللوائح الجديدة تفضل الإيجار طويل الأمد، مما يوفر دخلاً أكثر استقراراً.\n\n6. **افحص قبل أن تستثمر**: زر العقار دائماً، تحقق من المشاكل الهيكلية، وراجع سند الملكية.\n\n7. **اعمل مع وكلاء مرخصين**: تعامل فقط مع وكلاء مسجلين في ريرا لضمان الحماية القانونية.\n\nتقدم العين العقارية استشارات استثمارية مجانية. تواصل معنا عبر واتساب لجدولة موعدك.",
    category: "Investment News",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "al-ain-2030-vision-infrastructure",
    titleEn: "Al Ain 2030 Vision: AED 50 Billion Infrastructure Plan",
    titleAr: "رؤية العين 2030: خطة بنية تحتية بقيمة 50 مليار درهم",
    excerptEn: "The Abu Dhabi Urban Planning Council has unveiled an ambitious 5-year infrastructure plan for Al Ain, including new roads, schools, and healthcare facilities.",
    excerptAr: "كشف المجلس أبوظبي للتخطيط العمراني عن خطة بنية تحتية طموحة لمدة 5 سنوات للعين، تشمل طرقاً ومدارس ومرافق رعاية صحية جديدة.",
    contentEn: "The Abu Dhabi Urban Planning Council has unveiled Al Ain 2030, an ambitious AED 50 billion infrastructure development plan designed to position Al Ain as the UAE's premier family-friendly city.\n\nKey projects include:\n\n- **New Al Ain Ring Road**: 45km highway reducing city center congestion\n- **5 new schools**: Including 2 international curriculum schools\n- **Al Ain Medical City**: 500-bed specialist hospital\n- **Cultural District**: New museum, library, and performing arts center\n- **Green Corridors**: 25km of shaded walking and cycling paths\n- **Smart City Infrastructure**: City-wide fiber optic and 5G coverage\n\nThe plan is expected to create 25,000 jobs and boost property values across all areas of Al Ain. Areas like Al Foah, Al Yahar, and Al Mutaredh are expected to see the highest growth as new infrastructure reaches them.\n\nFor property investors, this represents a once-in-a-generation opportunity to invest in Al Ain before the full impact of these developments is realized.",
    contentAr: "كشف المجلس أبوظبي للتخطيط العمراني عن \"العين 2030\"، خطة تطوير بنية تحتية طموحة بقيمة 50 مليار درهم صُممت لتموضع العين كمدينة عائلية رائدة في الإمارات.\n\nتشمل المشاريع الرئيسية:\n\n- **طريق العين الدائري الجديد**: طريق سريع بطول 45 كم لتقليل ازدحام وسط المدينة\n- **5 مدارس جديدة**: بما في ذلك مدرستان بمنهج دولي\n- **مدينة العين الطبية**: مستشفى تخصصي بـ 500 سرير\n- **الحي الثقافي**: متحف جديد ومكتبة ومركز فنون أدائية\n- **الممرات الخضراء**: 25 كم من مسارات المشي وركوب الدراجات المظللة\n- **البنية التحتية الذكية**: تغطية الألياف البصرية و5G على مستوى المدينة\n\nمن المتوقع أن تخلق الخطة 25000 وظيفة وتعزز قيم العقارات في جميع مناطق العين. من المتوقع أن تشهد مناطق مثل الفوعة واليحر والمترع أعلى نمو مع وصول البنية التحتية الجديدة إليها.\n\nبالنسبة للمستثمرين العقاريين، يمثل هذا فرصة العمر للاستثمار في العين قبل إدراك التأثير الكامل لهذه التطورات.",
    category: "New Property Projects",
    coverImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "sustainable-living-al-ain-green-homes",
    titleEn: "Sustainable Living: Green Homes Trend in Al Ain",
    titleAr: "الحياة المستدامة: اتجاه المنازل الخضراء في العين",
    excerptEn: "Solar panels, smart irrigation, and energy-efficient design are becoming standard features in new Al Ain developments.",
    excerptAr: "الألواح الشمسية والري الذكي والتصميم الموفر للطاقة أصبحت معايير قياسية في التطورات الجديدة في العين.",
    contentEn: "Al Ain is leading the UAE's sustainable housing movement, with new developments increasingly incorporating green features as standard.\n\nKey trends in 2026 include:\n\n**Solar Integration**: New villas come with rooftop solar panels pre-installed, reducing electricity bills by up to 40%.\n\n**Smart Irrigation**: AI-powered irrigation systems that use weather forecasts and soil sensors to reduce water consumption by 60%.\n\n**Passive Cooling**: Traditional Emirati architectural elements like wind towers (barjeel) are being modernized to reduce AC reliance.\n\n**Green Certifications**: The Estidama Pearl Rating System is now mandatory for all new residential developments.\n\n**Native Landscaping**: Date palms, ghaf trees, and desert plants replace water-intensive lawns.\n\nAl Ain Properties features several sustainable properties in our portfolio. Properties with green features typically command 5-8% premium rents and sell 30% faster than conventional properties.",
    contentAr: "تقود العين حركة الإسكان المستدام في الإمارات، حيث تدمج التطورات الجديدة بشكل متزايد الميزات الخضراء كمعيار أساسي.\n\nتشمل الاتجاهات الرئيسية في عام 2026:\n\n**تكامل الطاقة الشمسية**: تأتي الفلل الجديدة بألواح شمسية مثبتة مسبقاً على السطح، مما يقلل فواتير الكهرباء بنسبة تصل إلى 40%.\n\n**الري الذكي**: أنظمة ري مدعومة بالذكاء الاصطناعي تستخدم توقعات الطقس ومستشعرات التربة لتقليل استهلاك المياه بنسبة 60%.\n\n**التبريد السلبي**: يتم تحديث العناصر المعمارية الإماراتية التقليدية مثل براجيل (أبراج الرياح) لتقليل الاعتماد على التكييف.\n\n**الشهادات الخضراء**: نظام تصنيف اللؤلؤة استدامة أصبح إلزامياً لجميع التطورات السكنية الجديدة.\n\n**التنسيق الحضري الأصلي**: تحل النخيل وأشجار الغاف والنباتات الصحراوية محل الحدائق كثيفة الاستهلاك للمياه.\n\nتتميز العين العقارية بعدة عقارات مستدامة في محفظتنا. تحصل العقارات ذات الميزات الخضراء عادة على علاوة إيجار 5-8% وتباع أسرع بنسبة 30% من العقارات التقليدية.",
    category: "Al Ain Property News",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "rental-yield-comparison-uae-cities-2026",
    titleEn: "Rental Yield Comparison: Al Ain vs Dubai vs Abu Dhabi (2026)",
    titleAr: "مقارنة العائد الإيجاري: العين مقابل دبي مقابل أبوظبي (2026)",
    excerptEn: "New data reveals Al Ain offers the highest rental yields in the UAE, making it attractive for buy-to-let investors.",
    excerptAr: "تكشف بيانات جديدة أن العين تقدم أعلى العوائد الإيجارية في الإمارات، مما يجعلها جذابة للمستثمرين الذين يشترون للتأجير.",
    contentEn: "A comprehensive analysis of UAE rental markets in Q1 2026 reveals that Al Ain offers the highest rental yields among the three major Emirates cities.\n\n**Average Rental Yields (2026):**\n- Al Ain: 7.2% (residential), 9.1% (commercial)\n- Dubai: 5.4% (residential), 7.8% (commercial)\n- Abu Dhabi: 5.8% (residential), 8.2% (commercial)\n\n**Why Al Ain leads:**\n1. Lower property acquisition costs (30-50% below Dubai)\n2. Strong, stable tenant demand from families\n3. Limited new supply keeping rents firm\n4. Growing expat community from education sector\n\n**Best performing areas in Al Ain:**\n- Al Jimi: 7.8% yield (family villas)\n- Al Hili: 7.5% yield (apartments)\n- Falaj Hazza: 7.3% yield (near university)\n\nFor investors seeking steady, low-risk income, Al Ain represents excellent value. Contact Al Ain Properties for a curated list of high-yield investment properties.",
    contentAr: "كشف تحليل شامل لأسواق الإيجار في الإمارات في الربع الأول من عام 2026 أن العين تقدم أعلى العوائد الإيجارية بين المدن الإماراتية الكبرى الثلاث.\n\n**متوسط العوائد الإيجارية (2026):**\n- العين: 7.2% (سكني)، 9.1% (تجاري)\n- دبي: 5.4% (سكني)، 7.8% (تجاري)\n- أبوظبي: 5.8% (سكني)، 8.2% (تجاري)\n\n**لماذا تتقدم العين:**\n1. تكاليف الاستحواذ على العقارات أقل (30-50% أقل من دبي)\n2. طلب قوي ومستقر من المستأجرين العائليين\n3. عرض جديد محدود يبقي الإيجارات ثابتة\n4. مجتمع مغترب متنامٍ من قطاع التعليم\n\n**أفضل المناطق أداءً في العين:**\n- الجيمي: 7.8% عائد (فلل عائلية)\n- الهيلي: 7.5% عائد (شقق)\n- فلج هزاع: 7.3% عائد (قريب من الجامعة)\n\nللمستثمرين الذين يبحثون عن دخل ثابت منخفض المخاطر، تمثل العين قيمة ممتازة. تواصل مع العين العقارية للحصول على قائمة منتقاة من العقارات الاستثمارية ذات العائد العالي.",
    category: "Rental Market Updates",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb58cd9a?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
  },
  {
    slug: "first-time-buyers-guide-al-ain",
    titleEn: "First-Time Buyer's Guide to Al Ain Property (2026)",
    titleAr: "دليل المشتري لأول مرة لعقارات العين (2026)",
    excerptEn: "Everything you need to know about buying your first property in Al Ain — from financing to legal requirements.",
    excerptAr: "كل ما تحتاج معرفته لشراء عقارك الأول في العين — من التمويل إلى المتطلبات القانونية.",
    contentEn: "Buying your first property in Al Ain is an exciting milestone. Here's our comprehensive guide for 2026:\n\n**Step 1: Determine Your Budget**\nBeyond the purchase price, budget for:\n- 2% transfer fee (DLD)\n- 0.5% mortgage registration fee\n- AED 4,000 property valuation\n- AED 2,500 NOC fee (developer)\n- 1-2% agent commission\n\n**Step 2: Get Pre-Approved**\nUAE banks offer mortgages up to 80% LTV for expats (85% for nationals). Required documents:\n- 6 months bank statements\n- Salary certificate (or 2 years audited accounts for self-employed)\n- Valid Emirates ID\n- Passport copy\n\n**Step 3: Find the Right Property**\nFor first-time buyers, we recommend:\n- 1-2 bedroom apartments in Al Jimi or Al Hili (AED 600,000-1,200,000)\n- Townhouses in Zakher (AED 1,500,000-2,500,000)\n\n**Step 4: Make an Offer & Sign MOU**\nOnce accepted, sign Memorandum of Understanding (MOU) with 10% deposit (held in escrow).\n\n**Step 5: Mortgage & Transfer**\nFinalize mortgage, get NOC from developer, and transfer ownership at DLD.\n\n**Step 6: Get Your Keys!**\nReceive your title deed and keys. Don't forget to set up utilities (DEWA/ADDC) and change the locks.\n\nContact Al Ain Properties for a free first-time buyer consultation.",
    contentAr: "شراء عقارك الأول في العين محطة مثيرة. إليك دليلنا الشامل لعام 2026:\n\n**الخطوة 1: حدد ميزانيتك**\nبسعر الشراء، خصص ميزانية لـ:\n- 2% رسوم نقل (DLD)\n- 0.5% رسوم تسجيل الرهن العقاري\n- 4000 درهم تقييم العقار\n- 2500 درهم رسوم NOC (المطور)\n- 1-2% عمولة الوكيل\n\n**الخطوة 2: احصل على موافقة مسبقة**\nتقدم البنوك الإماراتية رهوناً عقارية تصل إلى 80% LTV للمغتربين (85% للمواطنين). المستندات المطلوبة:\n- كشوف حسابات بنكية لـ 6 أشهر\n- شهادة راتب (أو حسابات مدققة لـ سنتين للمستقلين)\n- الهوية الإماراتية سارية المفعول\n- نسخة جواز السفر\n\n**الخطوة 3: اعثر على العقار المناسب**\nللمشترين لأول مرة، نوصي بـ:\n- شقق بـ 1-2 غرفة نوم في الجيمي أو الهيلي (600,000-1,200,000 درهم)\n- تاون هاوس في زاخر (1,500,000-2,500,000 درهم)\n\n**الخطوة 4: قدم عرضاً ووقع مذكرة التفاهم**\nبمجرد القبول، وقع مذكرة التفاهم مع 10% كوديعة (تُحفظ في الضمان).\n\n**الخطوة 5: الرهن والنقل**\nأنهِ الرهن، احصل على NOC من المطور، وانقل الملكية في DLD.\n\n**الخطوة 6: استلم مفاتيحك!\nاستلم سند الملكية والمفاتيح. لا تنسَ إعداد المرافق (DEWA/ADDC) وتغيير الأقفال.\n\nتواصل مع العين العقارية للحصول على استشارة مجانية للمشترين لأول مرة.",
    category: "Investment News",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    status: "published",
    publishedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
]
