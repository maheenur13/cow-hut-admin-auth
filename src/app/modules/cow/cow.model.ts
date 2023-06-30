import { Schema, Types, model } from 'mongoose';
import { cowBreedEnums, cowLocationsEnums } from './cow.constants';
import { ICow, ICowModel } from './cow.interface';

const cowSchema = new Schema<ICow, ICowModel>(
  {
    name: {
      required: true,
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: cowLocationsEnums,
      required: true,
    },
    breed: {
      type: String,
      required: true,
      enum: cowBreedEnums,
    },
    weight: {
      type: Number,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      enum: ['for sale', 'sold out'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Dairy', 'Beef', 'Dual Purpose'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

cowSchema.statics.isCowExistBySellerId = async function (
  id: Types.ObjectId,
  sellerId: Types.ObjectId
): Promise<Pick<ICow, 'name' | 'seller'> | null> {
  return await CowModel.findOne(
    { _id: id, seller: sellerId },
    { name: 1, seller: 1 }
  );
};

export const CowModel = model<ICow, ICowModel>('Cow', cowSchema);
