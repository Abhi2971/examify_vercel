import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const services = [
  { name: 'Web Application', status: 'operational', uptime: '99.99%' },
  { name: 'API Services', status: 'operational', uptime: '99.98%' },
  { name: 'AI Proctoring', status: 'operational', uptime: '99.95%' },
  { name: 'Database Servers', status: 'operational', uptime: '99.99%' },
  { name: 'CDN & Media', status: 'operational', uptime: '99.97%' },
  { name: 'Payment Gateway', status: 'operational', uptime: '99.99%' },
];

const incidents = [
  {
    date: 'March 25, 2026',
    title: 'Scheduled Maintenance Completed',
    status: 'resolved',
    description: 'Database optimization completed successfully with no downtime.',
    color: '#00C4B4',
  },
  {
    date: 'March 18, 2026',
    title: 'Minor API Latency',
    status: 'resolved',
    description: 'Increased response times resolved within 15 minutes.',
    color: '#FFB800',
  },
  {
    date: 'March 10, 2026',
    title: 'CDN Issues in South Region',
    status: 'resolved',
    description: 'Some users experienced slow media loading. Resolved by switching to backup CDN.',
    color: '#FF5733',
  },
];

const statusColors = {
  operational: '#00C4B4',
  degraded: '#FFB800',
  outage: '#FF5733',
};

export default function Status() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allOperational = services.every(s => s.status === 'operational');

  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", background: '#081120', minHeight: '100vh', color: '#F0F6FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .shimmer-text{background:linear-gradient(90deg,#00C4B4,#00E5FF,#FFB800,#FF5733,#00C4B4);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 5s linear infinite;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
        .badge-teal{background:rgba(0,196,180,0.12);color:#00C4B4;border:1px solid rgba(0,196,180,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .sdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,180,0.22),rgba(255,184,0,0.18),transparent);}
        .status-row{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:12px;}
        .pulse-dot{width:10px;height:10px;border-radius:50%;animation:pulse 2s ease-in-out infinite;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,196,180,0.12) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>System Status</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            <span className="shimmer-text">Status</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            Real-time status of all ExamSaaS services and infrastructure.
          </p>
          <p style={{ color: 'rgba(240,246,255,0.35)', fontSize: 13, marginTop: 12 }}>
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </section>

      {/* Overall Status */}
      <section style={{ padding: '20px 24px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: allOperational ? 'rgba(0,196,180,0.08)' : 'rgba(255,184,0,0.08)', border: `1px solid ${allOperational ? 'rgba(0,196,180,0.25)' : 'rgba(255,184,0,0.25)'}`, borderRadius: 20, padding: 32, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <div className="pulse-dot" style={{ background: allOperational ? '#00C4B4' : '#FFB800' }} />
              <h2 style={{ fontSize: 24, fontWeight: 800, color: allOperational ? '#00C4B4' : '#FFB800' }}>
                {allOperational ? 'All Systems Operational' : 'Partial Degradation'}
              </h2>
            </div>
            <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14 }}>
              {allOperational ? 'All services are running smoothly.' : 'Some services may be experiencing issues.'}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '20px 24px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Services</h2>
          {services.map((service) => (
            <div key={service.name} className="status-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColors[service.status] }} />
                <span style={{ fontWeight: 600 }}>{service.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ color: 'rgba(240,246,255,0.4)', fontSize: 13 }}>{service.uptime} uptime</span>
                <span style={{ color: statusColors[service.status], fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sdivider" />

      {/* Recent Incidents */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Recent Incidents</h2>
          {incidents.map((incident, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 16, borderLeft: `4px solid ${incident.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{incident.title}</h3>
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: `${incident.color}18`, color: incident.color, textTransform: 'uppercase' }}>{incident.status}</span>
              </div>
              <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, marginBottom: 8 }}>{incident.description}</p>
              <span style={{ color: 'rgba(240,246,255,0.35)', fontSize: 12 }}>{incident.date}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
