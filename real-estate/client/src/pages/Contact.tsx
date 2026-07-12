import React, { useState } from 'react';

export default function Contact() {
  const companyPhone = localStorage.getItem('companyPhone') || '+91 93449 12355';
  const companyTagline = localStorage.getItem('companyTagline') || 'Smart Real Estate Investment';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting Vishnu Realtors! We will get back to you shortly.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Contact Vishnu Realtors</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Get in touch with our team for enquiries and site visits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Contact Info Card */}
        <div style={{
          backgroundColor: '#0c1e35',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Vishnu Real Estate</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{companyTagline}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 600 }}>Phone Support</h4>
                <a href={`tel:${companyPhone}`} style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>{companyPhone}</a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 600 }}>Email Address</h4>
                <a href="mailto:info@vishnurealtors.com" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>info@vishnurealtors.com</a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--color-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 600 }}>Instagram Profile</h4>
                <a href="https://www.instagram.com/vishnu_realtors" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>@vishnu_realtors</a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Send Us a Message</h3>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="Your name" value={formData.name} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="Your email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" className="form-input" placeholder="Your mobile number" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea name="message" className="form-input" rows={4} placeholder="Type your requirements or messages here..." value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', alignSelf: 'flex-start' }}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
