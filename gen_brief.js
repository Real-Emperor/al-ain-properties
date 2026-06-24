// Phronesis Studio — Client Demo Access One-Pager
// For: Mohammed Mosa Ali
// Project: Al Ain Properties Real Estate Platform
// Design: Editorial minimal — ink black + warm gold accent + Phi (Φ) symbol

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, PageNumber,
  WidthType, TableLayoutType, BorderStyle, ShadingType,
  SectionType, HeightRule,
} = require("docx");
const fs = require("fs");

// ─── Palette: Editorial Ink + Gold (matches Phronesis Studio aesthetic) ───
const P = {
  ink: "0F0F0F",          // near-black ink
  inkSoft: "2A2A2A",      // body text
  muted: "6B6B6B",        // captions
  gold: "B8945F",         // warm gold (Phronesis accent)
  goldLight: "E8D9B8",    // light gold tint
  paper: "FFFFFF",        // paper white
  paperWarm: "FAF7F0",    // warm off-white
  divider: "D4C9A8",      // gold-tinted divider
  red: "8B2C2C",          // deadline red (muted)
};

// ─── Border helpers ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB,
                       insideHorizontal: NB, insideVertical: NB };

const goldThinBorder = { style: BorderStyle.SINGLE, size: 4, color: P.gold, space: 0 };
const goldThickBorder = { style: BorderStyle.SINGLE, size: 12, color: P.gold, space: 0 };
const inkThinBorder = { style: BorderStyle.SINGLE, size: 2, color: P.ink, space: 0 };

// ─── Timestamp (generated at document creation time) ───
const NOW = new Date()
// UAE is UTC+4
const UAE_OFFSET = 4 * 60 // minutes
const uaeDate = new Date(NOW.getTime() + (UAE_OFFSET * 60 * 1000) - (NOW.getTimezoneOffset() * 60 * 1000))
const TIMESTAMP_ISO = NOW.toISOString()
const TIMESTAMP_UAE = uaeDate.toISOString().replace('T', ' ').substring(0, 16) + ' GST'
// Friday 1 PM UAE time — calculate next Friday
const friday = new Date(uaeDate)
const daysUntilFriday = (5 - uaeDate.getDay() + 7) % 7
friday.setDate(friday.getDate() + daysUntilFriday)
friday.setHours(13, 0, 0, 0)
const DEADLINE_DATE = friday.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const DEADLINE_TIME = '1:00 PM'
const DEADLINE_ISO = friday.toISOString()

// ─── Build document ───
const children = []

// ═══════════════════════════════════════════════════════════
// HEADER STRIP — Phronesis Studio branding
// ═══════════════════════════════════════════════════════════

// Phi symbol + studio name (centered, elegant)
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 60 },
  children: [new TextRun({
    text: "Φ",
    size: 48, // 24pt
    bold: true,
    color: P.gold,
    font: { ascii: "Georgia" },
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 0, line: 260, lineRule: "atLeast" },
  children: [new TextRun({
    text: "PHRONESIS  STUDIO",
    size: 20, // 10pt
    bold: true,
    color: P.ink,
    font: { ascii: "Georgia" },
    characterSpacing: 80,
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({
    text: "Educator  ·  Systems Architect  ·  Leadership",
    size: 14, // 7pt
    color: P.muted,
    font: { ascii: "Georgia" },
    italics: true,
  })],
}))

// Gold divider (thick)
children.push(new Paragraph({
  spacing: { before: 0, after: 240 },
  border: { bottom: goldThickBorder },
  children: [],
}))

// ═══════════════════════════════════════════════════════════
// DOCUMENT TITLE
// ═══════════════════════════════════════════════════════════

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80, line: 300, lineRule: "atLeast" },
  children: [new TextRun({
    text: "Demonstration Access Brief",
    size: 32, // 16pt
    bold: true,
    color: P.ink,
    font: { ascii: "Georgia" },
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({
    text: "Al Ain Properties — Real Estate Platform",
    size: 20, // 10pt
    color: P.gold,
    font: { ascii: "Georgia" },
    italics: true,
  })],
}))

// Recipient + date line (editorial style — left and right aligned in a table)
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.FIXED,
  borders: allNoBorders,
  rows: [new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 5000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({ text: "Prepared for  ", size: 16, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: "Mohammed Mosa Ali", size: 16, color: P.ink, font: { ascii: "Georgia" }, bold: true }),
          ],
        })],
      }),
      new TableCell({
        width: { size:5000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Issued  ", size: 16, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: TIMESTAMP_UAE, size: 16, color: P.ink, font: { ascii: "Georgia" }, bold: true }),
          ],
        })],
      }),
    ],
  })],
}))

// Thin gold divider
children.push(new Paragraph({
  spacing: { before: 120, after: 200 },
  border: { bottom: goldThinBorder },
  children: [],
}))

// ═══════════════════════════════════════════════════════════
// SECTION 1 — Purpose (short editorial paragraph)
// ═══════════════════════════════════════════════════════════

children.push(new Paragraph({
  spacing: { before: 0, after: 100 },
  children: [new TextRun({
    text: "PURPOSE",
    size: 16,
    bold: true,
    color: P.gold,
    font: { ascii: "Georgia" },
    characterSpacing: 60,
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200, line: 280, lineRule: "atLeast" },
  children: [new TextRun({
    text: "This brief grants you private access to the demonstration build of the Al Ain Properties real estate platform — a bilingual, mobile-responsive website engineered for property listings, WhatsApp-driven inquiries, viewing bookings, and a full administrative dashboard. The demo is pre-populated with twenty-one sample properties across nine Al Ain areas, eight news articles, and complete contact integration. Please use this access to evaluate the platform against your requirements.",
    size: 18, // 9pt
    color: P.inkSoft,
    font: { ascii: "Georgia" },
  })],
}))

// ═══════════════════════════════════════════════════════════
// SECTION 2 — Access Credentials (boxed callout)
// ═══════════════════════════════════════════════════════════

children.push(new Paragraph({
  spacing: { before: 0, after: 100 },
  children: [new TextRun({
    text: "ACCESS CREDENTIALS",
    size: 14,
    bold: true,
    color: P.gold,
    font: { ascii: "Georgia" },
    characterSpacing: 60,
  })],
}))

// The access box — bordered table with gold accents
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.FIXED,
  borders: {
    top: goldThickBorder,
    bottom: goldThickBorder,
    left: NB,
    right: NB,
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: P.divider },
    insideVertical: NB,
  },
  rows: [
    // Row 1 — Website URL
    new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: [new TableCell({
        width: { size: 10000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 400, right: 400 },
        shading: { type: ShadingType.CLEAR, fill: P.paperWarm, color: "auto" },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 280, lineRule: "atLeast" },
          children: [
            new TextRun({ text: "Website   ", size: 14, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: "https://al-ain-properties-mauve.vercel.app", size: 20, color: P.ink, font: { ascii: "Courier New" }, bold: true }),
          ],
        })],
      })],
    }),
    // Row 2 — Admin URL
    new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: [new TableCell({
        width: { size: 10000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 400, right: 400 },
        shading: { type: ShadingType.CLEAR, fill: P.paperWarm, color: "auto" },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 280, lineRule: "atLeast" },
          children: [
            new TextRun({ text: "Admin Dashboard   ", size: 14, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: "/admin", size: 20, color: P.ink, font: { ascii: "Courier New" }, bold: true }),
          ],
        })],
      })],
    }),
    // Row 3 — Email
    new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: [new TableCell({
        width: { size: 10000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 400, right: 400 },
        shading: { type: ShadingType.CLEAR, fill: P.paperWarm, color: "auto" },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 280, lineRule: "atLeast" },
          children: [
            new TextRun({ text: "Email   ", size: 14, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: "admin@alainproperties.com", size: 20, color: P.ink, font: { ascii: "Courier New" }, bold: true }),
          ],
        })],
      })],
    }),
    // Row 4 — Password
    new TableRow({
      cantSplit: true,
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: [new TableCell({
        width: { size: 10000, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 400, right: 400 },
        shading: { type: ShadingType.CLEAR, fill: P.paperWarm, color: "auto" },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 280, lineRule: "atLeast" },
          children: [
            new TextRun({ text: "Password   ", size: 14, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
            new TextRun({ text: "AlAin@Admin2024!", size: 20, color: P.ink, font: { ascii: "Courier New" }, bold: true }),
          ],
        })],
      })],
    }),
  ],
}))

children.push(new Paragraph({ spacing: { after: 200 }, children: [] }))

// ═══════════════════════════════════════════════════════════
// SECTION 3 — What to Evaluate (compact bullet list)
// ═══════════════════════════════════════════════════════════

children.push(new Paragraph({
  spacing: { before: 0, after: 100 },
  children: [new TextRun({
    text: "WHAT TO EVALUATE",
    size: 14,
    bold: true,
    color: P.gold,
    font: { ascii: "Georgia" },
    characterSpacing: 60,
  })],
}))

const evalPoints = [
  "Bilingual Arabic/English interface with dark mode and mobile responsiveness",
  "Advanced property search across nine Al Ain areas and seven property types",
  "Property details with photo galleries, WhatsApp inquiry, and viewing booking",
  "Admin dashboard: add/edit properties with photo upload from device, manage inquiries, news",
  "WhatsApp integration: every inquiry and viewing booking routes directly to your phone",
]

for (const point of evalPoints) {
  children.push(new Paragraph({
    spacing: { after: 60, line: 260, lineRule: "atLeast" },
    indent: { left: 400 },
    children: [
      new TextRun({ text: "—  ", size: 18, color: P.gold, font: { ascii: "Georgia" }, bold: true }),
      new TextRun({ text: point, size: 18, color: P.inkSoft, font: { ascii: "Georgia" } }),
    ],
  }))
}

children.push(new Paragraph({ spacing: { after: 200 }, children: [] }))

// ═══════════════════════════════════════════════════════════
// SECTION 4 — Deadline Notice (the critical callout)
// ═══════════════════════════════════════════════════════════

children.push(new Paragraph({
  spacing: { before: 0, after: 100 },
  children: [new TextRun({
    text: "DECISION DEADLINE",
    size: 14,
    bold: true,
    color: P.red,
    font: { ascii: "Georgia" },
    characterSpacing: 60,
  })],
}))

// Deadline box — bordered with ink, gold accent
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  layout: TableLayoutType.FIXED,
  borders: {
    top: { style: BorderStyle.DOUBLE, size: 6, color: P.ink },
    bottom: { style: BorderStyle.DOUBLE, size: 6, color: P.ink },
    left: NB,
    right: NB,
    insideHorizontal: NB,
    insideVertical: NB,
  },
  rows: [new TableRow({
    cantSplit: true,
    children: [new TableCell({
      width: { size: 10000, type: WidthType.DXA },
      borders: noBorders,
      margins: { top: 280, bottom: 280, left: 400, right: 400 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60, line: 320, lineRule: "atLeast" },
          children: [new TextRun({
            text: DEADLINE_DATE,
            size: 28, // 14pt
            bold: true,
            color: P.ink,
            font: { ascii: "Georgia" },
          })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({
            text: `${DEADLINE_TIME}  UAE Time  (GST)`,
            size: 22, // 11pt
            color: P.gold,
            font: { ascii: "Georgia" },
            bold: true,
            characterSpacing: 40,
          })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 260, lineRule: "atLeast" },
          children: [new TextRun({
            text: "This is a demonstration environment for evaluation only. After the deadline above, all credentials, access links, and sample data will be rotated. Please complete your review and communicate your decision before this time.",
            size: 16, // 8pt
            color: P.inkSoft,
            font: { ascii: "Georgia" },
            italics: true,
          })],
        }),
      ],
    })],
  })],
}))

children.push(new Paragraph({ spacing: { after: 200 }, children: [] }))

// ═══════════════════════════════════════════════════════════
// FOOTER — Phronesis Studio signature + contact
// ═══════════════════════════════════════════════════════════

// Gold divider
children.push(new Paragraph({
  spacing: { before: 120, after: 200 },
  border: { bottom: goldThinBorder },
  children: [],
}))

// Studio signature
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40, line: 260, lineRule: "atLeast" },
  children: [new TextRun({
    text: "Φ   Phronesis Studio",
    size: 20, // 10pt
    bold: true,
    color: P.ink,
    font: { ascii: "Georgia" },
    characterSpacing: 40,
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [new TextRun({
    text: "Al Ain  ·  United Arab Emirates",
    size: 14, // 7pt
    color: P.muted,
    font: { ascii: "Georgia" },
    italics: true,
  })],
}))

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [
    new TextRun({ text: "phronesis-studio.com", size: 14, color: P.gold, font: { ascii: "Georgia" } }),
    new TextRun({ text: "   ·   ", size: 14, color: P.muted, font: { ascii: "Georgia" } }),
    new TextRun({ text: "Studio of Practical Wisdom", size: 14, color: P.muted, font: { ascii: "Georgia" }, italics: true }),
  ],
}))

// Confidentiality micro-line
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 120, after: 0 },
  children: [new TextRun({
    text: `Document generated ${TIMESTAMP_UAE}  ·  Confidential  ·  For the named recipient only`,
    size: 12, // 6pt
    color: P.muted,
    font: { ascii: "Georgia" },
    italics: true,
  })],
}))

// ─── Assemble document ───
const doc = new Document({
  creator: "Phronesis Studio",
  title: "Al Ain Properties — Demonstration Access Brief",
  description: "Demo access credentials for Mohammed Mosa Ali",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Georgia" }, size: 20, color: P.inkSoft },
        paragraph: { spacing: { line: 280 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, bottom: 720, left: 1100, right: 1100 },
        },
      },
      children,
    },
  ],
})

// ─── Write to disk ───
Packer.toBuffer(doc).then(buf => {
  const outPath = "/home/z/my-project/download/Phronesis-Studio-Demo-Access-Brief.docx"
  fs.writeFileSync(outPath, buf)
  console.log(`✓ Document written to: ${outPath}`)
  console.log(`  Size: ${buf.length} bytes`)
  console.log(`  Timestamp: ${TIMESTAMP_UAE}`)
  console.log(`  Deadline: ${DEADLINE_DATE} at ${DEADLINE_TIME} UAE time`)
}).catch(err => {
  console.error("✗ Document generation failed:", err)
  process.exit(1)
})
