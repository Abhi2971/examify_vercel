import Header from './Header';
import Footer from './Footer';

const sections = [
  {
    title: 'Introduction',
    content: `ExamSaaS Technologies Pvt. Ltd. ("we", "us", "our") is committed to protecting the personal data of our users in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.

This page explains your rights under GDPR and how we handle personal data for users in the European Economic Area (EEA) and United Kingdom.`
  },
  {
    title: 'Data Controller',
    content: `ExamSaaS Technologies Pvt. Ltd. acts as the data controller for personal data collected through our platform.

For institutional accounts, the educational institution may act as the data controller for their users' data, with ExamSaaS acting as a data processor.

Contact our Data Protection Officer:
Email: dpo@examsaas.com
Address: ExamSaaS Technologies Pvt. Ltd., Bangalore, Karnataka, India`
  },
  {
    title: 'Legal Basis for Processing',
    content: `We process personal data based on the following legal grounds:

**Contractual Necessity**
Processing necessary to fulfill our service agreement with you or your institution, including account management, exam delivery, and support.

**Legitimate Interests**
Processing for our legitimate business interests, such as improving our services, fraud prevention, and security.

**Consent**
Where you have given explicit consent for specific processing activities, such as marketing communications.

**Legal Obligations**
Processing required to comply with legal requirements, such as maintaining examination records.`
  },
  {
    title: 'Your GDPR Rights',
    content: `Under GDPR, you have the following rights:

**Right to Access**
Request a copy of all personal data we hold about you.

**Right to Rectification**
Request correction of inaccurate or incomplete data.

**Right to Erasure ("Right to be Forgotten")**
Request deletion of your personal data, subject to legal retention requirements.

**Right to Restrict Processing**
Request limitation of how we use your data.

**Right to Data Portability**
Receive your data in a structured, machine-readable format.

**Right to Object**
Object to processing based on legitimate interests or for direct marketing.

**Right to Withdraw Consent**
Withdraw previously given consent at any time.

**Right to Lodge a Complaint**
File a complaint with your local data protection authority.`
  },
  {
    title: 'Data Transfers',
    content: `Your data may be transferred to and processed in countries outside the EEA, including India where our primary operations are based.

We ensure appropriate safeguards for international transfers through:
• Standard Contractual Clauses (SCCs) approved by the European Commission
• Adequacy decisions where applicable
• Binding Corporate Rules for intra-group transfers

Our cloud infrastructure providers maintain certifications for EU data protection compliance.`
  },
  {
    title: 'Data Retention',
    content: `We retain personal data only as long as necessary for the purposes outlined in our Privacy Policy:

• Account data: Duration of account plus 2 years
• Examination records: As required by educational standards (typically 7 years)
• Analytics data: Anonymized after 26 months
• Marketing consent records: Duration of consent plus 3 years

You can request earlier deletion subject to legal and contractual requirements.`
  },
  {
    title: 'Data Protection Measures',
    content: `We implement appropriate technical and organizational measures to protect personal data:

• Encryption in transit (TLS 1.3) and at rest (AES-256)
• Access controls and authentication
• Regular security assessments
• Employee training on data protection
• Incident response procedures
• Data minimization practices`
  },
  {
    title: 'Exercising Your Rights',
    content: `To exercise any of your GDPR rights, please contact us:

Email: privacy@examsaas.com
Subject line: "GDPR Request - [Your Right]"

We will respond to your request within 30 days. In complex cases, this may be extended by an additional 60 days with notice.

To verify your identity, we may request additional information before processing your request.`
  },
  {
    title: 'Supervisory Authority',
    content: `If you are not satisfied with our response to your data protection concerns, you have the right to lodge a complaint with your local supervisory authority.

For users in the EU, you can find your local authority at: edpb.europa.eu/about-edpb/board/members_en`
  },
];

export default function GDPR() {
  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", background: '#081120', minHeight: '100vh', color: '#F0F6FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .shimmer-text{background:linear-gradient(90deg,#00C4B4,#00E5FF,#FFB800,#FF5733,#00C4B4);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 5s linear infinite;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
        .badge-cyan{background:rgba(0,229,255,0.12);color:#00E5FF;border:1px solid rgba(0,229,255,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .legal-section{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:20px;}
        .legal-section h2{font-size:18px;font-weight:700;margin-bottom:16px;color:#00E5FF;}
        .legal-section p{color:rgba(240,246,255,0.6);font-size:14px;line-height:1.85;white-space:pre-line;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,229,255,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-cyan" style={{ marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            <span className="shimmer-text">GDPR</span> Compliance
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 12 }}>
            Information about your data protection rights under the General Data Protection Regulation.
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
