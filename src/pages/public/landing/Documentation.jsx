import Header from './Header';
import Footer from './Footer';

const docSections = [
  {
    title: 'Getting Started',
    icon: '🚀',
    color: '#00C4B4',
    articles: [
      'Quick Start Guide',
      'Creating Your Account',
      'Platform Overview',
      'First Exam Setup',
    ],
  },
  {
    title: 'Exam Management',
    icon: '📝',
    color: '#FFB800',
    articles: [
      'Creating Exams',
      'Question Types',
      'Scheduling Exams',
      'Exam Settings',
      'Grading Configuration',
    ],
  },
  {
    title: 'AI Proctoring',
    icon: '🔒',
    color: '#FF5733',
    articles: [
      'Proctoring Overview',
      'Setup Requirements',
      'Violation Types',
      'Reviewing Sessions',
    ],
  },
  {
    title: 'Question Bank',
    icon: '📚',
    color: '#00E5FF',
    articles: [
      'Organizing Questions',
      'AI Question Generation',
      'Importing Questions',
      'Question Analytics',
    ],
  },
  {
    title: 'Analytics & Reports',
    icon: '📊',
    color: '#00C4B4',
    articles: [
      'Dashboard Overview',
      'Student Performance',
      'Exam Analytics',
      'Export Reports',
    ],
  },
  {
    title: 'API Reference',
    icon: '⚡',
    color: '#FFB800',
    articles: [
      'Authentication',
      'REST API Endpoints',
      'Webhooks',
      'Rate Limits',
    ],
  },
];

export default function Documentation() {
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
        .doc-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;transition:all 0.3s;}
        .doc-card:hover{transform:translateY(-4px);border-color:rgba(0,196,180,0.25);}
        .doc-link{display:block;padding:10px 0;color:rgba(240,246,255,0.6);font-size:14px;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.05);transition:all 0.2s;}
        .doc-link:hover{color:#00C4B4;padding-left:8px;}
        .doc-link:last-child{border-bottom:none;}
        .search-input{width:100%;padding:16px 20px 16px 52px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#F0F6FF;font-size:16px;outline:none;font-family:inherit;transition:all 0.3s;}
        .search-input:focus{border-color:#00C4B4;background:rgba(0,196,180,0.06);}
        .search-input::placeholder{color:rgba(240,246,255,0.4);}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,229,255,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-cyan" style={{ marginBottom: 20 }}>Docs</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            <span className="shimmer-text">Documentation</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
            Everything you need to know about using ExamSaaS effectively.
          </p>
          
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} width="20" height="20" fill="none" stroke="rgba(240,246,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search documentation..." className="search-input" />
          </div>
        </div>
      </section>

      {/* Documentation Grid */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {docSections.map((section) => (
            <div key={section.title} className="doc-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${section.color}15`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {section.icon}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{section.title}</h2>
              </div>
              <div>
                {section.articles.map((article) => (
                  <a key={article} href="#" className="doc-link">{article}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
