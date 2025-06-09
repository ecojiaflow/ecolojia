"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Route santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Route de création produit
app.post('/api/prisma/products', async (req, res) => {
    try {
        const data = req.body;
        const product = await prisma.product.create({
            data: {
                id: data.id || crypto_1.default.randomUUID(),
                title: data.title || 'Titre manquant',
                description: data.description || 'Description manquante',
                slug: data.slug ||
                    (data.title
                        ? data.title.toLowerCase().replace(/\s+/g, '-')
                        : 'produit-sans-slug'),
                brand: data.brand || 'Non spécifié',
                category: data.category || 'Autre',
                tags: Array.isArray(data.tags) ? data.tags : [],
                images: Array.isArray(data.images) ? data.images : [],
                zones_dispo: Array.isArray(data.zones_dispo) ? data.zones_dispo : [],
                prices: typeof data.prices === 'object' && data.prices !== null
                    ? data.prices
                    : { EUR: 0 },
                affiliate_url: data.affiliate_url || '',
                eco_score: typeof data.eco_score === 'number' ? data.eco_score : null,
                ai_confidence: typeof data.ai_confidence === 'number' ? data.ai_confidence : null,
                confidence_pct: typeof data.confidence_pct === 'number'
                    ? data.confidence_pct
                    : null,
                confidence_color: client_1.ConfidenceColor[data.confidence_color] ||
                    client_1.ConfidenceColor.yellow,
                verified_status: client_1.VerifiedStatus[data.verified_status] ||
                    client_1.VerifiedStatus.manual_review,
                resume_fr: data.resume_fr || '',
                resume_en: data.resume_en || '',
                enriched_at: data.enriched_at
                    ? new Date(data.enriched_at)
                    : new Date(),
                created_at: data.created_at
                    ? new Date(data.created_at)
                    : new Date(),
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error('POST error:', error);
        res
            .status(400)
            .json({ error: 'Erreur ajout produit', details: error.message });
    }
});
// Lancement serveur
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
