import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const [counts, setCounts] = useState({ enquiries: 0, wishlist: 0, siteVisits: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [featuredProps, setFeaturedProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CU';

  const getStatusColor = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      New:         { bg: 'rgba(29,78,216,0.12)',  color: '#1D4ED8' },
      Contacted:   { bg: 'rgba(5,150,105,0.12)',  color: '#059669' },
      'Follow-up': { bg: 'rgba(217,119,6,0.12)',  color: '#D97706' },
      Closed:      { bg: 'rgba(100,116,139,0.12)',color: '#64748B' },
    };
    return map[status] || { bg: '#F1F5F9', color: '#64748B' };
  };

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${token}` };
    Promise.all([
      fetch('http://localhost:5000/api/enquiries', { headers }).then(r => r.ok ? r.json() : []),
      fetch('http://localhost:5000/api/wishlist',  { headers }).then(r => r.ok ? r.json() : []),
      fetch('http://localhost:5000/api/site-visits', { headers }).then(r => r.ok ? r.json() : []),
      fetch('http://localhost:5000/api/properties').then(r => r.ok ? r.json() : []),
    ]).then(([enqs, wish, visits, props]) => {
      setCounts({ enquiries: enqs.length, wishlist: wish.length, siteVisits: visits.length });
      setRecentEnquiries(enqs.slice(0, 4));
      setFeaturedProps(props.slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Welcome Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'rgba(212,175,55,0.06)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Customer Portal</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Outfit,sans-serif', marginBottom: '0.25rem' }}>
            Welcome back, {user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>Here's your real estate activity overview.</p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F0D060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', border: '3px solid rgba(255,255,255,0.1)' }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'My Enquiries', value: counts.enquiries, color: '#1D4ED8', bg: 'rgba(29,78,216,0.06)', link: '/customer/enquiries', emoji: '💬' },
          { label: 'Saved Properties', value: counts.wishlist, color: '#DC2626', bg: 'rgba(220,38,38,0.06)', link: '/customer/wishlist', emoji: '❤️' },
          { label: 'Site Visits', value: counts.siteVisits, color: '#059669', bg: 'rgba(5,150,105,0.06)', link: '/customer/site-visits', emoji: '📅' },
        ].map((stat, i) => (
          <Link key={i} to={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{stat.emoji}</div>
              <div style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontWeight: 900, fontSize: '2.25rem', fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>{stat.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { to: '/public-properties', label: '🏘️ Browse Properties', style: { background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#0F172A', border: 'none' } },
            { to: '/customer/wishlist',  label: '❤️ My Wishlist', style: { background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' } },
            { to: '/customer/enquiries', label: '💬 My Enquiries', style: { background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' } },
            { to: '/customer/profile',   label: '👤 Edit Profile', style: { background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' } },
          ].map(btn => (
            <Link key={btn.to} to={btn.to} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.6rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', ...btn.style }}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Recent Enquiries */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Recent Enquiries</h2>
            <Link to="/customer/enquiries" style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <p>No enquiries yet. <Link to="/public-properties" style={{ color: '#1D4ED8' }}>Browse properties</Link> to enquire.</p>
              </div>
            ) : recentEnquiries.map(enq => {
              const sc = getStatusColor(enq.status);
              return (
                <div key={enq.id} style={{ padding: '0.875rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>{enq.propertyName || 'General Enquiry'}</span>
                    <span style={{ background: sc.bg, color: sc.color, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{enq.status}</span>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN') : ''}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Properties */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Featured Properties</h2>
            <Link to="/public-properties" style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {featuredProps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                <p>No properties available yet.</p>
              </div>
            ) : featuredProps.map(prop => {
              const cover = prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60';
              return (
                <Link key={prop.id} to={`/properties/${prop.id}`} style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9', textDecoration: 'none', transition: 'all 0.18s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F8FAFC'; }}>
                  <img src={cover} alt={prop.title} style={{ width: '64px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}/>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.2rem' }}>📍 {prop.location}</div>
                    <div style={{ color: '#B8960C', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>₹{prop.price}L</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
