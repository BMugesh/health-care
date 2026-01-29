import { useState } from 'react';
import { Heart, Mail, Lock, User, Shield, ArrowRight, ArrowLeft, CheckCircle, Camera, Calendar, MapPin, Phone } from 'lucide-react';
import HeartbeatWaveform from '../components/HeartbeatWaveform';
import { authService } from '../services/api';

export default function AuthPage({ onNavigate, onLogin }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    photo: null,
    photoPreview: null,
    dob: '',
    gender: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Multi-step signup navigation
    if (mode === 'signup' && step === 1) {
      setStep(2);
      return;
    } else if (mode === 'signup' && step === 2) {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // For providers, skip step 3 and go directly to signup
      // They'll complete their profile in ProviderProfileForm
      if (role === 'admin') {
        // Provider signup happens here (step 2)
        setLoading(true);
        try {
          const signupData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          };

          console.log('📤 Sending provider signup data:', signupData);
          const response = await authService.registerProvider(signupData);
          console.log('✅ Provider signup response:', response);

          if (response.success) {
            // Redirect to provider profile setup page
            alert('Account created! Please complete your professional profile.');
            onLogin(role, {
              id: response.user.id,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              email: response.user.email,
              needsProfileSetup: true, // Flag to indicate profile setup is needed
            });
          }
        } catch (err) {
          console.error('❌ Provider signup error:', err);
          console.error('Error response:', err.response?.data);
          const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
          setError(`Registration failed: ${errorMsg}`);
        } finally {
          setLoading(false);
        }
        return;
      }

      // For patients, continue to step 3 (profile details)
      setStep(3);
      return;
    } else if (mode === 'signup' && step === 3) {
      // Patient Signup - Store in database with full profile
      // (Providers skip this step and signup at step 2)
      setLoading(true);
      try {
        const signupData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dob,
          gender: formData.gender,
          phone: formData.phone,
          address: formData.address,
        };

        console.log('📤 Sending patient signup data:', signupData);
        const response = await authService.registerPatient(signupData);
        console.log('✅ Patient signup response:', response);

        if (response.success) {
          // Auto-redirect to patient dashboard with patient data
          alert('Signup successful! Welcome to HealthPulse.');
          onLogin(role, {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            dob: formData.dob,
            gender: formData.gender,
            phone: formData.phone,
            address: formData.address,
            photoPreview: formData.photoPreview,
          });
        }
      } catch (err) {
        console.error('❌ Signup error:', err);
        console.error('Error response:', err.response?.data);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
        setError(`Registration failed: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      // Patient Login - Validate credentials
      setLoading(true);
      try {
        const response = await authService.login(
          formData.email,
          formData.password,
          role === 'patient' ? 'patient' : 'provider'
        );

        if (response.success) {
          // Successful login - redirect to dashboard
          onLogin(role, response.user);
        }
      } catch (err) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || 'Login failed';

        // Scenario 1: Patient doesn't exist (401 with specific message)
        if (err.response?.status === 401 && errorMessage.toLowerCase().includes('invalid credentials')) {
          // Check if it's likely the user doesn't exist vs wrong password
          // Since backend returns same message for both, we'll try to be helpful
          setError('Invalid email or password. Please check your credentials.');

          // Optional: After showing error, suggest signup
          setTimeout(() => {
            const shouldSignup = window.confirm(
              'No account found with this email. Would you like to sign up?'
            );
            if (shouldSignup) {
              setMode('signup');
              setStep(1);
              setError(null);
            }
          }, 1000);
        }
        // Scenario 2: Account deactivated
        else if (err.response?.status === 403) {
          setError(errorMessage);
        }
        // Scenario 3: Other errors
        else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
      photo: null,
      photoPreview: null,
      dob: '',
      gender: '',
      phone: '',
      address: '',
    });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-12 flex-col justify-between relative overflow-hidden">
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
          <p className="text-primary-100 text-lg leading-relaxed">
            Join thousands of families and healthcare providers using our platform for reliable,
            real-time pulse monitoring and elderly care.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-primary-100 text-sm">Active Patients</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-primary-100 text-sm">Uptime</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-primary-100 text-sm">Support</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
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
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${mode === 'login'
                  ? 'bg-gradient-to-r from-primary to-secondary text-gray-900 shadow-lg'
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
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${mode === 'signup'
                  ? 'bg-gradient-to-r from-primary to-secondary text-gray-900 shadow-lg'
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-gray-900' : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Role
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gray-300 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-gray-900' : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                    </div>
                    <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Account
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gray-300 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-gray-900' : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      3
                    </div>
                    <span className={`text-sm font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                      Profile
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
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${role === 'patient'
                    ? 'border-primary bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'patient' ? 'bg-primary' : 'bg-gray-200'
                        }`}
                    >
                      <User className={`w-6 h-6 ${role === 'patient' ? 'text-gray-900' : 'text-gray-500'}`} />
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
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${role === 'admin'
                    ? 'border-primary bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'admin' ? 'bg-primary' : 'bg-gray-200'
                        }`}
                    >
                      <Shield className={`w-6 h-6 ${role === 'admin' ? 'text-gray-900' : 'text-gray-500'}`} />
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
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {(mode === 'login' || (mode === 'signup' && (step === 2 || step === 3))) && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {mode === 'login'
                    ? 'Welcome Back'
                    : step === 2
                      ? 'Create Account'
                      : 'Complete Your Profile'}
                </h3>

                {mode === 'login' && (
                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${role === 'patient'
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                        }`}
                    >
                      <User className="w-4 h-4 inline mr-1" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${role === 'admin'
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                        }`}
                    >
                      <Shield className="w-4 h-4 inline mr-1" />
                      Provider
                    </button>
                  </div>
                )}

                {mode === 'signup' && step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

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
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {mode === 'signup' && step === 3 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="photo-input"
                        />
                        <label
                          htmlFor="photo-input"
                          className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                          {formData.photoPreview ? (
                            <img
                              src={formData.photoPreview}
                              alt="Preview"
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Camera className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-600">Click to upload photo</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                          placeholder="123 Main St, City, State ZIP"
                          rows="3"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {mode === 'login' && (
                  <>
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

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                        Forgot password?
                      </a>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign In'
                      : step === 2
                        ? 'Continue to Profile'
                        : 'Complete Setup'}
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
