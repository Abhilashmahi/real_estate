import React, { useState, useEffect } from 'react';

export default function FollowUps() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/followups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowups(data);
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleToggleComplete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/followups/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchFollowups();
      } else {
        alert('Failed to update follow-up task status.');
      }
    } catch (error) {
      console.error('Error toggling follow-up status:', error);
    }
  };

  const filteredFollowUps = followups.filter(item => 
    statusFilter === 'All' || item.status === statusFilter
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Follow-up List</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Follow-up</p>
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
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ width: '180px' }}>
          <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">Date: All</option>
          </select>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Customer Name</th>
              <th>Next Follow-up Date</th>
              <th>Status</th>
              <th>Remarks</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowUps.map((item, index) => {
              let badgeCls = 'badge-primary';
              if (item.status === 'New') badgeCls = 'badge-success';
              if (item.status === 'Pending') badgeCls = 'badge-warning';
              if (item.status === 'Closed') badgeCls = 'badge-danger';
              
              return (
                <tr key={item.id} style={{ 
                  textDecoration: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.6 : 1
                }}>
                  <td>{index + 1}</td>
                  <td><strong>{item.client || item.name}</strong></td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`badge ${badgeCls}`}>{item.type || item.status || 'Scheduled'}</span>
                  </td>
                  <td>{item.notes || item.remarks || ''}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => handleToggleComplete(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
