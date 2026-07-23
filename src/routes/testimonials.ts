import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { Testimonial } from "../models/Testimonial";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// ── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/testimonials/admin/all — all testimonials including pending
router.get("/admin/all", protect, asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
}));

// POST /api/testimonials/admin — create testimonial directly from admin
router.post("/admin", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, petName, petType, rating, review, avatar, approved, featured } = req.body;

  if (!name || !petName || !petType || !rating || !review) {
    res.status(400).json({ success: false, message: "name, petName, petType, rating, and review are required" });
    return;
  }

  const testimonial = await Testimonial.create({
    name,
    petName,
    petType,
    rating,
    review,
    avatar: avatar ?? "",
    approved: approved ?? true,
    featured: featured ?? false,
  });

  res.status(201).json({ success: true, data: testimonial });
}));

// ── PUBLIC ──────────────────────────────────────────────────────────────────

// GET /api/testimonials — approved testimonials for the storefront
router.get("/", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { featured } = req.query;
  const filter: Record<string, unknown> = { approved: true };
  if (featured === "true") filter.featured = true;

  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
}));

// GET /api/testimonials/:id — single approved testimonial
router.get("/:id", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findOne({ _id: req.params.id, approved: true });
  if (!testimonial) {
    res.status(404).json({ success: false, message: "Testimonial not found" });
    return;
  }
  res.json({ success: true, data: testimonial });
}));

// POST /api/testimonials — public submission (goes into pending queue)
router.post("/", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, petName, petType, rating, review, avatar } = req.body;

  if (!name || !petName || !petType || !rating || !review) {
    res.status(400).json({ success: false, message: "name, petName, petType, rating, and review are required" });
    return;
  }

  const testimonial = await Testimonial.create({
    name, petName, petType, rating, review,
    avatar: avatar ?? "",
    approved: false,
    featured: false,
  });

  res.status(201).json({ success: true, data: testimonial });
}));

// PUT /api/testimonials/:id — update (approve, feature, edit)
router.put("/:id", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!testimonial) {
    res.status(404).json({ success: false, message: "Testimonial not found" });
    return;
  }
  res.json({ success: true, data: testimonial });
}));

// DELETE /api/testimonials/:id
router.delete("/:id", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    res.status(404).json({ success: false, message: "Testimonial not found" });
    return;
  }
  res.json({ success: true, message: "Testimonial deleted" });
}));

export default router;
