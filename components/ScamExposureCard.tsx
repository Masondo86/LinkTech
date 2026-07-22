import { ScamExposure } from '@linktech/trust-engine';

export default function ScamExposureCard({ data }: { data: ScamExposure }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
      <h2 className="text-xl font-bold mb-4">🛡️ Scam Exposure</h2>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-2xl font-bold text-red-600">{data.highRiskCount}</div>
          <div className="text-sm text-slate-500">High Risk</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-600">{data.mediumRiskCount}</div>
          <div className="text-sm text-slate-500">Medium Risk</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{data.lowRiskCount}</div>
          <div className="text-sm text-slate-500">Low Risk</div>
        </div>
      </div>
      {data.recentScams.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Recent Scans</h3>
          <ul className="space-y-1 text-sm text-slate-600">
            {data.recentScams.slice(0, 3).map((scam, idx) => (
              <li key={idx} className="border-b border-slate-100 py-1">
                <span className="font-mono">{scam.input}</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                  scam.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  scam.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {scam.riskLevel}
                </span>
                <span className="text-xs text-slate-400 ml-2">{new Date(scam.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}