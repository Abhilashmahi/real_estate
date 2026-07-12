import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid credentials.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(212,175,55,0.04)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '200px', height: '200px', background: 'rgba(29,78,216,0.08)', borderRadius: '50%' }}/>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '380px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #D4AF37, #F0D060)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>Vishnu Realtors</div>
              <div style={{ color: '#D4AF37', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Portal</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Smart Real<br/>
            <span style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Estate CRM</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Manage properties, enquiries, and customer relationships — all in one place.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '🏘️', text: 'Add and manage properties' },
              { icon: '💬', text: 'Track customer enquiries' },
              { icon: '📊', text: 'Real-time analytics & reports' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{ width: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#0F172A', marginBottom: '0.35rem' }}>Admin Login</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>Enter your credentials to access the CRM.</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ color: '#DC2626', fontSize: '0.82rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Email Address</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="admin@example.com" required
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#fff', transition: 'border-color 0.18s' }}
                onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" required
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#fff', transition: 'border-color 0.18s' }}
                onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem', width: '100%', padding: '0.85rem',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0F172A, #1E293B)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 12px rgba(15,23,42,0.3)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              {loading ? 'Logging in...' : (
                <>
                  Login to Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>📧 admin@example.com</div>
            <div style={{ fontSize: '0.82rem', color: '#475569' }}>🔑 password</div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: '#94A3B8' }}>
            © 2026 Vishnu Realtors. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
