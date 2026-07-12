import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const statCardColors = {
  blue:   { bg: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
  gold:   { bg: 'linear-gradient(135deg, #B8960C 0%, #D4AF37 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
  green:  { bg: 'linear-gradient(135deg, #047857 0%, #059669 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
  orange: { bg: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
  purple: { bg: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
  slate:  { bg: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', icon: 'rgba(255,255,255,0.2)', text: '#fff' },
};

type ColorKey = keyof typeof statCardColors;

function StatCard({ title, value, icon, color, linkTo }: { title: string; value: number; icon: React.ReactNode; color: ColorKey; linkTo?: string }) {
  const theme = statCardColors[color];
  const inner = (
    <div style={{
      background: theme.bg,
      borderRadius: '14px',
      padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
      position: 'relative', overflow: 'hidden',
      cursor: linkTo ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    }}
      onMouseEnter={e => { if (linkTo) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.2)'; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }}/>
      <div style={{ position: 'absolute', bottom: '-30px', right: '30px', width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{title}</div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: '2.25rem', fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>{value.toLocaleString()}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      </div>
    </div>
  );
  return linkTo ? <Link to={linkTo} style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
}

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalProperties: 0, totalEnquiries: 0, totalCustomers: 0, totalFollowUps: 0, pendingFollowUps: 0, closedEnquiries: 0, todaysEnquiries: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [enquiriesRes, siteVisitsRes, summaryRes] = await Promise.all([
        fetch('http://localhost:5000/api/enquiries', { headers }),
        fetch('http://localhost:5000/api/site-visits', { headers }),
        fetch('http://localhost:5000/api/reports/summary', { headers }),
      ]);

      let enquiriesData: any[] = [];
      if (enquiriesRes.ok) { enquiriesData = await enquiriesRes.json(); setEnquiries(enquiriesData); }
      if (siteVisitsRes.ok) { setSiteVisits(await siteVisitsRes.json()); }

      if (summaryRes.ok) {
        const s = await summaryRes.json();
        const today = new Date().toDateString();
        const todaysCount = enquiriesData.filter(i => i.createdAt && new Date(i.createdAt).toDateString() === today).length;
        const closedCount = enquiriesData.filter(i => ['Closed', 'closed'].includes(i.status)).length;

        const followupsRes = await fetch('http://localhost:5000/api/followups', { headers });
        let pendingCount = 0;
        if (followupsRes.ok) {
          const fu = await followupsRes.json();
          pendingCount = fu.filter((i: any) => !i.completed).length;
        }
        setSummary({
          totalProperties:  s.summary.totalProperties  || 0,
          totalEnquiries:   enquiriesData.length,
          totalCustomers:   s.summary.totalCustomers   || 0,
          totalFollowUps:   s.summary.totalFollowUps   || 0,
          pendingFollowUps: pendingCount,
          closedEnquiries:  closedCount,
          todaysEnquiries:  todaysCount,
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleConfirmVisit = async (id: number) => {
    try {
      const r = await fetch(`http://localhost:5000/api/site-visits/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (r.ok) fetchDashboardData();
    } catch (err) { console.error(err); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      New:        { bg: 'rgba(29,78,216,0.12)',  color: '#1D4ED8' },
      Contacted:  { bg: 'rgba(5,150,105,0.12)',  color: '#059669' },
      'Follow-up':{ bg: 'rgba(217,119,6,0.12)',  color: '#D97706' },
      Closed:     { bg: 'rgba(100,116,139,0.12)',color: '#64748B' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#64748B' };
    return <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</span>;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: '#0F172A' }}>Admin Dashboard</h1>
          <p style={{ color: '#64748B', marginTop: '0.25rem', fontSize: '0.9rem' }}>Live overview of your real estate operations.</p>
        </div>
        <Link to="/admin/properties/add" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.65rem 1.25rem',
          background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
          color: '#0F172A', fontWeight: 700, fontSize: '0.875rem',
          borderRadius: '8px', textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Property
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatCard title="Total Properties" value={summary.totalProperties} color="blue" linkTo="/admin/properties"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>} />
        <StatCard title="Total Customers" value={summary.totalCustomers} color="gold" linkTo="/admin/enquiries"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>} />
        <StatCard title="Total Enquiries" value={summary.totalEnquiries} color="green" linkTo="/admin/enquiries"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>} />
        <StatCard title="Today's Enquiries" value={summary.todaysEnquiries} color="orange" linkTo="/admin/enquiries"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <StatCard title="Pending Follow-ups" value={summary.pendingFollowUps} color="purple" linkTo="/admin/followups"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard title="Closed Deals" value={summary.closedEnquiries} color="slate"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
      </div>

      {/* Recent Enquiries */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Recent Enquiries</h2>
          <Link to="/admin/enquiries" style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Customer', 'Phone', 'Property', 'Message', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>No enquiries yet.</td></tr>
              ) : enquiries.slice(0, 6).map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F8FAFC'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td style={{ padding: '1rem 1.25rem' }}><strong style={{ fontSize: '0.875rem' }}>{item.name}</strong></td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.85rem' }}>{item.phone}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>{item.propertyName || 'General'}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.82rem', maxWidth: '180px' }}><span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.notes || '—'}</span></td>
                  <td style={{ padding: '1rem 1.25rem' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94A3B8', fontSize: '0.82rem' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Site Visits */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Site Visit Bookings</h2>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Customer', 'Phone', 'Property', 'Visit Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteVisits.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>No site visits scheduled yet.</td></tr>
              ) : siteVisits.map(visit => (
                <tr key={visit.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}><strong style={{ fontSize: '0.875rem' }}>{visit.customer?.fullName || visit.customer?.name || 'Guest'}</strong></td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.85rem' }}>{visit.customer?.mobile || visit.customer?.phone || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>{visit.property?.title || 'General'}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#0F172A' }}>{visit.visitDate}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: visit.status === 'Confirmed' ? 'rgba(5,150,105,0.12)' : 'rgba(217,119,6,0.12)', color: visit.status === 'Confirmed' ? '#059669' : '#D97706', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{visit.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {visit.status === 'Pending' && (
                      <button onClick={() => handleConfirmVisit(visit.id)} style={{ padding: '0.3rem 0.75rem', background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Confirm</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
