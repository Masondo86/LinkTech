import { DigitalFootprint } from '@linktech/trust-engine';

export default function DigitalFootprintCard({ data }: { data: DigitalFootprint }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
      <h2 className="text-xl font-bold mb-4">🔍 Digital Footprint</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-slate-100 py-1">
          <span>Breaches found</span>
          <span className="font-semibold">{data.breaches.length}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <span>Email valid</span>
          <span className="font-semibold">{data.emailValid ? '✅' : '❌'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <span>Phone risk</span>
          <span className="font-semibold">{data.phoneRisk !== null ? `${data.phoneRisk}%` : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Device score</span>
          <span className="font-semibold">{data.deviceScore !== null ? `${data.deviceScore}%` : 'N/A'}</span>
        </div>
        {data.breaches.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-semibold text-red-700 text-sm">Breaches:</p>
            <ul className="list-disc pl-5 text-red-600 text-sm">
              {data.breaches.slice(0, 5).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}