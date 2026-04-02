import Header from './Header';
import Footer from './Footer';

const positions = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    color: '#00C4B4',
    description: 'Build and scale our core examination platform using React, Node.js, and MongoDB.',
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI & Proctoring',
    location: 'Bangalore',
    type: 'Full-time',
    color: '#FFB800',
    description: 'Develop AI models for automated proctoring, cheating detection, and question generation.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    color: '#FF5733',
    description: 'Create intuitive and beautiful experiences for educators and students across our platform.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Bangalore',
    type: 'Full-time',
    color: '#00E5FF',
    description: 'Manage our cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Mumbai / Delhi',
    type: 'Full-time',
    color: '#00C4B4',
    description: 'Help educational institutions succeed with ExamSaaS through onboarding and support.',
  },
  {
    title: 'Technical Writer',
    department: 'Documentation',
    location: 'Remote',
    type: 'Contract',
    color: '#FFB800',
    description: 'Create comprehensive documentation, tutorials, and help content for our users.',
  },
];

const benefits = [
  { icon: '💰', title: 'Competitive Salary', description: 'Industry-leading compensation with equity options' },
  { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive coverage for you and your family' },
  { icon: '🏠', title: 'Remote Friendly', description: 'Work from anywhere with flexible hours' },
  { icon: '📚', title: 'Learning Budget', description: '₹1L annual budget for courses and conferences' },
  { icon: '🌴', title: 'Unlimited PTO', description: 'Take the time you need to recharge' },
  { icon: '💻', title: 'Best Equipment', description: 'MacBook Pro and all the tools you need' },
];

const values = [
  { title: 'Impact First', description: 'We build products that transform education for millions of students across India.', color: '#00C4B4' },
  { title: 'Move Fast', description: 'We ship quickly, iterate based on feedback, and aren\'t afraid to take bold bets.', color: '#FFB800' },
  { title: 'Stay Curious', description: 'We encourage continuous learning and experimentation in everything we do.', color: '#FF5733' },
  { title: 'Win Together', description: 'We succeed as a team, celebrate wins together, and support each other.', color: '#00E5FF' },
];

export default function Careers() {
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
        .job-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;transition:all 0.3s;}
        .job-card:hover{transform:translateY(-4px);border-color:rgba(0,196,180,0.25);box-shadow:0 16px 40px rgba(0,0,0,0.25);}
        .btn-p{background:linear-gradient(135deg,#00C4B4,#00E5FF);color:#081120;font-weight:700;border:none;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:inherit;padding:12px 24px;border-radius:12px;font-size:14px;}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,196,180,0.45);}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 80px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,87,51,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-coral" style={{ marginBottom: 20 }}>We're Hiring</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Join Our <span className="shimmer-text">Mission</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
            Help us transform education for millions of students across India. We're building the future of online examinations.
          </p>
          <a href="#positions" className="btn-p">View Open Positions</a>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {values.map((value) => (
              <div key={value.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, borderTop: `3px solid ${value.color}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: value.color }}>{value.title}</h3>
                <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* Benefits */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>Benefits & Perks</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', textAlign: 'center', marginBottom: 48 }}>We take care of our team so they can focus on building great products.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {benefits.map((benefit) => (
              <div key={benefit.title} style={{ display: 'flex', gap: 16, padding: 24, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <div style={{ fontSize: 32 }}>{benefit.icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{benefit.title}</h3>
                  <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sdivider" />

      {/* Open Positions */}
      <section id="positions" style={{ padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>Open Positions</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', textAlign: 'center', marginBottom: 48 }}>Find your next opportunity with us.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {positions.map((job) => (
              <div key={job.title} className="job-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</h3>
                      <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${job.color}18`, color: job.color }}>{job.type}</span>
                    </div>
                    <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, marginBottom: 12 }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ color: 'rgba(240,246,255,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {job.department}
                      </span>
                      <span style={{ color: 'rgba(240,246,255,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <a href={`mailto:careers@examsaas.com?subject=Application for ${job.title}`} className="btn-p" style={{ padding: '10px 20px', fontSize: 13 }}>Apply Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Don't see a fit?</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.</p>
          <a href="mailto:careers@examsaas.com" className="btn-p">Send Your Resume</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
