import { TrustSignals } from '@linktech/trust-engine';

export default function TrustSignalsCard({ data }: { data: TrustSignals }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
      <h2 className="text-xl font-bold mb-4">🌐 Trust Signals</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-xl font-bold text-indigo-600">{data.presenceCount}</div>
          <div className="text-slate-500">Social profiles found</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-xl font-bold text-red-600">{data.negativeNews}</div>
          <div className="text-slate-500">Negative news</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-xl font-bold text-green-600">{data.positiveNews}</div>
          <div className="text-slate-500">Positive news</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{data.negativeSearch}</div>
          <div className="text-slate-500">Negative search results</div>
        </div>
      </div>
    </div>
  );
}