import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Villa',
    status: 'Available',
    location: '',
    price: '',
    area: ''
  });
  const [mapLink, setMapLink] = useState('');
  const [imagesText, setImagesText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          mapLink,
          images: imagesText.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      if (response.ok) {
        alert('Property added successfully!');
        navigate('/properties');
      } else {
        const errorData = await response.json();
        alert(`Failed to add property: ${errorData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Network error while saving property.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Add New Property</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Properties / Add</p>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Property Name</label>
            <input type="text" name="name" className="form-input" placeholder="Enter property name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" rows={3} placeholder="Enter description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select name="type" className="form-input" value={formData.type} onChange={handleChange}>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Plot">Plot</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-input" placeholder="Enter location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Price (in Lakhs)</label>
            <input type="text" name="price" className="form-input" placeholder="Enter price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Area (in Sq.Ft)</label>
            <input type="text" name="area" className="form-input" placeholder="Enter area" value={formData.area} onChange={handleChange} required />
          </div>

          {/* Map Link */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Google Maps Location Link</label>
            <input type="text" className="form-input" placeholder="https://maps.google.com/?q=..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
          </div>

          {/* Multiple Image URLs */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Property Image URLs (Comma-separated)</label>
            <textarea className="form-input" rows={2} placeholder="URL1, URL2, URL3" value={imagesText} onChange={(e) => setImagesText(e.target.value)}></textarea>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary">Save Property</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/properties')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
