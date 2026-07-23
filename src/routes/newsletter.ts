import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { Subscriber } from "../models/Subscriber";

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────────────────────────

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req: Request, res: Response): Promise<void> => {
  const { email, source } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, message: "A valid email address is required" });
    return;
  }

  const existing = await Subscriber.findOne({ email });

  if (existing) {
    if (existing.active) {
      res.status(409).json({ success: false, message: "This email is already subscribed" });
      return;
    }
    // Re-activate a previously unsubscribed address
    existing.active = true;
    await existing.save();
    res.json({ success: true, message: "Welcome back! You're subscribed again.", data: existing });
    return;
  }

  const subscriber = await Subscriber.create({ email, source: source ?? "website" });
  res.status(201).json({ success: true, message: "Successfully subscribed!", data: subscriber });
});

// POST /api/newsletter/unsubscribe
router.post("/unsubscribe", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  const subscriber = await Subscriber.findOne({ email });
  if (!subscriber) {
    res.status(404).json({ success: false, message: "Email not found" });
    return;
  }

  subscriber.active = false;
  await subscriber.save();
  res.json({ success: true, message: "Unsubscribed successfully" });
});

// ── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/newsletter/subscribers — all subscribers
router.get("/subscribers", protect, async (req: Request, res: Response): Promise<void> => {
  const { active } = req.query;
  const filter: Record<string, unknown> = {};
  if (active !== undefined) filter.active = active === "true";

  const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 });
  const total  = await Subscriber.countDocuments();
  const active_ = await Subscriber.countDocuments({ active: true });

  res.json({
    success: true,
    count: subscribers.length,
    stats: { total, active: active_, inactive: total - active_ },
    data: subscribers,
  });
});

// DELETE /api/newsletter/subscribers/:id
router.delete("/subscribers/:id", protect, async (req: Request, res: Response): Promise<void> => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) {
    res.status(404).json({ success: false, message: "Subscriber not found" });
    return;
  }
  res.json({ success: true, message: "Subscriber removed" });
});

// PATCH /api/newsletter/subscribers/:id/toggle — activate / deactivate
router.patch("/subscribers/:id/toggle", protect, async (req: Request, res: Response): Promise<void> => {
  const subscriber = await Subscriber.findById(req.params.id);
  if (!subscriber) {
    res.status(404).json({ success: false, message: "Subscriber not found" });
    return;
  }
  subscriber.active = !subscriber.active;
  await subscriber.save();
  res.json({ success: true, data: subscriber });
});

export default router;
