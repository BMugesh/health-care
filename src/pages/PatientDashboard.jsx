import { useState } from 'react';
import { Heart, Activity, LogOut, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import PulseGauge from '../components/PulseGauge';
import StatusBadge from '../components/StatusBadge';

export default function PatientDashboard({ onNavigate }) {
  const [currentPulse] = useState(72);
  const [status] = useState('normal');
  const [recentReadings] = useState([
    { time: '10:00 AM', value: 68, status: 'normal' },
    { time: '11:00 AM', value: 70, status: 'normal' },
    { time: '12:00 PM', value: 72, status: 'normal' },
    { time: '1:00 PM', value: 71, status: 'normal' },
  ]);

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
    } else if (status === 'warning') {
      return {
        icon: AlertCircle,
        message: 'Your heart rate needs attention',
        detail: 'Please rest and stay calm. We have notified your caregiver.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    } else {
      return {
        icon: AlertCircle,
        message: 'Alert: Abnormal heart rate detected',
        detail: 'Please sit down and relax. Emergency contact has been notified.',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HealthPulse</h1>
              <p className="text-gray-500 text-lg">Welcome back, Margaret</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 px-8 py-4 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div
          className={`${statusInfo.bg} ${statusInfo.border} border-2 rounded-3xl p-8 mb-12 shadow-lg`}
        >
          <div className="flex items-center gap-4">
            <StatusIcon className={`w-12 h-12 ${statusInfo.color}`} />
            <div>
              <h2 className={`text-3xl font-bold ${statusInfo.color} mb-2`}>{statusInfo.message}</h2>
              <p className="text-xl text-gray-700">{statusInfo.detail}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Current Heart Rate</h2>
              <p className="text-xl text-gray-500">Live monitoring</p>
            </div>
            <div className="flex justify-center mb-8">
              <PulseGauge value={currentPulse} size="xlarge" />
            </div>
            <div className="flex justify-center">
              <StatusBadge status={status} size="large" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quick Stats</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-xl text-gray-600">Average Today</span>
                  <span className="text-3xl font-bold text-gray-900">70 BPM</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-xl text-gray-600">Highest Today</span>
                  <span className="text-3xl font-bold text-gray-900">75 BPM</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-xl text-gray-600">Lowest Today</span>
                  <span className="text-3xl font-bold text-gray-900">65 BPM</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-4">
                <Phone className="w-8 h-8" />
                <span className="text-2xl font-bold">Call Emergency Contact</span>
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
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="text-lg text-gray-500 mb-3">{reading.time}</div>
                <div
                  className={`text-5xl font-bold mb-3 ${
                    reading.status === 'normal'
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

        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-3xl p-10">
          <div className="text-center">
            <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Health Tips</h3>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Remember to stay hydrated, take your medications on time, and get regular rest. If you
              feel unwell, don't hesitate to call your caregiver or use the emergency contact button
              above.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-lg text-gray-500">
            Monitored 24/7 • Last updated: Just now • Device connected
          </p>
        </div>
      </footer>
    </div>
  );
}
