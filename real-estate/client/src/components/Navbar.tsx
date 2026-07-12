import React from 'react';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <header style={{
      height: '56px',
      background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.5rem',
      flexShrink: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}/>
        <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>System Online · {timeStr}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
          Logged in as <strong style={{ color: '#0F172A' }}>{user.name || 'Admin'}</strong>
        </span>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.8rem', color: '#0F172A',
        }}>
          {(user.name || 'A').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
