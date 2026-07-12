import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const companyPhone = localStorage.getItem('companyPhone') || '+91 93449 12355';
  const companyTagline = localStorage.getItem('companyTagline') || 'Smart Real Estate Investment';
  const [propCount, setPropCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => setPropCount(data.length))
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '88vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: '-64px',
        paddingTop: '64px',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,175,55,0.06) 0%, transparent 60%),
                            radial-gradient(circle at 80% 20%, rgba(29,78,216,0.1) 0%, transparent 50%)`,
        }}/>
        {/* Gold accent line */}
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '4px', height: '200px',
          background: 'linear-gradient(180deg, transparent, #D4AF37, transparent)',
          borderRadius: '4px',
        }}/>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px' }}>
            {/* Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', animation: 'pulse-gold 2s infinite' }}/>
              <span style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Vishnu Realtors — Premium Properties
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
              {companyTagline}<br/>
              <span style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Made Simple.
              </span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}>
              Discover premium plots, residential homes, and land investment projects in Coimbatore and beyond — with clear documentation and excellent appreciation potential.
            </p>

            {/* Stats row */}
            {propCount !== null && (
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
                {[
                  { value: propCount, label: 'Properties Listed' },
                  { value: '100%', label: 'Legal Clearance' },
                  { value: '10+', label: 'Years Experience' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: '1.75rem', fontFamily: 'Outfit,sans-serif' }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/public-properties" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                color: '#0F172A', fontWeight: 700, fontSize: '0.95rem',
                borderRadius: '8px', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
                transition: 'all 0.2s ease',
              }}>
                Explore Properties
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href={`tel:${companyPhone}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 600, fontSize: '0.95rem',
                borderRadius: '8px', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.13 12.6 19.79 19.79 0 012.06 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                {companyPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <hr className="gold-divider"/>

      {/* ── Features Strip ── */}
      <section style={{ background: '#fff', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🏗️', title: 'Plots & Land', desc: 'Premium NA plots with full legal clearance' },
              { icon: '🏡', title: 'Residential', desc: 'Villas, apartments, and houses' },
              { icon: '📊', title: 'Investment Land', desc: 'High-appreciation land bank projects' },
              { icon: '🔑', title: 'Clear Title', desc: 'All properties with verified documentation' },
            ].map((f, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F172A' }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(212,175,55,0.06), transparent 60%)' }}/>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Outfit,sans-serif', marginBottom: '0.5rem' }}>
              Ready for a personalized site visit?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              Our experts will guide you to the perfect property investment.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`tel:${companyPhone}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
              color: '#0F172A', fontWeight: 700, fontSize: '0.9rem',
              borderRadius: '8px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.13 12.6 19.79 19.79 0 012.06 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              {companyPhone}
            </a>
            <Link to="/customer/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              borderRadius: '8px', textDecoration: 'none',
            }}>Book a Free Visit</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
