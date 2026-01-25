import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('patient-dashboard');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} onLogin={handleLogin} />}
      {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
      {currentPage === 'patient-dashboard' && <PatientDashboard onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
