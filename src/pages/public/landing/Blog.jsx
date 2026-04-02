import Header from './Header';
import Footer from './Footer';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Online Examinations in India',
    excerpt: 'Exploring how AI and technology are transforming the way educational institutions conduct assessments.',
    date: 'Mar 28, 2026',
    readTime: '5 min read',
    category: 'Industry',
    color: '#00C4B4',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Best Practices for Creating Effective Online Exams',
    excerpt: 'A comprehensive guide to designing assessments that accurately measure student learning outcomes.',
    date: 'Mar 22, 2026',
    readTime: '8 min read',
    category: 'Guide',
    color: '#FFB800',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'How AI Proctoring Maintains Exam Integrity',
    excerpt: 'Understanding the technology behind automated proctoring and how it prevents cheating.',
    date: 'Mar 15, 2026',
    readTime: '6 min read',
    category: 'Technology',
    color: '#FF5733',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Case Study: Delhi University\'s Digital Transformation',
    excerpt: 'How one of India\'s largest universities successfully transitioned to online examinations.',
    date: 'Mar 10, 2026',
    readTime: '10 min read',
    category: 'Case Study',
    color: '#00E5FF',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Understanding Analytics for Better Learning Outcomes',
    excerpt: 'Leveraging examination data to identify gaps and improve teaching strategies.',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
    category: 'Analytics',
    color: '#00C4B4',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Accessibility in Online Examinations',
    excerpt: 'Ensuring inclusive assessment experiences for students with different abilities.',
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    category: 'Accessibility',
    color: '#FFB800',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
  },
];

const categories = ['All', 'Industry', 'Guide', 'Technology', 'Case Study', 'Analytics', 'Accessibility'];

export default function Blog() {
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
        .blog-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;transition:all 0.3s;cursor:pointer;}
        .blog-card:hover{transform:translateY(-6px);border-color:rgba(0,196,180,0.25);box-shadow:0 20px 50px rgba(0,0,0,0.3);}
        .blog-card img{width:100%;height:180px;object-fit:cover;transition:transform 0.4s;}
        .blog-card:hover img{transform:scale(1.05);}
        .cat-btn{padding:8px 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(240,246,255,0.6);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.25s;font-family:inherit;}
        .cat-btn:hover,.cat-btn.active{background:rgba(0,196,180,0.12);border-color:rgba(0,196,180,0.3);color:#00C4B4;}
      `}</style>

      <Header />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 60px', textAlign: 'center' }}>
        <div className="orb" style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle,rgba(255,184,0,0.1) 0%,transparent 70%)' }} />
        <div className="grid-bg" />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <span className="badge badge-gold" style={{ marginBottom: 20 }}>Blog</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20 }}>
            Insights & <span className="shimmer-text">Updates</span>
          </h1>
          <p style={{ color: 'rgba(240,246,255,0.55)', fontSize: 17, lineHeight: 1.75 }}>
            Stay updated with the latest trends in online education, examination technology, and best practices.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {categories.map((cat, i) => (
            <button key={cat} className={`cat-btn ${i === 0 ? 'active' : ''}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section style={{ padding: '20px 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div style={{ overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${post.color}18`, color: post.color, border: `1px solid ${post.color}30` }}>{post.category}</span>
                  <span style={{ color: 'rgba(240,246,255,0.35)', fontSize: 12 }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(240,246,255,0.35)', fontSize: 12 }}>{post.date}</span>
                  <span style={{ color: '#00C4B4', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Read More
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', background: 'rgba(0,196,180,0.06)', border: '1px solid rgba(0,196,180,0.15)', borderRadius: 24, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Subscribe to our Newsletter</h2>
          <p style={{ color: 'rgba(240,246,255,0.5)', fontSize: 15, marginBottom: 28 }}>Get the latest articles and updates delivered to your inbox.</p>
          <div style={{ display: 'flex', gap: 12, maxWidth: 420, margin: '0 auto' }}>
            <input type="email" placeholder="Enter your email" style={{ flex: 1, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#F0F6FF', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
            <button style={{ padding: '14px 24px', background: 'linear-gradient(135deg,#00C4B4,#00E5FF)', color: '#081120', fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
