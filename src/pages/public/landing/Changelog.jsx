import Header from './Header';
import Footer from './Footer';

const releases = [
  {
    version: '2.5.0',
    date: 'March 28, 2026',
    type: 'major',
    color: '#00C4B4',
    changes: [
      { type: 'feature', text: 'AI-powered question generation from PDF documents' },
      { type: 'feature', text: 'Real-time collaboration for exam creation' },
      { type: 'improvement', text: 'Enhanced proctoring accuracy with new ML models' },
      { type: 'improvement', text: 'Faster exam loading times (40% improvement)' },
      { type: 'fix', text: 'Fixed timezone issues in exam scheduling' },
    ],
  },
  {
    version: '2.4.2',
    date: 'March 15, 2026',
    type: 'patch',
    color: '#FFB800',
    changes: [
      { type: 'fix', text: 'Resolved camera permission issues on Safari' },
      { type: 'fix', text: 'Fixed export functionality for large result sets' },
      { type: 'improvement', text: 'Better error messages for network issues' },
    ],
  },
  {
    version: '2.4.0',
    date: 'March 1, 2026',
    type: 'minor',
    color: '#00E5FF',
    changes: [
      { type: 'feature', text: 'New analytics dashboard with AI insights' },
      { type: 'feature', text: 'Bulk student import via Excel/CSV' },
      { type: 'feature', text: 'Custom certificate designer' },
      { type: 'improvement', text: 'Redesigned mobile experience' },
      { type: 'fix', text: 'Fixed notification delivery delays' },
    ],
  },
  {
    version: '2.3.0',
    date: 'February 15, 2026',
    type: 'minor',
    color: '#FF5733',
    changes: [
      { type: 'feature', text: 'Multi-language support (Hindi, Tamil, Telugu, Bengali)' },
      { type: 'feature', text: 'Integrated payment gateway for exam fees' },
      { type: 'improvement', text: 'Improved accessibility features' },
      { type: 'fix', text: 'Fixed session timeout issues' },
    ],
  },
  {
    version: '2.2.0',
    date: 'February 1, 2026',
    type: 'minor',
    color: '#00C4B4',
    changes: [
      { type: 'feature', text: 'Advanced question bank with tagging' },
      { type: 'feature', text: 'Exam templates for quick creation' },
      { type: 'improvement', text: 'Enhanced security with browser lockdown' },
      { type: 'fix', text: 'Resolved audio sync issues in proctoring' },
    ],
  },
];

const typeColors = {
  feature: '#00C4B4',
  improvement: '#FFB800',
  fix: '#FF5733',
};

export default function Changelog() {
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
        .release-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px;margin-bottom:24px;position:relative;}
        .change-tag{padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,184,0,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-gold" style={{ marginBottom: 20 }}>Product</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            <span className="shimmer-text">Changelog</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            Stay up to date with all the latest features, improvements, and fixes to ExamSaaS.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {releases.map((release) => (
            <div key={release.version} className="release-card" style={{ borderLeft: `4px solid ${release.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: release.color }}>v{release.version}</span>
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: `${release.color}18`, color: release.color, textTransform: 'uppercase' }}>{release.type}</span>
                <span style={{ color: 'rgba(240,246,255,0.4)', fontSize: 13 }}>{release.date}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {release.changes.map((change, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span className="change-tag" style={{ background: `${typeColors[change.type]}18`, color: typeColors[change.type] }}>{change.type}</span>
                    <span style={{ color: 'rgba(240,246,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
