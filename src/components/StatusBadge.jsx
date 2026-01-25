export default function StatusBadge({ status = 'normal', size = 'medium' }) {
  const statusConfig = {
    normal: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-500',
      label: 'Normal',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      label: 'Warning',
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      dot: 'bg-red-500',
      label: 'Critical',
    },
    offline: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      dot: 'bg-gray-500',
      label: 'Offline',
    },
  };

  const sizeConfig = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const dotSize = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-2.5 h-2.5',
  };

  const config = statusConfig[status] || statusConfig.normal;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} ${sizeConfig[size]} rounded-full font-medium`}
    >
      <span className={`${dotSize[size]} ${config.dot} rounded-full animate-pulse`}></span>
      {config.label}
    </span>
  );
}
