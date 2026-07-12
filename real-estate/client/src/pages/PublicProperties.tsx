import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (type !== 'All') params.set('type', type);
      if (maxPrice) params.set('maxPrice', maxPrice);
      const res = await fetch(`http://localhost:5000/api/properties?${params}`);
      if (res.ok) setProperties(await res.json());
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const fetchWishlist = async () => {
    if (!token || user?.role !== 'customer') return;
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.map((i: any) => i.propertyId || i.id));
      }
    } catch { /* silent */ }
  };

  useEffect(() => { fetchProperties(); }, [location, type, maxPrice]);
  useEffect(() => { fetchWishlist(); }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || user?.role !== 'customer') {
      navigate('/customer/login', { state: { message: 'Please login to save properties to your wishlist.' } });
      return;
    }
    const isFav = wishlistIds.includes(propertyId);
    try {
      if (isFav) {
        const r = await fetch(`http://localhost:5000/api/wishlist/${propertyId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (r.ok) setWishlistIds(prev => prev.filter(id => id !== propertyId));
      } else {
        const r = await fetch('http://localhost:5000/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ propertyId }) });
        if (r.ok) setWishlistIds(prev => [...prev, propertyId]);
      }
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading properties...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '2rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(212,175,55,0.06)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Vishnu Realtors</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.75rem', fontFamily: 'Outfit,sans-serif', marginBottom: '0.35rem' }}>Available Properties</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            {properties.length > 0 ? `${properties.length} properties found — browse and enquire below.` : 'Find your next smart real estate investment.'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              📍 Location
            </label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Coimbatore, Ooty"
              style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.18s' }}
              onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              🏗️ Property Type
            </label>
            <select value={type} onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
              <option value="All">All Types</option>
              <option value="Plot">Plot</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              💰 Max Price (Lakhs)
            </label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 50"
              style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.18s' }}
              onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          {(location || type !== 'All' || maxPrice) && (
            <div>
              <button onClick={() => { setLocation(''); setType('All'); setMaxPrice(''); }}
                style={{ width: '100%', padding: '0.65rem 1rem', background: '#F1F5F9', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: '#475569', fontFamily: 'inherit' }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Grid */}
      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
          <h3 style={{ color: '#0F172A', marginBottom: '0.5rem', fontFamily: 'Outfit,sans-serif' }}>No Properties Found</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Try adjusting your filters to find matching properties.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {properties.map(item => {
            const isFav = wishlistIds.includes(item.id);
            const isAvailable = item.status !== 'Sold';
            const coverImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
            return (
              <div key={item.id} style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
                display: 'flex', flexDirection: 'column', position: 'relative',
                transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
              >
                {/* Image */}
                <div style={{ height: '210px', position: 'relative', overflow: 'hidden' }}>
                  <img src={coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                  />
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: isAvailable ? 'rgba(5,150,105,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {isAvailable ? '● Available' : '● Sold'}
                  </div>
                  {/* Wishlist button */}
                  <button onClick={e => handleToggleWishlist(e, item.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.18s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? '#DC2626' : 'none'} stroke={isFav ? '#DC2626' : '#64748B'} strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                  {/* Type badge */}
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', color: '#D4AF37', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {item.type}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3, flex: 1, paddingRight: '0.5rem' }}>{item.title}</h3>
                    <div style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', padding: '0.25rem 0.65rem', borderRadius: '6px', flexShrink: 0 }}>
                      <span style={{ color: '#0F172A', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Outfit,sans-serif' }}>₹{item.price}L</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748B', fontSize: '0.82rem' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {item.location}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span>📐 {item.size} Sq.Ft</span>
                    {item.beds > 0 && <span>🛏 {item.beds} Beds</span>}
                    {item.baths > 0 && <span>🚿 {item.baths} Baths</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    <Link to={`/properties/${item.id}`} style={{
                      flex: 1, padding: '0.6rem', textAlign: 'center', background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                      borderRadius: '8px', color: '#0F172A', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none',
                      transition: 'all 0.18s',
                    }}>View Details</Link>
                    <Link to={`/properties/${item.id}#enquire`} style={{
                      flex: 1, padding: '0.6rem', textAlign: 'center',
                      background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                      borderRadius: '8px', color: '#0F172A', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(212,175,55,0.3)',
                      transition: 'all 0.18s',
                    }}>Enquire Now</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
