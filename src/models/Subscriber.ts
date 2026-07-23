import { Schema, model, Document } from "mongoose";

export interface ISubscriber extends Document {
  email:      string;
  active:     boolean;
  source:     string;
  createdAt:  Date;
  updatedAt:  Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

export const Subscriber = model<ISubscriber>("Subscriber", subscriberSchema);
