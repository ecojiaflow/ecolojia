import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { PrismaClient, ConfidenceColor, VerifiedStatus } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/prisma/products', async (req, res) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({
      data: {
        id: data.id || crypto.randomUUID(),
        title: data.title || 'Titre manquant',
        description: data.description || 'Description manquante',
        slug: data.slug || (data.title ? data.title.toLowerCase().replace(/\s+/g, '-') : 'produit-sans-slug'),
        brand: data.brand || 'Non spécifié',
        category: data.category || 'Autre',
        tags: Array.isArray(data.tags) ? data.tags : [],
        images: Array.isArray(data.images) ? data.images : [],
        zones_dispo: Array.isArray(data.zones_dispo) ? data.zones_dispo : [],
        prices: typeof data.prices === 'object' && data.prices !== null ? data.prices : { EUR: 0 },
        affiliate_url: data.affiliate_url || '',
        eco_score: typeof data.eco_score === 'number' ? data.eco_score : null,
        ai_confidence: typeof data.ai_confidence === 'number' ? data.ai_confidence : null,
        confidence_pct: typeof data.confidence_pct === 'number' ? data.confidence_pct : null,
        confidence_color: ConfidenceColor[data.confidence_color as keyof typeof ConfidenceColor] || ConfidenceColor.yellow,
        verified_status: VerifiedStatus[data.verified_status as keyof typeof VerifiedStatus] || VerifiedStatus.manual_review,
        resume_fr: data.resume_fr || '',
        resume_en: data.resume_en || '',
        enriched_at: data.enriched_at ? new Date(data.enriched_at) : new Date(),
        created_at: data.created_at ? new Date(data.created_at) : new Date()
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('POST error:', error);
    res.status(400).json({ error: 'Erreur ajout produit', details: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
