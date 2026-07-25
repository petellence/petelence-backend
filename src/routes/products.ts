import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { Product } from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function cleanList<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function cleanStringList(value: unknown): string[] {
  return cleanList(value as string[] | undefined)
    .map(item => String(item).trim())
    .filter(Boolean);
}

function normalizeProductPayload(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const id = slugify(String(body.id ?? name));
  const status = ["draft", "published", "archived"].includes(String(body.status))
    ? String(body.status)
    : "published";

  return {
    ...body,
    id,
    name,
    subtitle: String(body.subtitle ?? "").trim(),
    tagline: String(body.tagline ?? "").trim(),
    size: String(body.size ?? "").trim(),
    image: String(body.image ?? "").trim(),
    badge: String(body.badge ?? "").trim(),
    badgeColor: String(body.badgeColor ?? "#7B1428").trim(),
    price: Number(body.price ?? 0),
    mrp: Number(body.mrp ?? 0),
    category: String(body.category ?? "Daily Wellness").trim(),
    concerns: cleanStringList(body.concerns),
    species: cleanStringList(body.species),
    benefits: cleanList(body.benefits as unknown[] | undefined),
    ingredients: cleanList(body.ingredients as unknown[] | undefined),
    howToUse: cleanStringList(body.howToUse),
    images: cleanStringList(body.images),
    storeLinks: cleanList(body.storeLinks as Record<string, unknown>[] | undefined)
      .map(link => ({
        platform: String(link.platform ?? "").trim(),
        url: String(link.url ?? "").trim(),
        tagline: String(link.tagline ?? "").trim(),
        price: link.price === undefined || link.price === null || link.price === "" ? undefined : Number(link.price),
        active: link.active !== false,
        stockStatus: ["in_stock", "limited", "out_of_stock"].includes(String(link.stockStatus))
          ? String(link.stockStatus)
          : "in_stock",
      }))
      .filter(link => link.platform && link.url),
    faqs: cleanList(body.faqs as Record<string, unknown>[] | undefined)
      .map(faq => ({
        question: String(faq.question ?? "").trim(),
        answer: String(faq.answer ?? "").trim(),
      }))
      .filter(faq => faq.question && faq.answer),
    seo: {
      title: String((body.seo as { title?: unknown } | undefined)?.title ?? "").trim(),
      description: String((body.seo as { description?: unknown } | undefined)?.description ?? "").trim(),
    },
    inStock: Boolean(body.inStock),
    featured: Boolean(body.featured),
    sortOrder: Number(body.sortOrder ?? 0),
    status,
  };
}

// GET /api/products — public, supports ?search=&species=&category=&concern=&inStock=&includeDrafts=
router.get("/", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { search, species, category, concern, inStock, includeDrafts } = req.query;

  const filter: Record<string, unknown> = {};

  if (includeDrafts !== "true") filter["status"] = "published";
  if (search) {
    const rx = new RegExp(String(search), "i");
    filter["$or"] = [{ name: rx }, { subtitle: rx }, { tagline: rx }, { category: rx }, { concerns: rx }];
  }
  if (species) filter["species"] = { $in: [String(species)] };
  if (category) filter["category"] = String(category);
  if (concern) filter["concerns"] = { $in: [String(concern)] };
  if (inStock !== undefined) filter["inStock"] = inStock === "true";

  const products = await Product.find(filter).sort({ sortOrder: 1, featured: -1, createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
}));

// GET /api/products/categories — public, distinct categories with product counts
router.get("/categories", asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const rows = await Product.aggregate<{ _id: string; count: number }>([
    { $match: { status: "published" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const data = rows
    .filter(r => r._id)
    .map(r => ({ category: r._id, count: r.count }));

  res.json({ success: true, count: data.length, data });
}));

// GET /api/products/:id — public
router.get("/:id", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, data: product });
}));

// POST /api/products — admin only
router.post("/", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = normalizeProductPayload(req.body);
  const product = await Product.create(payload);
  res.status(201).json({ success: true, data: product });
}));

// PUT /api/products/:id — admin only
router.put("/:id", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = normalizeProductPayload({ ...req.body, id: req.params.id });
  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    payload,
    { new: true, runValidators: true }
  );
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, data: product });
}));

// DELETE /api/products/:id — admin only
router.delete("/:id", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findOneAndDelete({ id: req.params.id });
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, message: "Product deleted" });
}));

export default router;
