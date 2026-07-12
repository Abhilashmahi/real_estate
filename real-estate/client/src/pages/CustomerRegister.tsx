import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required.';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid 10-digit mobile number.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.name, email: formData.email, mobile: formData.phone, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/customer/login', { state: { successMessage: 'Registration successful! Please login to continue.' } });
      } else {
        setServerError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '0.75rem 1rem',
    border: `1.5px solid ${errors[field] ? '#DC2626' : '#E2E8F0'}`,
    borderRadius: '8px', fontSize: '0.9rem',
    background: '#fff', color: '#0F172A',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.18s',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '460px', animation: 'fadeInUp 0.35s ease both' }}>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

          {/* Card Header */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '2rem 2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #D4AF37, #F0D060)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Outfit,sans-serif', marginBottom: '0.25rem' }}>Create Account</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>Join Vishnu Realtors — it's free</p>
          </div>

          {/* Form */}
          <div style={{ padding: '2rem' }}>
            {serverError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: 500 }}>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
              {[
                { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Rajesh Kumar' },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
                { name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '9876543210' },
                { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
                { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
              ].map(field => (
                <div key={field.name}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    style={inputStyle(field.name)}
                    onFocus={e => { e.target.style.borderColor = errors[field.name] ? '#DC2626' : '#1D4ED8'; e.target.style.boxShadow = `0 0 0 3px ${errors[field.name] ? 'rgba(220,38,38,0.12)' : 'rgba(29,78,216,0.12)'}`; }}
                    onBlur={e => { e.target.style.boxShadow = 'none'; if (!errors[field.name]) e.target.style.borderColor = '#E2E8F0'; }}
                  />
                  {errors[field.name] && (
                    <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.5rem',
                  width: '100%', padding: '0.85rem',
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  color: '#0F172A', fontWeight: 700, fontSize: '0.95rem',
                  border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(212,175,55,0.35)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                {loading ? 'Creating Account...' : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.87rem', color: '#64748B' }}>
              Already have an account?{' '}
              <Link to="/customer/login" style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
