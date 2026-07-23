import { Request } from "express";

export interface AuthRequest extends Request {
  adminId?: string;
}

export interface JwtPayload {
  adminId: string;
  email: string;
}
