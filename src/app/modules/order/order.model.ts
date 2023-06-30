import { Schema, model } from 'mongoose';
import { IOrder, IOrderModel } from './order.interfaces';

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const OrderModel = model<IOrder, IOrderModel>('Order', orderSchema);
