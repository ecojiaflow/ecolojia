"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slugify_1 = __importDefault(require("slugify"));
const router = express_1.default.Router();
// GET /api/products
router.get('/', async (req, res) => {
    try {
        const prisma = req.app.locals.prisma;
        const products = await prisma.product.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
    try {
        const prisma = req.app.locals.prisma;
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug },
        });
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST /api/products
router.post('/', async (req, res) => {
    try {
        const prisma = req.app.locals.prisma;
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'title et description requis' });
        }
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const product = await prisma.product.create({
            data: {
                title,
                description,
                slug,
                confidence_color: 'yellow',
                verified_status: 'manual_review',
                tags: [],
                zones_dispo: [],
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Erreur lors de la création' });
    }
});
exports.default = router;
