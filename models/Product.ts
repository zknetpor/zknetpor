import { Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    size: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', productSchema);
export default Product;
