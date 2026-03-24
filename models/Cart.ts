import { Schema, model, models } from 'mongoose';

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        qty: Number,
        size: String,
        color: String,
        image: String
      }
    ]
  },
  { timestamps: true }
);

const Cart = models.Cart || model('Cart', cartSchema);
export default Cart;
