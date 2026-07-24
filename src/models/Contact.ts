import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  name:      string;
  email:     string;
  subject:   string;
  message:   string;
  read:      boolean;
  source:    string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, default: "General enquiry", trim: true },
    message: { type: String, required: true, trim: true },
    read:    { type: Boolean, default: false },
    source:  { type: String, default: "website" },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
