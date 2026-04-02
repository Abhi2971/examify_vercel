import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: 'mail', label: 'Email', value: 'hello@examsaas.com', href: 'mailto:hello@examsaas.com', color: '#00C4B4' },
    { icon: 'phone', label: 'Phone', value: '+91 80 4567 8900', href: 'tel:+918045678900', color: '#FFB800' },
    { icon: 'location', label: 'Office', value: 'Bangalore, Karnataka, India', href: '#', color: '#FF5733' },
  ];

  const icons = {
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
  };

  return (
    <div style={{ fontFamily: "'Sora','DM Sans',sans-serif", background: '#081120', minHeight: '100vh', color: '#F0F6FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .shimmer-text{background:linear-gradient(90deg,#00C4B4,#00E5FF,#FFB800,#FF5733,#00C4B4);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 5s linear infinite;}
        .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
        .sdivider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,196,180,0.22),rgba(255,184,0,0.18),transparent);}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
        .badge-teal{background:rgba(0,196,180,0.12);color:#00C4B4;border:1px solid rgba(0,196,180,0.25);}
        .grid-bg{position:absolute;inset:0;opacity:0.028;background-image:linear-gradient(rgba(0,196,180,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,180,1) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);}
        .contact-input{width:100%;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#F0F6FF;font-family:inherit;font-size:14px;transition:all 0.3s;outline:none;}
        .contact-input:focus{border-color:#00C4B4;background:rgba(0,196,180,0.06);}
        .contact-input::placeholder{color:rgba(240,246,255,0.35);}
        .btn-p{background:linear-gradient(135deg,#00C4B4,#00E5FF);color:#081120;font-weight:700;border:none;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;width:100%;padding:14px 28px;border-radius:12px;font-size:15px;}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,196,180,0.45);}
        .btn-p:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(0,196,180,0.12) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>Contact Us</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Get in <span className="shimmer-text">Touch</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>
          
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Let's talk</h2>
            <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
              Whether you're an institution looking to transform your examination process or have questions about our platform, we're here to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
              {contactInfo.map((item) => (
                <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, textDecoration: 'none', transition: 'all 0.3s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" fill="none" stroke={item.color} strokeWidth="1.8" viewBox="0 0 24 24">{icons[item.icon]}</svg>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(240,246,255,0.45)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: '#F0F6FF', fontSize: 15, fontWeight: 600 }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Office Hours */}
            <div style={{ padding: 24, background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.15)', borderRadius: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#FFB800' }}>Office Hours</h3>
              <div style={{ color: 'rgba(240,246,255,0.6)', fontSize: 14, lineHeight: 1.8 }}>
                Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                Saturday: 10:00 AM - 2:00 PM IST<br />
                Sunday: Closed
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 36 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Send a message</h2>
            <p style={{ color: 'rgba(240,246,255,0.45)', fontSize: 14, marginBottom: 28 }}>Fill out the form below and we'll get back to you within 24 hours.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,196,180,0.15)', border: '2px solid #00C4B4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" fill="none" stroke="#00C4B4" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: 'rgba(240,246,255,0.5)' }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input type="text" placeholder="Your Name" className="contact-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <input type="email" placeholder="Your Email" className="contact-input" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <input type="text" placeholder="Subject" className="contact-input" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                <textarea placeholder="Your Message" className="contact-input" rows={5} required style={{ resize: 'vertical', minHeight: 120 }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                <button type="submit" className="btn-p">
                  Send Message
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
