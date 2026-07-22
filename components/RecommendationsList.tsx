export default function RecommendationsList({ recommendations }: { recommendations: string[] }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-800 mb-3">📋 Recommended Actions</h2>
      <ul className="list-disc pl-5 space-y-2 text-slate-700">
        {recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}