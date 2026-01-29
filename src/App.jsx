import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ProviderProfileForm from './components/ProviderProfileForm';
import { authService } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (role, userData = null) => {
    console.log('handleLogin called with role:', role, 'userData:', userData);

    if (role === 'patient') {
      setCurrentUser({
        role: 'patient',
        data: userData || {}
      });
      setCurrentPage('patient-dashboard');
    } else if (role === 'admin') {
      // Check if this is a new provider signup (needs profile setup)
      if (userData?.needsProfileSetup) {
        setCurrentUser({
          role: 'admin',
          data: userData || {}
        });
        setCurrentPage('provider-profile-setup');
      } else {
        // Existing provider login - go directly to dashboard
        setCurrentUser({
          role: 'admin',
          data: userData || {}
        });
        setCurrentPage('admin-dashboard');
      }
    }
  };

  const handleLogout = () => {
    authService.logout(); // Clear localStorage
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleProviderProfileComplete = (completeUserData) => {
    // Update user data with completed profile info
    setCurrentUser({
      role: 'admin',
      data: completeUserData
    });
    setCurrentPage('admin-dashboard');
  };

  console.log('Current user:', currentUser);

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'auth' && (
        <AuthPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}
      {currentPage === 'admin-dashboard' && (
        <AdminDashboard
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          providerData={currentUser?.data}
        />
      )}
      {currentPage === 'provider-profile-setup' && (
        <ProviderProfileForm
          userData={currentUser?.data}
          onComplete={handleProviderProfileComplete}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'patient-dashboard' && (
        <PatientDashboard
          patientData={currentUser?.data}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
