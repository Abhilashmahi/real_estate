import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface CustomerLoginProps {
  onLogin: (userData: any) => void;
}

export default function CustomerLogin({ onLogin }: CustomerLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectMessage = (location.state as any)?.message;
  const successMessage = (location.state as any)?.successMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/customer/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.35s ease both' }}>
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '2rem 2rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #D4AF37, #F0D060)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Outfit,sans-serif', marginBottom: '0.25rem' }}>Welcome Back</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>Sign in to your Vishnu Realtors account</p>
          </div>

          {/* Form */}
          <div style={{ padding: '2rem' }}>

            {successMessage && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>{successMessage}</span>
              </div>
            )}

            {redirectMessage && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#92400E', fontSize: '0.85rem', fontWeight: 500 }}>{redirectMessage}</span>
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Email Address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="name@example.com" required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.18s' }}
                  onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Password</label>
                <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.18s' }}
                  onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                marginTop: '0.25rem', width: '100%', padding: '0.85rem',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 16px rgba(29,78,216,0.3)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                {loading ? 'Signing In...' : (
                  <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.87rem', color: '#64748B' }}>
              Don't have an account?{' '}
              <Link to="/customer/register" style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
            </p>

            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '1.25rem', paddingTop: '1rem', textAlign: 'center' }}>
              <Link to="/admin/login" style={{ color: '#94A3B8', fontSize: '0.8rem', textDecoration: 'underline' }}>Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
