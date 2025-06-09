import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Product {
  title: string;
  description: string;
  eco_score?: number | null;
  confidence_pct?: number | null;
  confidence_color?: "green" | "yellow" | "red";
  verified_status?: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Slug manquant dans l'URL");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`);
        if (!res.ok) throw new Error("Produit introuvable");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur : {error}</div>;
  if (!product) return <div className="p-4">Produit introuvable.</div>;

  // Choix couleur badge avec fallback sur "red"
  const badgeColor = product.confidence_color ?? "red";
  const badgeClasses = {
    green: "bg-green-200 text-green-800",
    yellow: "bg-yellow-200 text-yellow-800",
    red: "bg-red-200 text-red-800",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">Éco-score :</span>
        <span>
          {product.eco_score != null
            ? `${Math.round(product.eco_score * 100)}%`
            : "Non évalué"}
        </span>
      </div>

      <div
        className={`inline-block px-2 py-1 rounded text-sm font-medium ${badgeClasses[badgeColor]}`}
      >
        IA : {product.confidence_pct ?? "?"}% confiance
      </div>
    </div>
  );
}
