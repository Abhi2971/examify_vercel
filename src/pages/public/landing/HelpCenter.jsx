import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: '🚀', color: '#00C4B4' },
  { id: 'exams', name: 'Creating Exams', icon: '📝', color: '#FFB800' },
  { id: 'proctoring', name: 'AI Proctoring', icon: '🔒', color: '#FF5733' },
  { id: 'students', name: 'For Students', icon: '🎓', color: '#00E5FF' },
  { id: 'billing', name: 'Billing & Plans', icon: '💳', color: '#00C4B4' },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧', color: '#FFB800' },
];

const articles = {
  'getting-started': [
    { title: 'How to create your first account', views: '2.5k' },
    { title: 'Setting up your institution profile', views: '1.8k' },
    { title: 'Inviting teachers and administrators', views: '1.2k' },
    { title: 'Understanding user roles and permissions', views: '980' },
    { title: 'Quick start guide for new users', views: '3.1k' },
  ],
  'exams': [
    { title: 'Creating a new examination', views: '4.2k' },
    { title: 'Adding questions to your exam', views: '3.8k' },
    { title: 'Using the AI question generator', views: '2.9k' },
    { title: 'Setting exam schedules and time limits', views: '2.1k' },
    { title: 'Configuring exam security settings', views: '1.7k' },
  ],
  'proctoring': [
    { title: 'How AI proctoring works', views: '5.1k' },
    { title: 'Camera and microphone requirements', views: '3.2k' },
    { title: 'Understanding violation flags', views: '2.4k' },
    { title: 'Reviewing proctoring reports', views: '1.9k' },
    { title: 'Browser lockdown feature explained', views: '1.5k' },
  ],
  'students': [
    { title: 'How to join an exam', views: '6.3k' },
    { title: 'System requirements for taking exams', views: '4.1k' },
    { title: 'What to do during technical issues', views: '2.8k' },
    { title: 'Viewing your results and feedback', views: '2.2k' },
    { title: 'Proctoring guidelines for students', views: '3.5k' },
  ],
  'billing': [
    { title: 'Understanding our pricing plans', views: '1.9k' },
    { title: 'How to upgrade your subscription', views: '1.4k' },
    { title: 'Managing payment methods', views: '890' },
    { title: 'Downloading invoices and receipts', views: '760' },
    { title: 'Cancellation and refund policy', views: '1.1k' },
  ],
  'troubleshooting': [
    { title: 'Common login issues and solutions', views: '3.4k' },
    { title: 'Camera not working during exam', views: '2.7k' },
    { title: 'Exam submission problems', views: '2.1k' },
    { title: 'Slow loading or performance issues', views: '1.6k' },
    { title: 'Contact support for urgent issues', views: '1.3k' },
  ],
};

const faqs = [
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.' },
  { q: 'Can I take an exam on my phone?', a: 'We recommend using a laptop or desktop for the best experience. Mobile devices are supported but may have limited features.' },
  { q: 'What happens if I lose internet during an exam?', a: 'Your answers are auto-saved every 30 seconds. When you reconnect, you can resume from where you left off.' },
  { q: 'How do I contact support?', a: 'Email us at support@examsaas.com or use the live chat feature available on the bottom right of the screen.' },
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

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
        .sdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,180,0.22),rgba(255,184,0,0.18),transparent);}
        .search-input{width:100%;padding:16px 20px 16px 52px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#F0F6FF;font-size:16px;outline:none;font-family:inherit;transition:all 0.3s;}
        .search-input:focus{border-color:#00C4B4;background:rgba(0,196,180,0.06);}
        .search-input::placeholder{color:rgba(240,246,255,0.4);}
        .cat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;cursor:pointer;transition:all 0.3s;text-align:center;}
        .cat-card:hover,.cat-card.active{transform:translateY(-4px);border-color:rgba(0,196,180,0.3);background:rgba(0,196,180,0.08);}
        .article-item{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:all 0.2s;}
        .article-item:hover{padding-left:8px;}
        .article-item:last-child{border-bottom:none;}
        .faq-item{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:12px;overflow:hidden;}
        .faq-q{padding:18px 20px;cursor:pointer;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
        .faq-a{padding:0 20px 18px;color:rgba(240,246,255,0.55);font-size:14px;line-height:1.75;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,229,255,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-cyan" style={{ marginBottom: 20 }}>Support</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Help <span className="shimmer-text">Center</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
            Find answers to your questions and learn how to get the most out of ExamSaaS.
          </p>
          
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }} width="20" height="20" fill="none" stroke="rgba(240,246,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search for help articles..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '20px 24px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`cat-card ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: activeCategory === cat.id ? '#00C4B4' : '#F0F6FF' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="sdivider" />

      {/* Articles */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
            {categories.find(c => c.id === activeCategory)?.name} Articles
          </h2>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '8px 24px' }}>
            {articles[activeCategory]?.map((article, i) => (
              <div key={i} className="article-item">
                <span style={{ color: 'rgba(240,246,255,0.75)', fontSize: 15 }}>{article.title}</span>
                <span style={{ color: 'rgba(240,246,255,0.3)', fontSize: 12 }}>{article.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* FAQ */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'rgba(240,246,255,0.45)', textAlign: 'center', marginBottom: 32 }}>Quick answers to common questions</p>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">
                <span>{faq.q}</span>
                <svg width="16" height="16" fill="none" stroke="rgba(240,246,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', background: 'rgba(0,196,180,0.06)', border: '1px solid rgba(0,196,180,0.15)', borderRadius: 24, padding: '40px 32px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Still need help?</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, marginBottom: 24 }}>Our support team is available 24/7 to assist you.</p>
          <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,#00C4B4,#00E5FF)', color: '#081120', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
            Contact Support
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
