interface Hit {
  objectID: string;
  title?: string;
  description?: string;
  confidence_color?: 'green' | 'yellow' | 'red';
  eco_score?: number;
  slug?: string;
}

const badgeColor: Record<string, string> = {
  green: 'bg-eco-green text-white',
  yellow: 'bg-yellow-400 text-black',
  red: 'bg-red-600 text-white',
};

export default function ProductCard({ hit }: { hit: Hit }) {
  const color = hit.confidence_color || 'yellow';

  return (
    <div className="p-4 rounded-xl border shadow bg-white space-y-2 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold truncate">{hit.title || 'Sans titre'}</h2>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor[color]}`}>
          {color.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">
        {hit.description || 'Aucune description.'}
      </p>
      {hit.eco_score !== undefined && (
        <div className="text-sm">
          🌱 Éco-score : <strong>{hit.eco_score}</strong>
        </div>
      )}
    </div>
  );
}
