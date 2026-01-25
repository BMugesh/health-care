import { useState } from 'react';
import { Heart, Mail, Lock, User, Shield, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import HeartbeatWaveform from '../components/HeartbeatWaveform';

export default function AuthPage({ onNavigate, onLogin }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup' && step === 1) {
      setStep(2);
    } else {
      onLogin(role);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <HeartbeatWaveform color="#FFFFFF" height={150} speed={2} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-3xl font-bold text-white">HealthPulse</span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Professional Healthcare Monitoring for Your Loved Ones
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Join thousands of families and healthcare providers using our platform for reliable,
            real-time pulse monitoring and elderly care.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-blue-100 text-sm">Active Patients</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-blue-100 text-sm">Uptime</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-blue-100 text-sm">Support</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              HealthPulse
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMode('signup');
                  resetForm();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {mode === 'signup' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Select Role
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gray-300 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      2
                    </div>
                    <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Account Details
                    </span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && step === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Role</h3>

                <button
                  onClick={() => setRole('patient')}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    role === 'patient'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        role === 'patient' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <User className={`w-6 h-6 ${role === 'patient' ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Patient</h4>
                      <p className="text-sm text-gray-600">
                        For individuals monitoring their own health with simplified interfaces
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setRole('admin')}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    role === 'admin'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        role === 'admin' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <Shield className={`w-6 h-6 ${role === 'admin' ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Healthcare Provider</h4>
                      <p className="text-sm text-gray-600">
                        For caregivers and medical professionals monitoring multiple patients
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {(mode === 'login' || (mode === 'signup' && step === 2)) && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to role selection
                  </button>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h3>

                {mode === 'login' && (
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                        role === 'patient'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <User className="w-4 h-4 inline mr-1" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                        role === 'admin'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <Shield className="w-4 h-4 inline mr-1" />
                      Provider
                    </button>
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate('landing')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
