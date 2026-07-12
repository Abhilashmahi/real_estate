import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface PublicNavbarProps {
  customerUser: any;
  onLogout: () => void;
}

export default function PublicNavbar({ customerUser, onLogout }: PublicNavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const companyLogo = localStorage.getItem('companyLogo');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    background: scrolled
      ? 'rgba(15,23,42,0.97)'
      : 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, transparent 100%)',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent',
    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
  };

  const activeLinkStyle: React.CSSProperties = {
    color: '#D4AF37',
    fontWeight: 700,
  };
  const defaultLinkStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'color 0.18s ease',
    padding: '0.25rem 0',
    position: 'relative',
  };

  return (
    <header style={navStyle}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '2rem',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {companyLogo
              ? <img src={companyLogo} alt="Logo" style={{ height: '28px', objectFit: 'contain', borderRadius: '4px' }} />
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            }
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit,sans-serif', lineHeight: 1.1 }}>Vishnu Realtors</div>
            <div style={{ color: '#D4AF37', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Smart Real Estate</div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/about', label: 'About' },
            { to: '/public-properties', label: 'Properties' },
            { to: '/contact', label: 'Contact' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({ ...defaultLinkStyle, ...(isActive ? activeLinkStyle : {}) })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {customerUser ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                Hi, <strong style={{ color: '#D4AF37' }}>{customerUser.name?.split(' ')[0]}</strong>
              </span>
              <Link to="/customer/dashboard" style={{
                padding: '0.4rem 0.9rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.18s',
              }}>Dashboard</Link>
              <button onClick={onLogout} style={{
                padding: '0.4rem 0.9rem',
                background: 'rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.25)',
                borderRadius: '6px',
                color: '#FCA5A5',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/customer/login" style={{
                padding: '0.4rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.18s',
              }}>Login</Link>
              <Link to="/customer/register" style={{
                padding: '0.4rem 1rem',
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                border: 'none',
                borderRadius: '6px',
                color: '#0F172A',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.18s',
                boxShadow: '0 2px 8px rgba(212,175,55,0.3)',
              }}>Register Free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
