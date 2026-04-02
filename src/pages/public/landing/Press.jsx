import Header from './Header';
import Footer from './Footer';

const pressReleases = [
  {
    date: 'March 20, 2026',
    title: 'ExamSaaS Raises $15M Series A to Transform Online Education in India',
    excerpt: 'Funding led by Sequoia India will accelerate expansion across universities and schools.',
    category: 'Funding',
    color: '#00C4B4',
  },
  {
    date: 'March 5, 2026',
    title: 'ExamSaaS Partners with National Testing Agency for JEE Mock Tests',
    excerpt: 'Strategic partnership to provide practice examinations for millions of engineering aspirants.',
    category: 'Partnership',
    color: '#FFB800',
  },
  {
    date: 'February 15, 2026',
    title: 'ExamSaaS Surpasses 500 Institutional Clients Milestone',
    excerpt: 'Rapid adoption by universities and schools across 20 Indian states.',
    category: 'Milestone',
    color: '#FF5733',
  },
  {
    date: 'January 28, 2026',
    title: 'New AI Proctoring System Achieves 99.5% Accuracy',
    excerpt: 'Proprietary machine learning models set new industry standard for exam integrity.',
    category: 'Product',
    color: '#00E5FF',
  },
];

const mediaKit = [
  { name: 'Logo Pack', format: 'ZIP', size: '2.4 MB' },
  { name: 'Brand Guidelines', format: 'PDF', size: '1.8 MB' },
  { name: 'Product Screenshots', format: 'ZIP', size: '12 MB' },
  { name: 'Executive Photos', format: 'ZIP', size: '8.5 MB' },
];

const coverage = [
  { outlet: 'Economic Times', title: 'EdTech startup ExamSaaS disrupting traditional examinations' },
  { outlet: 'YourStory', title: 'How ExamSaaS is making online exams cheat-proof with AI' },
  { outlet: 'Inc42', title: 'ExamSaaS among top 10 EdTech startups to watch in 2026' },
  { outlet: 'Mint', title: 'The future of examinations is digital, says ExamSaaS founder' },
];

export default function Press() {
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
        .sdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,180,0.22),rgba(255,184,0,0.18),transparent);}
        .press-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;transition:all 0.3s;cursor:pointer;}
        .press-card:hover{transform:translateY(-4px);border-color:rgba(0,196,180,0.25);}
        .media-item{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:10px;transition:all 0.3s;cursor:pointer;}
        .media-item:hover{background:rgba(0,196,180,0.06);border-color:rgba(0,196,180,0.2);}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,87,51,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-coral" style={{ marginBottom: 20 }}>Media</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Press & <span className="shimmer-text">Media</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            News, press releases, and media resources about ExamSaaS.
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section style={{ padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Press Releases</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
            {pressReleases.map((pr, i) => (
              <div key={i} className="press-card" style={{ borderTop: `3px solid ${pr.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${pr.color}18`, color: pr.color }}>{pr.category}</span>
                  <span style={{ color: 'rgba(240,246,255,0.35)', fontSize: 12 }}>{pr.date}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{pr.title}</h3>
                <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, lineHeight: 1.65 }}>{pr.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* Media Coverage */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Media Coverage</h2>
          {coverage.map((item, i) => (
            <div key={i} className="media-item">
              <div>
                <div style={{ color: '#00C4B4', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{item.outlet}</div>
                <div style={{ color: 'rgba(240,246,255,0.75)', fontSize: 14 }}>{item.title}</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="rgba(240,246,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </div>
          ))}
        </div>
      </section>

      <div className="sdivider" />

      {/* Media Kit */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>Media Kit</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', textAlign: 'center', marginBottom: 32 }}>Download official brand assets and resources.</p>
          {mediaKit.map((item, i) => (
            <div key={i} className="media-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,196,180,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" fill="none" stroke="#00C4B4" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ color: 'rgba(240,246,255,0.4)', fontSize: 12 }}>{item.format} • {item.size}</div>
                </div>
              </div>
              <span style={{ color: '#00C4B4', fontSize: 13, fontWeight: 600 }}>Download</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 32px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Media Inquiries</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, marginBottom: 24 }}>For press inquiries, interviews, or media partnerships, please contact us.</p>
          <a href="mailto:press@examsaas.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,#00C4B4,#00E5FF)', color: '#081120', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
            press@examsaas.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
