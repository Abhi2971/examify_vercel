import Header from './Header';
import Footer from './Footer';

const sections = [
  {
    title: 'What Are Cookies?',
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.

We use cookies and similar technologies (like local storage and pixels) to remember your preferences, understand how you use our platform, and improve your experience.`
  },
  {
    title: 'Types of Cookies We Use',
    content: `**Essential Cookies**
These cookies are necessary for the platform to function properly. They enable core features like secure login, exam session management, and navigation. You cannot opt out of these cookies.

**Performance Cookies**
These help us understand how visitors interact with our platform by collecting anonymous information. We use this data to improve functionality and user experience.

**Functional Cookies**
These remember your preferences and settings (like language, timezone, and display preferences) to provide a more personalized experience.

**Analytics Cookies**
We use analytics tools to understand usage patterns and optimize our services. This includes page views, session duration, and feature usage.`
  },
  {
    title: 'Third-Party Cookies',
    content: `Some cookies are placed by third-party services that appear on our pages:

• **Google Analytics**: For understanding usage patterns and improving our platform
• **Razorpay**: For secure payment processing
• **Intercom**: For customer support chat functionality
• **Cloudflare**: For security and performance optimization

These third parties have their own privacy policies governing their use of cookies.`
  },
  {
    title: 'Cookie Duration',
    content: `**Session Cookies**
These temporary cookies are deleted when you close your browser. They are used to maintain your session while using the platform.

**Persistent Cookies**
These remain on your device for a set period or until you delete them. They help us remember your preferences for future visits.

Most of our cookies expire within 1 year, though some essential security cookies may last up to 2 years.`
  },
  {
    title: 'Managing Cookies',
    content: `You can control and manage cookies in several ways:

**Browser Settings**
Most browsers allow you to view, delete, and block cookies through their settings. Note that blocking all cookies may affect platform functionality.

**Our Cookie Preferences**
You can adjust your cookie preferences at any time through the cookie settings link in the footer.

**Opt-Out Links**
• Google Analytics: tools.google.com/dlpage/gaoptout
• General opt-out: aboutads.info/choices`
  },
  {
    title: 'Cookies During Exams',
    content: `During examination sessions, we use essential cookies to:

• Maintain your exam session securely
• Track exam timing and progress
• Store your answers locally as backup
• Enable proctoring features when activated

These exam-related cookies are critical for examination integrity and cannot be disabled during active exam sessions.`
  },
  {
    title: 'Updates to This Policy',
    content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.`
  },
  {
    title: 'Contact Us',
    content: `If you have questions about our use of cookies, please contact us:

Email: privacy@examsaas.com
Address: ExamSaaS Technologies Pvt. Ltd., Bangalore, Karnataka, India`
  },
];

export default function Cookies() {
  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", background: '#081120', minHeight: '100vh', color: '#F0F6FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .shimmer-text{background:linear-gradient(90deg,#00C4B4,#00E5FF,#FFB800,#FF5733,#00C4B4);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 5s linear infinite;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
        .badge-gold{background:rgba(255,184,0,0.12);color:#FFB800;border:1px solid rgba(255,184,0,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .legal-section{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:20px;}
        .legal-section h2{font-size:18px;font-weight:700;margin-bottom:16px;color:#FFB800;}
        .legal-section p{color:rgba(240,246,255,0.6);font-size:14px;line-height:1.85;white-space:pre-line;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,184,0,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-gold" style={{ marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Cookie <span className="shimmer-text">Policy</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 12 }}>
            Learn how we use cookies and similar technologies on our platform.
          </p>
          <p style={{ color: 'rgba(240,246,255,0.35)', fontSize: 13 }}>Last Updated: April 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '20px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {sections.map((section, i) => (
            <div key={i} className="legal-section">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
