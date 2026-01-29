import { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Activity,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import PulseGauge from '../components/PulseGauge';
import StatusBadge from '../components/StatusBadge';
import AlertModal from '../components/AlertModal';
import ProviderProfileViewModal from '../components/ProviderProfileViewModal';

import { patientService } from '../services/api';

export default function AdminDashboard({ onNavigate, onLogout, providerData }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientService.getAllPatients();
        if (response.success) {
          // Transform backend data to dashboard format
          const formattedPatients = response.data.map(p => ({
            id: p._id || p.id,
            name: `${p.firstName} ${p.lastName}`,
            age: p.dateOfBirth ? calculateAge(p.dateOfBirth) : 'N/A',
            room: p.address?.includes('Room') ? p.address : 'Home', // Simple heuristic or default
            pulse: p.vitals?.heartRate || 0,
            status: calculateStatus(p.vitals?.heartRate),
            lastUpdate: new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            history: p.vitalsHistory?.slice(-7).map(h => h.heartRate) || [], // Last 7 readings
            fullData: p // Keep original data for details
          }));
          setPatients(formattedPatients);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients(); // Initial fetch
    const intervalId = setInterval(fetchPatients, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculateStatus = (pulse) => {
    if (!pulse) return 'normal';
    if (pulse < 60 || pulse > 100) return 'critical';
    if (pulse < 65 || pulse > 90) return 'warning';
    return 'normal';
  };

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'blue' },
    {
      label: 'Critical Alerts',
      value: patients.filter((p) => p.status === 'critical').length,
      icon: AlertCircle,
      color: 'red',
    },
    {
      label: 'Average Pulse',
      value: patients.length > 0 ? Math.round(patients.reduce((acc, p) => acc + (p.pulse || 0), 0) / patients.length) : 0,
      icon: Activity,
      color: 'green',
    },
    { label: 'Active Monitors', value: patients.length, icon: TrendingUp, color: 'teal' },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAlert = (patient) => {
    setAlertModal({
      isOpen: true,
      type: patient.status,
      title: `${patient.status === 'critical' ? 'Critical Alert' : 'Warning'} - ${patient.name}`,
      message: `Patient ${patient.name} (Room ${patient.room}) has an abnormal pulse rate of ${patient.pulse} BPM. Please check on the patient immediately.`,
    });
  };

  const renderDashboardContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-primary to-primary-400 text-gray-900',
            red: 'from-red-500 to-red-600 text-white',
            green: 'from-green-500 to-green-600 text-white',
            teal: 'from-secondary to-secondary-400 text-gray-900',
          };

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color === 'blue' || stat.color === 'teal' ? 'text-gray-900' : 'text-white'}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Patient List</h2>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full p-6 hover:bg-gray-50 transition-colors text-left ${selectedPatient?.id === patient.id ? 'bg-primary-50' : ''
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {patient.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">
                          {patient.age} years • Room {patient.room}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${patient.status === 'normal'
                            ? 'text-green-600'
                            : patient.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-red-600'
                            }`}
                        >
                          {patient.pulse}
                        </div>
                        <div className="text-xs text-gray-500">BPM</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={patient.status} size="small" />
                        <span className="text-xs text-gray-400">{patient.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  {patient.status !== 'normal' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showAlert(patient);
                      }}
                      className={`mt-4 w-full py-2 rounded-lg text-sm font-medium ${patient.status === 'critical'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        } transition-colors`}
                    >
                      View Alert Details
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Patient Details</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xl">
                  {selectedPatient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{selectedPatient.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.age} years • Room {selectedPatient.room}
                  </p>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <PulseGauge value={selectedPatient.pulse} size="medium" />
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <StatusBadge status={selectedPatient.status} size="small" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedPatient.lastUpdate}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Pulse History (7 readings)</h4>
                  <div className="flex items-end justify-between h-24 gap-2">
                    {selectedPatient.history.map((value, index) => {
                      const maxValue = Math.max(...selectedPatient.history);
                      const height = (value / maxValue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className={`w-full rounded-t ${value < 60 || value > 100
                              ? 'bg-red-400'
                              : value < 65 || value > 90
                                ? 'bg-amber-400'
                                : 'bg-green-400'
                              } transition-all`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-500">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-medium hover:shadow-lg transition-all">
                  View Full Report
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center sticky top-24">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patient Selected</h3>
              <p className="text-sm text-gray-500">
                Select a patient from the list to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderPatientsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Patients</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                  {patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-xs text-gray-500">Room {patient.room}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Age</div>
                  <div className="font-semibold text-gray-900">{patient.age} years</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Pulse</div>
                  <div
                    className={`text-xl font-bold ${patient.status === 'normal'
                      ? 'text-green-600'
                      : patient.status === 'warning'
                        ? 'text-amber-600'
                        : 'text-red-600'
                      }`}
                  >
                    {patient.pulse} BPM
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <StatusBadge status={patient.status} size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlertsContent = () => {
    const alertPatients = patients.filter((p) => p.status !== 'normal');
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Alerts</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {alertPatients.length} active alert{alertPatients.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {alertPatients.length > 0 ? (
              alertPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-2 ${patient.status === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-amber-50 border-amber-200'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className={`w-6 h-6 mt-1 ${patient.status === 'critical' ? 'text-red-600' : 'text-amber-600'
                          }`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{patient.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Room {patient.room} • {patient.age} years
                        </p>
                        <p className="text-sm text-gray-700">
                          {patient.status === 'critical' ? 'Critical' : 'Warning'}: Pulse rate of{' '}
                          <span className="font-semibold">{patient.pulse} BPM</span> detected
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Last update: {patient.lastUpdate}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={patient.status} size="small" />
                      <button
                        onClick={() => showAlert(patient)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${patient.status === 'critical'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                          } transition-colors`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h3>
                <p className="text-sm text-gray-500">All patients are in normal condition</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Thresholds</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Critical Pulse (High)</div>
                  <div className="text-sm text-gray-500">Alert when pulse exceeds this value</div>
                </div>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Critical Pulse (Low)</div>
                  <div className="text-sm text-gray-500">Alert when pulse falls below this value</div>
                </div>
                <input
                  type="number"
                  defaultValue="60"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Warning Pulse (High)</div>
                  <div className="text-sm text-gray-500">Warning when pulse exceeds this value</div>
                </div>
                <input
                  type="number"
                  defaultValue="90"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Warning Pulse (Low)</div>
                  <div className="text-sm text-gray-500">Warning when pulse falls below this value</div>
                </div>
                <input
                  type="number"
                  defaultValue="65"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive alerts via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">SMS Notifications</div>
                  <div className="text-sm text-gray-500">Receive alerts via SMS</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Sound Alerts</div>
                  <div className="text-sm text-gray-500">Play sound for critical alerts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-medium hover:shadow-lg transition-all">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-gray-900">HealthPulse</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'dashboard'
              ? 'bg-primary-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Activity className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveSection('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'patients'
              ? 'bg-primary-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Patients</span>}
          </button>
          <button
            onClick={() => setActiveSection('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'alerts'
              ? 'bg-primary-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Bell className="w-5 h-5" />
            {sidebarOpen && <span>Alerts</span>}
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'settings'
              ? 'bg-primary-50 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Monitoring Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time health monitoring for elderly care</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div
                className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{providerData?.name || 'Doctor'}</div>
                  <div className="text-xs text-gray-500">{providerData?.specialization || 'Healthcare Provider'}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-gray-900 font-semibold overflow-hidden">
                  {providerData?.photoPreview ? (
                    <img src={providerData.photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>
                      {providerData?.name
                        ? providerData.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                        : 'DR'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeSection === 'dashboard' && renderDashboardContent()}
          {activeSection === 'patients' && renderPatientsContent()}
          {activeSection === 'alerts' && renderAlertsContent()}
          {activeSection === 'settings' && renderSettingsContent()}
        </div>
      </main>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />

      <ProviderProfileViewModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        providerData={providerData}
      />
    </div>
  );
}
