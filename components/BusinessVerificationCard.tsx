import { BusinessVerification } from '@linktech/trust-engine';

export default function BusinessVerificationCard({ data }: { data: BusinessVerification }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-6">
      <h2 className="text-xl font-bold mb-4">🏢 Business Verification</h2>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">FSCA:</span>
          <span className={data.fscaRegistered ? 'text-green-600' : 'text-red-600'}>
            {data.fscaRegistered ? '✅ Registered' : '❌ Not registered'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">NCR:</span>
          <span className={data.ncrRegistered ? 'text-green-600' : 'text-red-600'}>
            {data.ncrRegistered ? '✅ Registered' : '❌ Not registered'}
          </span>
        </div>
        {data.details && (
          <p className="text-xs text-slate-500 mt-2">{data.details}</p>
        )}
      </div>
    </div>
  );
}