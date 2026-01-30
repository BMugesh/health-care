import { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  LogOut,
  Phone,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
  User,
  Edit2,
  Save,
} from 'lucide-react';

import PulseGauge from '../components/PulseGauge';
import StatusBadge from '../components/StatusBadge';
import PatientProfileModal from '../components/PatientProfileModal';
import HealthChatbot from '../components/HealthChatbot';
import { patientService } from '../services/api';

export default function PatientDashboard({ patientData, onNavigate, onLogout }) {
  const [currentPulse, setCurrentPulse] = useState(patientData?.vitals?.heartRate || 72);
  const [status, setStatus] = useState('normal');
  const [recentReadings] = useState([
    { time: '10:00 AM', value: 68, status: 'normal' },
    { time: '11:00 AM', value: 70, status: 'normal' },
    { time: '12:00 PM', value: 72, status: 'normal' },
    { time: '1:00 PM', value: 71, status: 'normal' },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [fullPatientData, setFullPatientData] = useState(patientData);
  const [loading, setLoading] = useState(false);
  const [isEditingPulse, setIsEditingPulse] = useState(false);
  const [newPulse, setNewPulse] = useState(currentPulse);
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
  });

  useEffect(() => {
    console.log('PatientDashboard received patientData:', patientData);

    // Fetch full patient data from backend if we have an ID
    const fetchPatientProfile = async () => {
      if (patientData?.id) {
        setLoading(true);
        try {
          const response = await patientService.getPatientById(patientData.id);
          if (response.success) {
            setFullPatientData(response.data);
          }
        } catch (error) {
          console.error('Error fetching patient profile:', error);
          // Fallback to initial patientData
          setFullPatientData(patientData);
        } finally {
          setLoading(false);
        }
      } else {
        setFullPatientData(patientData);
      }
    };

    const calculateStats = (history) => {
      if (!history || history.length === 0) {
        // If no history, use current pulse as the only data point
        return {
          average: currentPulse,
          highest: currentPulse,
          lowest: currentPulse,
        };
      }

      // Filter for today's readings
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayReadings = history.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= today;
      }).map(item => item.heartRate);

      // Also include the current pulse if it's not in history yet (dependent on how we sync)
      // For simplicity, let's assume history is the source of truth if it exists.
      // If todayReadings is empty despite history existing (maybe all old), fall back to current.

      if (todayReadings.length === 0) {
        return {
          average: currentPulse,
          highest: currentPulse,
          lowest: currentPulse,
        };
      }

      const sum = todayReadings.reduce((acc, curr) => acc + curr, 0);
      const avg = Math.round(sum / todayReadings.length);
      const max = Math.max(...todayReadings);
      const min = Math.min(...todayReadings);

      return {
        average: avg,
        highest: max,
        lowest: min,
      };
    };

    fetchPatientProfile();
  }, [patientData]);

  // Update stats when fullPatientData changes (which includes vitalsHistory)
  useEffect(() => {
    if (fullPatientData?.vitalsHistory) {
      const newStats = calculateStats(fullPatientData.vitalsHistory);
      if (newStats) {
        setStats(newStats);
      } else if (fullPatientData?.vitals?.heartRate) {
        // Fallback if history exists but no today readings
        setStats({
          average: fullPatientData.vitals.heartRate,
          highest: fullPatientData.vitals.heartRate,
          lowest: fullPatientData.vitals.heartRate,
        });
      }
    } else if (fullPatientData?.vitals?.heartRate) {
      // Fallback if no history but we have a current rate
      setStats({
        average: fullPatientData.vitals.heartRate,
        highest: fullPatientData.vitals.heartRate,
        lowest: fullPatientData.vitals.heartRate,
      });
    }
  }, [fullPatientData]);

  // Define calculateStats outside useEffect so it can be reused or just keep logic simple
  const calculateStats = (history) => {
    if (!history || history.length === 0) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayReadings = history.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= today;
    }).map(item => item.heartRate);

    if (todayReadings.length === 0) return null;

    const sum = todayReadings.reduce((acc, curr) => acc + curr, 0);
    return {
      average: Math.round(sum / todayReadings.length),
      highest: Math.max(...todayReadings),
      lowest: Math.min(...todayReadings),
    };
  };

  const updateStatus = (pulse) => {
    if (pulse < 60 || pulse > 100) {
      setStatus('critical');
    } else if (pulse < 65 || pulse > 90) {
      setStatus('warning');
    } else {
      setStatus('normal');
    }
  };

  useEffect(() => {
    if (fullPatientData?.vitals?.heartRate) {
      setCurrentPulse(fullPatientData.vitals.heartRate);
      setNewPulse(fullPatientData.vitals.heartRate);
      updateStatus(fullPatientData.vitals.heartRate);
    }
  }, [fullPatientData]);

  const handleSavePulse = async () => {
    try {
      const updatedPulse = parseInt(newPulse);
      setCurrentPulse(updatedPulse);
      updateStatus(updatedPulse);
      setIsEditingPulse(false);

      if (fullPatientData?._id || fullPatientData?.id) {
        const response = await patientService.updateVitals(fullPatientData._id || fullPatientData.id, {
          heartRate: updatedPulse
        });

        if (response.success && response.data) {
          setFullPatientData(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to update pulse:', error);
    }
  };

  const handleProfileClick = () => {
    console.log('Profile icon clicked, opening modal with data:', patientData);
    setProfileModalOpen(true);
  };

  const getStatusMessage = () => {
    if (status === 'normal') {
      return {
        icon: CheckCircle,
        message: 'Your heart rate is normal',
        detail: 'Everything looks good. Keep up the healthy lifestyle!',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
      };
    }

    if (status === 'warning') {
      return {
        icon: AlertCircle,
        message: 'Your heart rate needs attention',
        detail: 'Please rest and stay calm. We have notified your caregiver.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    }

    return {
      icon: AlertCircle,
      message: 'Alert: Abnormal heart rate detected',
      detail: 'Please sit down and relax. Emergency contact has been notified.',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    };
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              HealthPulse
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleProfileClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Profile"
            >
              <User className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {fullPatientData?.firstName || patientData?.firstName || 'Patient'}!
        </h1>

        <div
          className={`${statusInfo.bg} ${statusInfo.border} border-2 rounded-3xl p-8 mb-12 shadow-lg`}
        >
          <div className="flex items-center gap-4">
            <StatusIcon className={`w-12 h-12 ${statusInfo.color}`} />
            <div>
              <h2 className={`text-3xl font-bold ${statusInfo.color} mb-2`}>
                {statusInfo.message}
              </h2>
              <p className="text-xl text-gray-700">{statusInfo.detail}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
            <div className="text-center mb-8 relative">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Current Heart Rate
              </h2>
              <p className="text-xl text-gray-500">Live monitoring</p>

              <button
                onClick={() => setIsEditingPulse(!isEditingPulse)}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                title="Edit Heart Rate"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
              {isEditingPulse ? (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="relative">
                    <input
                      type="number"
                      value={newPulse}
                      onChange={(e) => setNewPulse(e.target.value)}
                      className="w-40 text-center text-4xl font-bold border-b-2 border-primary focus:outline-none bg-transparent py-2"
                      autoFocus
                    />
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-500 font-medium">BPM</span>
                  </div>
                  <button
                    onClick={handleSavePulse}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-gray-900 rounded-full hover:bg-primary-600 transition-colors shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Reading
                  </button>
                </div>
              ) : (
                <PulseGauge value={currentPulse} size="xlarge" />
              )}
            </div>

            <div className="flex justify-center">
              <StatusBadge status={status} size="large" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quick Stats</h3>
              </div>

              <div className="space-y-6">
                <Stat label="Average Today" value={`${stats.average || currentPulse} BPM`} />
                <Stat label="Highest Today" value={`${stats.highest || currentPulse} BPM`} />
                <Stat label="Lowest Today" value={`${stats.lowest || currentPulse} BPM`} />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-bold">Chat with our AI!</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Today's Readings</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentReadings.map((reading, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="text-lg text-gray-500 mb-3">{reading.time}</div>

                <div
                  className={`text-5xl font-bold mb-3 ${reading.status === 'normal'
                    ? 'text-green-600'
                    : reading.status === 'warning'
                      ? 'text-amber-600'
                      : 'text-red-600'
                    }`}
                >
                  {reading.value}
                </div>

                <div className="text-lg text-gray-500 mb-4">BPM</div>
                <StatusBadge status={reading.status} size="medium" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-primary-50 border-2 border-primary-200 rounded-3xl p-10">
          <div className="text-center">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Health Tips</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Remember to stay hydrated, take your medications on time, and get regular rest. If you feel unwell, don't hesitate to call your caregiver or use the emergency contact button above.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {fullPatientData && (
        <PatientProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          profileData={fullPatientData}
        />
      )}

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-lg text-gray-500">
            Monitored 24/7 • Last updated: Just now • Device connected
          </p>
        </div>
      </footer>

      {/* Health Chatbot */}
      <HealthChatbot />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-none">
      <span className="text-xl text-gray-600">{label}</span>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
