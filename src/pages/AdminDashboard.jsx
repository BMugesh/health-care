import { useState } from 'react';
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

export default function AdminDashboard({ onNavigate }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: 1,
      name: 'Margaret Thompson',
      age: 78,
      room: '204',
      pulse: 68,
      status: 'normal',
      lastUpdate: '2 min ago',
      history: [72, 70, 68, 71, 69, 68, 70],
    },
    {
      id: 2,
      name: 'Robert Johnson',
      age: 82,
      room: '301',
      pulse: 95,
      status: 'warning',
      lastUpdate: '1 min ago',
      history: [85, 88, 90, 92, 93, 94, 95],
    },
    {
      id: 3,
      name: 'Eleanor Davis',
      age: 75,
      room: '156',
      pulse: 105,
      status: 'critical',
      lastUpdate: 'Just now',
      history: [95, 98, 100, 102, 103, 104, 105],
    },
    {
      id: 4,
      name: 'Harold Martinez',
      age: 80,
      room: '412',
      pulse: 72,
      status: 'normal',
      lastUpdate: '5 min ago',
      history: [70, 71, 72, 71, 72, 73, 72],
    },
    {
      id: 5,
      name: 'Dorothy Wilson',
      age: 77,
      room: '203',
      pulse: 58,
      status: 'warning',
      lastUpdate: '3 min ago',
      history: [65, 63, 61, 60, 59, 58, 58],
    },
  ];

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
      value: Math.round(patients.reduce((acc, p) => acc + p.pulse, 0) / patients.length),
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

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <Activity className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Patients</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Bell className="w-5 h-5" />
            {sidebarOpen && <span>Alerts</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onNavigate('landing')}
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
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">Dr. Sarah Chen</div>
                  <div className="text-xs text-gray-500">Healthcare Provider</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  SC
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                red: 'from-red-500 to-red-600',
                green: 'from-green-500 to-green-600',
                teal: 'from-teal-500 to-teal-600',
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
                      <Icon className="w-6 h-6 text-white" />
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
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full p-6 hover:bg-gray-50 transition-colors text-left ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
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
                              className={`text-2xl font-bold ${
                                patient.status === 'normal'
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
                          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium ${
                            patient.status === 'critical'
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
                                className={`w-full rounded-t ${
                                  value < 60 || value > 100
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

                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
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
        </div>
      </main>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </div>
  );
}
