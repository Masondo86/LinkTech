'use client';

interface RiskGaugeProps {
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const colorMap = {
    Low: 'text-green-600',
    Medium: 'text-yellow-600',
    High: 'text-orange-600',
    Critical: 'text-red-600',
  };

  const bgMap = {
    Low: 'bg-green-100',
    Medium: 'bg-yellow-100',
    High: 'bg-orange-100',
    Critical: 'bg-red-100',
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            r="45"
            cx="60"
            cy="60"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            r="45"
            cx="60"
            cy="60"
            fill="none"
            stroke="#6366f1"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <div>
        <span className={`text-2xl font-bold ${colorMap[level]}`}>{level}</span>
        <p className="text-sm text-slate-500">Risk level</p>
      </div>
    </div>
  );
}