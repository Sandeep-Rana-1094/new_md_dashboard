
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'green' | 'purple';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change && change.startsWith('+');

  const colorConfig = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
    amber: {
      border: 'border-amber-500',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
    },
  };
  
  const selectedColor = colorConfig[color];

  return (
    <div className={`bg-surface/50 backdrop-blur-sm p-5 rounded-xl border border-border-default border-l-4 ${selectedColor.border} transition-all hover:border-l-4 hover:${selectedColor.border} hover:bg-surface/80 flex items-center space-x-4`}>
        <div className={`p-3 rounded-full ${selectedColor.bg} ${selectedColor.text}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {change && (
              <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
            )}
          </div>
        </div>
    </div>
  );
};

export default KpiCard;