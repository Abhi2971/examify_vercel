import Header from './Header';
import Footer from './Footer';

const securityFeatures = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
    color: '#00C4B4',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    title: 'AI-Powered Proctoring',
    description: 'Advanced AI monitors exam sessions for suspicious behavior without compromising privacy.',
    color: '#FFB800',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    title: 'Browser Lockdown',
    description: 'Secure browser mode prevents tab switching, copy-paste, and unauthorized applications.',
    color: '#FF5733',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    title: 'Audit Logging',
    description: 'Comprehensive logs of all activities for compliance and incident investigation.',
    color: '#00E5FF',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />,
    title: 'Identity Verification',
    description: 'Multi-factor authentication and ID verification ensure only authorized users access exams.',
    color: '#00C4B4',
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
    title: 'Anti-Cheating Detection',
    description: 'Plagiarism detection and answer pattern analysis to maintain exam integrity.',
    color: '#FFB800',
  },
];

const certifications = [
  { name: 'ISO 27001', description: 'Information Security Management', color: '#00C4B4' },
  { name: 'SOC 2 Type II', description: 'Security & Availability', color: '#FFB800' },
  { name: 'GDPR', description: 'Data Protection Compliance', color: '#FF5733' },
  { name: 'HIPAA', description: 'Healthcare Data Security', color: '#00E5FF' },
];

const practices = [
  'Regular penetration testing by third-party security firms',
  'Bug bounty program for responsible disclosure',
  '24/7 security monitoring and incident response',
  'Employee security awareness training',
  'Regular security audits and compliance reviews',
  'Data backup and disaster recovery procedures',
  'Vendor security assessment program',
  'Secure software development lifecycle (SDLC)',
];

export default function Security() {
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
        .sdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,180,0.22),rgba(255,184,0,0.18),transparent);}
        .sec-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;transition:all 0.3s;}
        .sec-card:hover{transform:translateY(-4px);border-color:rgba(0,196,180,0.25);}
        .cert-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;text-align:center;transition:all 0.3s;}
        .cert-card:hover{transform:translateY(-4px);}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 80px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,196,180,0.12) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>Security</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Enterprise-Grade <span className="shimmer-text">Security</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            Your data security is our top priority. We employ industry-leading practices to protect your institution's sensitive information.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>Security Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="sec-card">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${feature.color}18`, border: `1px solid ${feature.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="24" height="24" fill="none" stroke={feature.color} strokeWidth="1.8" viewBox="0 0 24 24">{feature.icon}</svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* Certifications */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>Certifications & Compliance</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', textAlign: 'center', marginBottom: 48 }}>We maintain industry-standard certifications to ensure your data is protected.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {certifications.map((cert) => (
              <div key={cert.name} className="cert-card" style={{ borderTop: `3px solid ${cert.color}` }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: cert.color, marginBottom: 8 }}>{cert.name}</div>
                <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 13 }}>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* Security Practices */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>Our Security Practices</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', textAlign: 'center', marginBottom: 48 }}>We follow rigorous security practices to protect your data.</p>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {practices.map((practice, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,196,180,0.15)', border: '1px solid rgba(0,196,180,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" fill="none" stroke="#00C4B4" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: 'rgba(240,246,255,0.7)', fontSize: 15 }}>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(255,87,51,0.06)', border: '1px solid rgba(255,87,51,0.15)', borderRadius: 24, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Report a Vulnerability</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Found a security issue? We appreciate responsible disclosure and offer rewards through our bug bounty program.</p>
          <a href="mailto:security@examsaas.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,#FF5733,#FFB800)', color: '#081120', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
            Report Security Issue
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
