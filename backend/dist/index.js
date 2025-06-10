"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const algoliasearch = require('algoliasearch');
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ GET /api/prisma/products
app.get('/api/prisma/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        console.error('GET error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// ✅ POST /api/prisma/products
app.post('/api/prisma/products', async (req, res) => {
    try {
        const data = req.body;
        const eco_score = parseFloat(data.eco_score || 0);
        const eco_score_bucket = eco_score >= 0.9 ? '> 0.9' :
            eco_score >= 0.8 ? '0.8 - 0.9' : '< 0.8';
        const tags = Array.isArray(data.tags) ? data.tags : [];
        const zones_dispo = Array.isArray(data.zones_dispo) ? data.zones_dispo : [];
        const confidence_color = ['green', 'yellow', 'red'].includes(data.confidence_color)
            ? data.confidence_color
            : 'yellow';
        const verified_status = ['verified', 'manual_review'].includes(data.verified_status)
            ? data.verified_status
            : 'manual_review';
        const product = await prisma.product.create({
            data: {
                id: data.id,
                title: data.title,
                description: data.description,
                slug: data.slug,
                brand: data.brand,
                category: data.category,
                tags,
                zones_dispo,
                eco_score,
                eco_score_bucket,
                ai_confidence: data.ai_confidence,
                confidence_pct: data.confidence_pct,
                confidence_color: client_1.ConfidenceColor[confidence_color],
                verified_status: client_1.VerifiedStatus[verified_status],
                prices: data.prices,
                affiliate_url: data.affiliate_url,
                resume_fr: data.resume_fr,
                resume_en: data.resume_en,
                enriched_at: new Date(data.enriched_at),
                created_at: new Date(data.created_at)
            }
        });
        const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
        const index = client.initIndex('products');
        await index.saveObject({
            objectID: product.id,
            title: product.title,
            description: product.description,
            slug: product.slug,
            brand: product.brand,
            category: product.category,
            tags: product.tags ?? [],
            zones_dispo: product.zones_dispo ?? [],
            eco_score: parseFloat(product.eco_score),
            eco_score_bucket: product.eco_score_bucket ?? 'inconnu',
            ai_confidence: parseFloat(product.ai_confidence),
            confidence_pct: product.confidence_pct,
            confidence_color: product.confidence_color,
            prices: product.prices,
            affiliate_url: product.affiliate_url,
            resume_fr: product.resume_fr,
            resume_en: product.resume_en
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error('POST error:', error);
        res.status(400).json({ error: 'Erreur ajout produit' });
    }
});
// ✅ DELETE /api/prisma/products/:id — suppression d'un produit
app.delete('/api/prisma/products/:id', async (req, res) => {
    try {
        const deleted = await prisma.product.delete({
            where: { id: req.params.id }
        });
        res.json({ deleted });
    }
    catch (err) {
        console.error('DELETE error:', err);
        res.status(404).json({ error: 'Produit introuvable ou déjà supprimé' });
    }
});
// ✅ POST /api/suggest
app.post('/api/suggest', async (req, res) => {
    try {
        const { query, zone, lang } = req.body;
        if (!query || !zone || !lang) {
            return res.status(400).json({ error: 'query, zone and lang required' });
        }
        const suggestURL = process.env.N8N_SUGGEST_URL;
        if (!suggestURL) {
            return res.status(500).json({ error: 'N8N_SUGGEST_URL manquant dans .env' });
        }
        const response = await fetch(suggestURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, zone, lang })
        });
        const result = await response.json();
        res.json(result);
    }
    catch (err) {
        console.error('Erreur IA suggest:', err);
        res.status(500).json({ error: 'Erreur lors de la suggestion IA' });
    }
});
// ✅ GET /
app.get('/', (req, res) => {
    res.send('Hello from Ecolojia backend!');
});
// ✅ GET /health
app.get('/health', (req, res) => {
    res.json({ status: 'up' });
});
// ✅ GET /init-db
app.get('/init-db', async (req, res) => {
    try {
        (0, child_process_1.execSync)('npx prisma db push');
        res.send('✅ Base de données synchronisée avec Prisma.');
    }
    catch (error) {
        console.error('❌ Erreur db push:', error);
        res.status(500).send('Erreur lors du db push');
    }
});
// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ API running on port ${PORT}`);
});
