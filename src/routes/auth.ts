import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import { protect } from "../middleware/auth";
import { AuthRequest } from "../types";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required" });
    return;
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { adminId: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as jwt.SignOptions
  );

  res.json({
    success: true,
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  });
});

// GET /api/auth/me
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.adminId).select("-password");
  if (!admin) {
    res.status(404).json({ success: false, message: "Admin not found" });
    return;
  }
  res.json({ success: true, admin });
});

export default router;
