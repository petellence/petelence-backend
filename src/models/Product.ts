import { Schema, model, Document } from "mongoose";

export interface IBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface IIngredient {
  name: string;
  amount: string;
  purpose: string;
}

export interface IStoreLink {
  platform: string;   // "Amazon" | "Flipkart" | "Meesho" | any custom label
  url:      string;
  tagline:  string;   // "Prime eligible · Fast delivery"
  price?:   number;
  active:   boolean;
  stockStatus: "in_stock" | "limited" | "out_of_stock";
}

export interface IFAQ {
  question: string;
  answer:   string;
}

export interface ISEO {
  title:       string;
  description: string;
}

export interface IProduct extends Document {
  id:          string;
  name:        string;
  subtitle:    string;
  tagline:     string;
  price:       number;
  mrp:         number;
  size:        string;
  image:       string;
  images:      string[];
  badge:       string;
  badgeColor:  string;
  category:    string;
  concerns:    string[];
  species:     string[];
  benefits:    IBenefit[];
  ingredients: IIngredient[];
  howToUse:    string[];
  storeLinks:  IStoreLink[];
  faqs:        IFAQ[];
  seo:         ISEO;
  description: string;
  inStock:     boolean;
  featured:    boolean;
  sortOrder:   number;
  status:      "draft" | "published" | "archived";
  createdAt:   Date;
  updatedAt:   Date;
}

const benefitSchema = new Schema<IBenefit>({
  icon:        { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const ingredientSchema = new Schema<IIngredient>({
  name:    { type: String, required: true },
  amount:  { type: String, required: true },
  purpose: { type: String, required: true },
}, { _id: false });

const storeLinkSchema = new Schema<IStoreLink>({
  platform:    { type: String, required: true, trim: true },
  url:         { type: String, required: true, trim: true },
  tagline:     { type: String, default: "" },
  price:       { type: Number, min: 0 },
  active:      { type: Boolean, default: true },
  stockStatus: { type: String, enum: ["in_stock", "limited", "out_of_stock"], default: "in_stock" },
}, { _id: false });

const faqSchema = new Schema<IFAQ>({
  question: { type: String, required: true, trim: true },
  answer:   { type: String, required: true, trim: true },
}, { _id: false });

const seoSchema = new Schema<ISEO>({
  title:       { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
}, { _id: false });

const productSchema = new Schema<IProduct>(
  {
    id:          { type: String, required: true, unique: true, trim: true },
    name:        { type: String, required: true, trim: true },
    subtitle:    { type: String, required: true },
    tagline:     { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    mrp:         { type: Number, required: true, min: 0 },
    size:        { type: String, required: true },
    image:       { type: String, required: true },
    images:      [{ type: String }],
    badge:       { type: String, required: true },
    badgeColor:  { type: String, required: true },
    category:    { type: String, default: "Daily Wellness", trim: true, index: true },
    concerns:    [{ type: String, trim: true }],
    species:     [{ type: String }],
    benefits:    [benefitSchema],
    ingredients: [ingredientSchema],
    howToUse:    [{ type: String }],
    storeLinks:  [storeLinkSchema],
    faqs:        [faqSchema],
    seo:         { type: seoSchema, default: () => ({}) },
    description: { type: String, default: "" },
    inStock:     { type: Boolean, default: true },
    featured:    { type: Boolean, default: false },
    sortOrder:   { type: Number, default: 0, index: true },
    status:      { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
