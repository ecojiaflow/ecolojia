import { useState } from 'react';

export default function AddProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eco_score, setEcoScore] = useState(0.8);
  const [confidence_color, setConfidenceColor] = useState('yellow');

  const submit = async () => {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        title,
        description,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        tags: [],
        zones_dispo: [],
        eco_score,
        ai_confidence: eco_score,
        confidence_pct: Math.round(eco_score * 100),
        confidence_color,
        verified_status: 'manual_review',
        created_at: new Date().toISOString(),
        enriched_at: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      alert('✅ Produit ajouté !');
    } else {
      alert('❌ Erreur lors de l’ajout');
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white space-y-2 max-w-xl mx-auto mt-8">
      <h3 className="text-lg font-bold">Ajouter un produit</h3>
      <input
        placeholder="Titre"
        className="w-full border px-2 py-1 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full border px-2 py-1 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-4">
        <label>Éco-score :</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={eco_score}
          onChange={(e) => setEcoScore(parseFloat(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
      </div>
      <div className="flex gap-4 items-center">
        <label>Confiance IA :</label>
        <select
          value={confidence_color}
          onChange={(e) => setConfidenceColor(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="green">Vert</option>
          <option value="yellow">Jaune</option>
          <option value="red">Rouge</option>
        </select>
      </div>
      <button
        className="bg-eco-green text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={submit}
      >
        Enregistrer
      </button>
    </div>
  );
}
