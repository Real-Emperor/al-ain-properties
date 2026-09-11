"use client"

export default function PaymentDuePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Account Under Review — Al Ain Real Estate</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #f8f4ef 0%, #fff 100%);
            color: #2a2a2a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .container {
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            padding: 3rem 2.5rem;
            text-align: center;
            border: 2px solid #e9a0a0;
          }
          .lock-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            background: #e9a0a0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .lock-icon svg { width: 28px; height: 28px; color: white; }
          h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a1a1a; }
          .subtitle { font-size: 0.875rem; color: #999; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 2px; }
          .divider { width: 60px; height: 3px; background: #e9a0a0; margin: 0 auto 2rem; border-radius: 2px; }
          .message { font-size: 0.95rem; line-height: 1.7; color: #4a4a4a; margin-bottom: 1.5rem; }
          .message-bn { font-size: 0.9rem; line-height: 1.7; color: #5a5a5a; margin-bottom: 1.5rem; }
          .highlight { font-weight: 600; color: #c88585; }
          .warning-box {
            background: #fff5f5;
            border: 1px solid #e9a0a0;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            font-size: 0.875rem;
            color: #6a4a4a;
          }
          .footer-note { font-size: 0.75rem; color: #bbb; margin-top: 2rem; }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="lock-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1>Account Under Review</h1>
          <p className="subtitle">Al Ain Real Estate — Website Access Suspended</p>
          <div className="divider" />

          <div className="message">
            <p style={{ marginBottom: "1rem" }}>
              This website has been temporarily suspended due to an <span className="highlight">outstanding payment of AED 500</span> as per our agreed payment schedule.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              As per our agreement, the <span className="highlight">final payment of AED 500</span> was due on <span className="highlight">15 September 2026</span> and remains unpaid despite multiple reminders sent on 1, 5, 8, and 9 September 2026.
            </p>
            <p>
              Please refer to our <span className="highlight">WhatsApp conversation</span> for the designated bank account details. <span className="highlight">Transfers to any other bank account will not be accepted.</span> Cash collection is not available — payment must be made via bank transfer only.
            </p>
          </div>

          <div className="warning-box">
            <strong>⚠ Late Payment Notice:</strong> A fine of <strong>AED 10 per day</strong> will be added for each day of delay beyond 15 September 2026. Please complete the payment promptly to restore website access and avoid additional charges.
          </div>

          <div className="message-bn">
            <p style={{ marginBottom: "0.75rem" }}>
              এই ওয়েবসাইটটি সাময়িকভাবে বন্ধ করা হয়েছে কারণ চুক্তি অনুযায়ী <span className="highlight">৫০০ দিরহাম</span> বকেয়া রয়ে গেছে।
            </p>
            <p style={{ marginBottom: "0.75rem" }}>
              আমাদের চুক্তি অনুযায়ী, শেষ কিস্তি <span className="highlight">১৫ সেপ্টেম্বর ২০২৬</span>-এর মধ্যে পরিশোধ করতে হবে। ১, ৫, ৮ এবং ৯ সেপ্টেম্বর ২০২৬ তারিখে একাধিক রিমাইন্ডার পাঠানো হয়েছে সত্ত্বেও পেমেন্ট এখনও পাওয়া যায়নি।
            </p>
            <p>
              অনুগ্রহ করে আমাদের <span className="highlight">WhatsApp কথোপকথনে</span> উল্লেখিত ব্যাংক অ্যাকাউন্টে টাকা পাঠান। <span className="highlight">অন্য কোনো ব্যাক অ্যাকাউন্টে টাকা পাঠালে তা গ্রহণ করা হবে না।</span> ক্যাশ সংগ্রহের ব্যবস্থা নেই — শুধুমাত্র ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট গ্রহণ করা হবে।
            </p>
          </div>

          <div className="warning-box">
            <strong>⚠ বিলম্ব পেমেন্ট নোটিশ:</strong> ১৫ সেপ্টেম্বর ২০২৬-এর পর প্রতিদিন বিলম্বের জন্য <strong>১০ দিরহাম</strong> জরিমানা যোগ হবে। অতিরিক্ত চার্জ এড়াতে দ্রুত পেমেন্ট সম্পন্ন করুন।
          </div>

          <p className="footer-note">
            This is an automated notice. Website access will be restored immediately upon confirmed payment.
          </p>
        </div>
      </body>
    </html>
  )
}
