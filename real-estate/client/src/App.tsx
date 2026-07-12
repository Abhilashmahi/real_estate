import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout and Nav Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';
import CustomerSidebar from './components/CustomerSidebar';

// Admin Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import CustomerDetails from './pages/CustomerDetails';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import FollowUps from './pages/FollowUps';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PublicProperties from './pages/PublicProperties';
import PublicPropertyDetails from './pages/PublicPropertyDetails';

// Customer Pages
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';
import CustomerEnquiries from './pages/CustomerEnquiries';
import CustomerWishlist from './pages/CustomerWishlist';
import CustomerSiteVisits from './pages/CustomerSiteVisits';

function App() {
  const [adminUser, setAdminUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (u && token) {
      const parsed = JSON.parse(u);
      return parsed.role === 'admin' ? parsed : null;
    }
    return null;
  });

  const [customerUser, setCustomerUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (u && token) {
      const parsed = JSON.parse(u);
      return parsed.role === 'customer' ? parsed : null;
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAdminUser(null);
    setCustomerUser(null);
  };

  const handleAdminLogin = (user: any) => {
    setAdminUser(user);
    setCustomerUser(null);
  };

  const handleCustomerLogin = (user: any) => {
    setCustomerUser(user);
    setAdminUser(null);
  };

  // Layout Wrappers
  const PublicLayoutWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNavbar customerUser={customerUser} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );

  const CustomerLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!customerUser) return <Navigate to="/customer/login" replace />;
    return (
      <div className="app-container">
        <CustomerSidebar onLogout={handleLogout} />
        <div className="main-content">
          <div className="page-wrapper">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!adminUser) return <Navigate to="/admin/login" replace />;
    return (
      <div className="app-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <Navbar />
          <div className="page-wrapper">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const ProtectedCustomerProperties = ({ children }: { children: React.ReactNode }) => {
    if (!customerUser && !adminUser) {
      return <Navigate to="/customer/login" replace state={{ message: "Please login to view available properties." }} />;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PublicNavbar customerUser={customerUser} onLogout={handleLogout} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayoutWrapper><Home /></PublicLayoutWrapper>} />
        <Route path="/about" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><AboutUs /></div></PublicLayoutWrapper>} />
        <Route path="/contact" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><Contact /></div></PublicLayoutWrapper>} />
        <Route path="/public-properties" element={<ProtectedCustomerProperties><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}><PublicProperties /></div></ProtectedCustomerProperties>} />
        <Route path="/properties/:id" element={<ProtectedCustomerProperties><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}><PublicPropertyDetails /></div></ProtectedCustomerProperties>} />

        {/* Customer Auth Routes */}
        <Route path="/customer/login" element={
          customerUser ? <Navigate to="/customer/dashboard" replace /> : <CustomerLogin onLogin={handleCustomerLogin} />
        } />
        <Route path="/customer/register" element={
          customerUser ? <Navigate to="/customer/dashboard" replace /> : <CustomerRegister />
        } />

        {/* Customer Gated Dashboard Routes */}
        <Route path="/customer/dashboard" element={<CustomerLayoutWrapper><CustomerDashboard /></CustomerLayoutWrapper>} />
        <Route path="/customer/profile" element={<CustomerLayoutWrapper><CustomerProfile /></CustomerLayoutWrapper>} />
        <Route path="/customer/enquiries" element={<CustomerLayoutWrapper><CustomerEnquiries /></CustomerLayoutWrapper>} />
        <Route path="/customer/wishlist" element={<CustomerLayoutWrapper><CustomerWishlist /></CustomerLayoutWrapper>} />
        <Route path="/customer/site-visits" element={<CustomerLayoutWrapper><CustomerSiteVisits /></CustomerLayoutWrapper>} />

        {/* Admin Login (no sidebar) */}
        <Route path="/admin/login" element={
          adminUser ? <Navigate to="/admin/dashboard" replace /> : <Login onLogin={handleAdminLogin} />
        } />

        {/* Admin Gated Portal Routes */}
        <Route path="/admin/dashboard" element={<AdminLayoutWrapper><Dashboard /></AdminLayoutWrapper>} />
        <Route path="/admin/properties" element={<AdminLayoutWrapper><Properties /></AdminLayoutWrapper>} />
        <Route path="/admin/properties/add" element={<AdminLayoutWrapper><AddProperty /></AdminLayoutWrapper>} />
        <Route path="/admin/properties/edit/:id" element={<AdminLayoutWrapper><EditProperty /></AdminLayoutWrapper>} />
        <Route path="/admin/enquiries" element={<AdminLayoutWrapper><Enquiries /></AdminLayoutWrapper>} />
        <Route path="/admin/enquiries/:id" element={<AdminLayoutWrapper><CustomerDetails /></AdminLayoutWrapper>} />
        <Route path="/admin/followups" element={<AdminLayoutWrapper><FollowUps /></AdminLayoutWrapper>} />
        <Route path="/admin/reports" element={<AdminLayoutWrapper><Reports /></AdminLayoutWrapper>} />
        <Route path="/admin/settings" element={<AdminLayoutWrapper><Settings /></AdminLayoutWrapper>} />

        {/* Fallbacks */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
