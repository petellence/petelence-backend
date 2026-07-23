import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth";
import { AuthRequest } from "../types";
import imagekit from "../config/imagekit";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(", ")}`));
    }
  },
});

// POST /api/upload  (admin only, single file)
router.post(
  "/",
  protect,
  upload.single("file"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file provided" });
      return;
    }

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;

    const result = await imagekit.upload({
      file:     req.file.buffer,
      fileName,
      folder:   "/petellence/products",
      useUniqueFileName: false,
    });

    res.json({
      success: true,
      url:     result.url,
      fileId:  result.fileId,
      name:    result.name,
    });
  }
);

// POST /api/upload/auth-token  — generates a short-lived client-side upload token
// useful if you ever want direct browser → ImageKit uploads
router.get("/auth-token", protect, (_req: AuthRequest, res: Response) => {
  const token = imagekit.getAuthenticationParameters();
  res.json({ success: true, ...token });
});

export default router;
