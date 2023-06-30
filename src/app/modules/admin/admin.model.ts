import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { adminRoles } from './admin.constant';
import { IAdmin, IAdminModel } from './admin.interface';

const adminSchema = new Schema<IAdmin, IAdminModel>(
  {
    phoneNumber: {
      unique: true,
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: adminRoles,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
    },
    address: {
      type: String,
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

adminSchema.statics.isAdminExistByPhone = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role' | '_id'> | null> {
  return await AdminModel.findOne(
    { phoneNumber },
    { name: 1, password: 1, role: 1, phoneNumber: 1, _id: 1 }
  ).lean();
};
adminSchema.statics.isAdminExistById = async function (
  id: string
): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role' | '_id'> | null> {
  return await AdminModel.findOne(
    { _id: id },
    { name: 1, password: 1, role: 1, phoneNumber: 1, _id: 1 }
  ).lean();
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre('save', async function (next) {
  //hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );

  next();
});

export const AdminModel = model<IAdmin, IAdminModel>('Admin', adminSchema);
