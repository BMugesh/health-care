import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PulseGauge({ value = 72, size = 'large', animated = true }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      let current = 0;
      const increment = value / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const getStatus = () => {
    if (value < 60 || value > 100) return 'critical';
    if (value < 65 || value > 90) return 'warning';
    return 'normal';
  };

  const status = getStatus();
  const statusColors = {
    normal: 'from-green-400 to-green-600',
    warning: 'from-amber-400 to-amber-600',
    critical: 'from-red-400 to-red-600',
  };

  const percentage = Math.min((value / 120) * 100, 100);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56',
    xlarge: 'w-72 h-72',
  };

  const textSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
    xlarge: 'text-7xl',
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
          strokeDashoffset={2 * Math.PI * 45 * (1 - percentage / 100)}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={`stop-color-${status}`} stopColor={status === 'normal' ? '#7ED321' : status === 'warning' ? '#F5A623' : '#FF6B6B'} />
            <stop offset="100%" className={`stop-color-${status}`} stopColor={status === 'normal' ? '#5FB304' : status === 'warning' ? '#D68910' : '#E84545'} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Heart
          className={`${size === 'large' || size === 'xlarge' ? 'w-12 h-12 mb-2' : 'w-6 h-6 mb-1'} ${status === 'normal' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'} animate-pulse`}
          fill="currentColor"
        />
        <div className={`${textSizes[size]} font-bold ${status === 'normal' ? 'text-green-600' : status === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
          {displayValue}
        </div>
        <div className="text-sm text-gray-500 font-medium">BPM</div>
      </div>
    </div>
  );
}
