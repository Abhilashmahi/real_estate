import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PublicPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Form states
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [visitDate, setVisitDate] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        } else {
          alert('Property not found.');
          navigate('/public-properties');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || user?.role !== 'customer') {
      alert('Please login to send an enquiry.');
      navigate('/customer/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property.id,
          property: property.title,
          notes: enquiryNotes
        })
      });
      if (response.ok) {
        alert('Your enquiry has been submitted successfully!');
        setEnquiryNotes('');
      } else {
        alert('Failed to send enquiry.');
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || user?.role !== 'customer') {
      alert('Please login to book a site visit.');
      navigate('/customer/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/site-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property.id,
          visitDate
        })
      });
      if (response.ok) {
        alert('Site visit request booked successfully! We will contact you to confirm.');
        setVisitDate('');
      } else {
        alert('Failed to book site visit.');
      }
    } catch (error) {
      console.error('Error booking site visit:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading property details...</div>;
  }

  const images = property.images && property.images.length > 0 
    ? property.images.map((img: any) => img.url)
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      {/* Property Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            color: 'var(--color-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>{property.type}</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{property.title}</h1>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {property.location}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price</span>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', fontWeight: 800 }}>₹{property.price} Lakhs</h2>
        </div>
      </div>

      {/* Gallery & Sidebar layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Left Side: Images and Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Large Image */}
          <div style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img src={images[activeImageIndex]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '90px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: idx === activeImageIndex ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Core Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Property Area</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>{property.size} Sq.Ft</h4>
            </div>
            {property.beds > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bedrooms</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>{property.beds} BHK</h4>
              </div>
            )}
            {property.baths > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bathrooms</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>{property.baths} Baths</h4>
              </div>
            )}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.25rem' }}>{property.status}</h4>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Property Description</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{property.description || 'No description available for this property.'}</p>
          </div>

          {/* Google Maps link */}
          {property.mapLink && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Location Map</h3>
              <a
                href={property.mapLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                View on Google Maps
              </a>
            </div>
          )}
        </div>

        {/* Right Side: Enquiry & Site Visit scheduling forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Enquiry form */}
          <form onSubmit={handleEnquirySubmit} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Send Enquiry</h3>
            <div className="form-group">
              <label className="form-label">Requirements / Notes</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="I am interested in this property..."
                value={enquiryNotes}
                onChange={(e) => setEnquiryNotes(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Enquiry</button>
          </form>

          {/* Site Visit booking form */}
          <form onSubmit={handleVisitSubmit} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Schedule Site Visit</h3>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                className="form-input"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Book Site Visit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
