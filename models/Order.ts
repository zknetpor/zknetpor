import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    ],
    total: { type: Number, required: true },
    address: {
      receiver: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      postalCode: String
    },
    status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['midtrans', 'cod'], default: 'cod' },
    paymentRef: String,
    trackingNumber: String
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', orderSchema);
export default Order;
