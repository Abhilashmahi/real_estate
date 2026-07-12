import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Enquiries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Enquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: 'Villa',
    notes: '',
    status: 'New'
  });

  const fetchEnquiries = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Enquiry deleted successfully!');
        fetchEnquiries();
      } else {
        alert('Failed to delete enquiry.');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('An error occurred.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Enquiry added successfully!');
        setIsModalOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          property: 'Villa',
          notes: '',
          status: 'New'
        });
        fetchEnquiries();
      } else {
        alert('Failed to save enquiry.');
      }
    } catch (error) {
      console.error('Error saving enquiry:', error);
      alert('An error occurred.');
    }
  };

  // Filtering logic
  const filteredEnquiries = enquiries.filter(item => {
    const name = item.name || '';
    const phone = item.phone || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Enquiry List</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Enquiries</p>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        marginBottom: '1.5rem', 
        backgroundColor: '#ffffff', 
        padding: '1rem', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by name or mobile..."
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        
        <div style={{ width: '150px' }}>
          <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div style={{ width: '150px' }}>
          <select className="form-input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">Date: All</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Enquiry
        </button>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Property Type</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map((item, index) => {
              let badgeCls = 'badge-primary';
              if (item.status === 'New') badgeCls = 'badge-success';
              if (item.status === 'Pending') badgeCls = 'badge-warning';
              if (item.status === 'Closed') badgeCls = 'badge-danger';
              
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/enquiries/${item.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.phone || item.mobile || ''}</td>
                  <td>{item.property || item.type || ''}</td>
                  <td>{item.notes || 'N/A'}</td>
                  <td>
                    <span className={`badge ${badgeCls}`}>{item.status}</span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link to={`/enquiries/${item.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </Link>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer / Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Showing 1 to {filteredEnquiries.length} of 125 entries</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>&lt;</button>
            <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>2</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>3</button>
            <span style={{ alignSelf: 'center', margin: '0 0.25rem' }}>...</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>21</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>&gt;</button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Enquiry</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Mobile Number</label>
                <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Property Type</label>
                <select name="property" className="form-input" value={formData.property} onChange={handleInputChange}>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Notes / Requirements</label>
                <textarea name="notes" className="form-input" rows={3} value={formData.notes} onChange={handleInputChange}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
