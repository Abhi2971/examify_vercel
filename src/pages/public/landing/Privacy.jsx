import Header from './Header';
import Footer from './Footer';

export default function Privacy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
      
• Personal identification information (name, email address, phone number)
• Educational institution details
• Payment information (processed securely through our payment partners)
• Usage data and examination records
• Device and browser information for security purposes`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our examination platform
• Process transactions and send related information
• Send technical notices, updates, and administrative messages
• Respond to your comments, questions, and customer service requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and abuse
• Personalize and improve your experience`
    },
    {
      title: 'Information Sharing',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With your institution (for institutional accounts)
• With service providers who assist in our operations
• To comply with legal obligations
• To protect our rights and prevent fraud
• With your consent or at your direction`
    },
    {
      title: 'Data Security',
      content: `We implement industry-standard security measures to protect your data:

• 256-bit SSL encryption for all data transmission
• Encrypted storage for sensitive information
• Regular security audits and penetration testing
• SOC 2 Type II compliance
• ISO 27001 certified data centers
• Multi-factor authentication options`
    },
    {
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain examination records as required by educational standards

You may request deletion of your data at any time, subject to legal retention requirements.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• Access your personal information
• Correct inaccurate data
• Request deletion of your data
• Export your data in a portable format
• Opt-out of marketing communications
• Withdraw consent where applicable`
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to:

• Keep you logged in
• Remember your preferences
• Analyze platform usage
• Improve our services

You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality.`
    },
    {
      title: 'Children\'s Privacy',
      content: `Our platform is designed for educational institutions and their authorized users. We do not knowingly collect information from children under 13 without parental consent. If you believe we have collected such information, please contact us immediately.`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.`
    },
    {
      title: 'Contact Us',
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@examsaas.com
Address: ExamSaaS Technologies Pvt. Ltd., Bangalore, Karnataka, India`
    },
  ];

  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", background: '#081120', minHeight: '100vh', color: '#F0F6FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .shimmer-text{background:linear-gradient(90deg,#00C4B4,#00E5FF,#FFB800,#FF5733,#00C4B4);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 5s linear infinite;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
        .badge-teal{background:rgba(0,196,180,0.12);color:#00C4B4;border:1px solid rgba(0,196,180,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .legal-section{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:20px;}
        .legal-section h2{font-size:18px;font-weight:700;margin-bottom:16px;color:#00C4B4;}
        .legal-section p{color:rgba(240,246,255,0.6);font-size:14px;line-height:1.85;white-space:pre-line;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,196,180,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Privacy <span className="shimmer-text">Policy</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 12 }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
