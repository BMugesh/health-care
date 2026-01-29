import { Heart, Activity, Shield, Users, TrendingUp, Clock, Bell, ChevronRight } from 'lucide-react';
import HeartbeatWaveform from '../components/HeartbeatWaveform';
import { useState, useEffect } from 'react';

export default function LandingPage({ onNavigate }) {
  const [scrollY, setScrollY] = useState(0);
  const [stats] = useState([
    { value: 10000, label: 'Patients Monitored', suffix: '+' },
    { value: 99.9, label: 'Uptime Reliability', suffix: '%' },
    { value: 24, label: 'Hour Monitoring', suffix: '/7' },
  ]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Continuous pulse rate tracking with instant updates and live data visualization.',
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Intelligent notifications for abnormal readings with customizable thresholds.',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Shield,
      title: 'Medical-Grade Security',
      description: 'HIPAA-compliant data encryption ensuring complete privacy and security.',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Family Dashboard',
      description: 'Multi-user access for caregivers and family members to monitor loved ones.',
      color: 'text-secondary-600',
      bg: 'bg-secondary-50',
    },
    {
      icon: TrendingUp,
      title: 'Health Analytics',
      description: 'Comprehensive reports and trends to understand long-term health patterns.',
      color: 'text-secondary-700',
      bg: 'bg-secondary-100',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock technical and medical support for peace of mind.',
      color: 'text-primary-700',
      bg: 'bg-primary-100',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up & Connect',
      description: 'Create your account and connect monitoring devices in minutes.',
    },
    {
      number: '02',
      title: 'Set Preferences',
      description: 'Customize alert thresholds and notification settings for your needs.',
    },
    {
      number: '03',
      title: 'Monitor & Relax',
      description: 'Receive real-time updates and rest assured your health is tracked.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
              onClick={() => onNavigate('auth')}
              className="px-6 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <HeartbeatWaveform color="#bbd0ff" height={150} speed={2} />
        </div>

        <div
          className="max-w-6xl mx-auto text-center relative"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Medical-Grade Monitoring Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Caring for Your{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Loved Ones
            </span>
            <br />
            One Heartbeat at a Time
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Advanced pulse rate monitoring designed specifically for elderly care. Real-time tracking,
            intelligent alerts, and peace of mind for families and caregivers.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => onNavigate('auth')}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-gray-900 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Monitoring Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all border-2 border-gray-200">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-12 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-4xl font-bold text-primary-600">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Care Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for complete peace of mind in elderly healthcare monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple setup, powerful monitoring in three easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl font-bold text-primary-200 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-gray-900 shadow-2xl">
            <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" fill="currentColor" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Monitoring Your Loved Ones Today
            </h2>
            <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
              Join thousands of families who trust HealthPulse for reliable, real-time health monitoring
            </p>
            <button
              onClick={() => onNavigate('auth')}
              className="px-10 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-gray-900" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white">HealthPulse</span>
          </div>
          <p className="text-sm">
            © 2024 HealthPulse. Medical-grade elderly care monitoring platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
