import Header from './Header';
import Footer from './Footer';

export default function Terms() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using ExamSaaS ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all users of the Platform, including institutions, administrators, teachers, and students.`
    },
    {
      title: '2. Description of Service',
      content: `ExamSaaS provides an online examination platform that enables educational institutions to:

• Create and manage online examinations
• Monitor exam sessions with AI-powered proctoring
• Generate and analyze results
• Manage student and teacher accounts
• Access analytics and reporting tools

We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.`
    },
    {
      title: '3. User Accounts',
      content: `To use certain features of the Platform, you must create an account. You agree to:

• Provide accurate and complete registration information
• Maintain the security of your password and account
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account

Institutions are responsible for managing user accounts within their organization.`
    },
    {
      title: '4. Acceptable Use',
      content: `You agree not to:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit harmful code or malware
• Attempt to gain unauthorized access to our systems
• Use the Platform to cheat or facilitate academic dishonesty
• Share login credentials with unauthorized users
• Interfere with other users' access to the Platform
• Use automated systems to access the Platform without permission`
    },
    {
      title: '5. Examination Integrity',
      content: `Users agree to maintain examination integrity by:

• Following all examination rules and guidelines
• Not sharing exam content without authorization
• Complying with AI proctoring requirements when enabled
• Reporting any suspected cheating or misconduct

Violations may result in account suspension and reporting to the relevant institution.`
    },
    {
      title: '6. Intellectual Property',
      content: `The Platform and its original content, features, and functionality are owned by ExamSaaS Technologies Pvt. Ltd. and are protected by international copyright, trademark, and other intellectual property laws.

Exam content created by institutions remains their intellectual property. By uploading content, you grant us a license to store and display it as necessary to provide our services.`
    },
    {
      title: '7. Payment Terms',
      content: `For paid subscriptions:

• Fees are billed in advance on a monthly or annual basis
• All fees are non-refundable except as required by law
• We may change pricing with 30 days notice
• Failure to pay may result in service suspension
• Taxes are additional where applicable`
    },
    {
      title: '8. Data Protection',
      content: `We handle your data in accordance with our Privacy Policy. By using the Platform, you consent to:

• Collection and processing of personal data as described
• Storage of examination data and results
• Use of analytics to improve our services

For institutional accounts, the institution acts as the data controller for their users' data.`
    },
    {
      title: '9. Service Availability',
      content: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We are not liable for:

• Temporary unavailability due to maintenance
• Factors beyond our reasonable control
• Third-party service interruptions

We will provide reasonable notice for scheduled maintenance.`
    },
    {
      title: '10. Limitation of Liability',
      content: `To the maximum extent permitted by law:

• Our liability is limited to the amount paid for the service
• We are not liable for indirect, incidental, or consequential damages
• We are not responsible for third-party actions or content
• We do not guarantee specific examination outcomes`
    },
    {
      title: '11. Termination',
      content: `We may terminate or suspend your account at any time for:

• Violation of these terms
• Non-payment of fees
• Fraudulent or illegal activity
• Extended periods of inactivity

Upon termination, your right to use the Platform ceases immediately. Data may be retained as required by law.`
    },
    {
      title: '12. Changes to Terms',
      content: `We may modify these terms at any time. We will notify users of material changes via email or platform notification. Continued use after changes constitutes acceptance of the new terms.`
    },
    {
      title: '13. Governing Law',
      content: `These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Bangalore, Karnataka.`
    },
    {
      title: '14. Contact Information',
      content: `For questions about these Terms of Service, please contact us:

Email: legal@examsaas.com
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
        .badge-coral{background:rgba(255,87,51,0.12);color:#FF5733;border:1px solid rgba(255,87,51,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .legal-section{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:20px;}
        .legal-section h2{font-size:18px;font-weight:700;margin-bottom:16px;color:#FF5733;}
        .legal-section p{color:rgba(240,246,255,0.6);font-size:14px;line-height:1.85;white-space:pre-line;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,87,51,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-coral" style={{ marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Terms of <span className="shimmer-text">Service</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 12 }}>
            Please read these terms carefully before using our platform.
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
