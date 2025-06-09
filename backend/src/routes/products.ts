import express from 'express';
import slugify from 'slugify';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
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
  } catch (error) {
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

    const slug = slugify(title, { lower: true, strict: true });

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
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erreur lors de la création' });
  }
});

export default router;
