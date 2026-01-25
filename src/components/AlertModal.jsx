import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, type = 'info', title, message }) {
  if (!isOpen) return null;

  const typeConfig = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-900',
      buttonColor: 'bg-amber-500 hover:bg-amber-600',
    },
    critical: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      buttonColor: 'bg-red-500 hover:bg-red-600',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      titleColor: 'text-green-900',
      buttonColor: 'bg-green-500 hover:bg-green-600',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
        <div className={`${config.bgColor} rounded-t-2xl p-6 border-b border-gray-200`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`${config.iconColor} p-2 bg-white rounded-full`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-semibold ${config.titleColor}`}>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 ${config.buttonColor} text-white px-4 py-2.5 rounded-lg font-medium transition-colors`}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
