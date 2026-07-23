import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  name:      string;
  petName:   string;
  petType:   string;
  rating:    number;
  review:    string;
  avatar:    string;
  approved:  boolean;
  featured:  boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name:     { type: String, required: true, trim: true },
    petName:  { type: String, required: true, trim: true },
    petType:  { type: String, required: true, trim: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    review:   { type: String, required: true, trim: true, minlength: 10, maxlength: 800 },
    avatar:   { type: String, default: "" },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
