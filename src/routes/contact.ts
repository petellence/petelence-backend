import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { Contact } from "../models/Contact";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────────────────────────

// POST /api/contact — submit a contact message
router.post("/", asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ success: false, message: "Your name is required" });
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, message: "A valid email address is required" });
    return;
  }
  if (!message || message.trim().length < 5) {
    res.status(400).json({ success: false, message: "Please enter a message (at least 5 characters)" });
    return;
  }

  const contact = await Contact.create({
    name: name.trim(),
    email,
    subject: subject?.trim() || "General enquiry",
    message: message.trim(),
    source: "website",
  });

  res.status(201).json({ success: true, message: "Thanks for reaching out! We'll get back to you soon.", data: contact });
}));

// ── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/contact — all messages
router.get("/", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { read } = req.query;
  const filter: Record<string, unknown> = {};
  if (read !== undefined) filter.read = read === "true";

  const messages = await Contact.find(filter).sort({ createdAt: -1 });
  const total  = await Contact.countDocuments();
  const unread = await Contact.countDocuments({ read: false });

  res.json({
    success: true,
    count: messages.length,
    stats: { total, unread, read: total - unread },
    data: messages,
  });
}));

// PATCH /api/contact/:id/toggle — mark read / unread
router.patch("/:id/toggle", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const message = await Contact.findById(req.params.id);
  if (!message) {
    res.status(404).json({ success: false, message: "Message not found" });
    return;
  }
  message.read = !message.read;
  await message.save();
  res.json({ success: true, data: message });
}));

// DELETE /api/contact/:id
router.delete("/:id", protect, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const message = await Contact.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404).json({ success: false, message: "Message not found" });
    return;
  }
  res.json({ success: true, message: "Message removed" });
}));

export default router;
