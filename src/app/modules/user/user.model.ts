import bcrypt from 'bcrypt';
import { Schema, Types, model } from 'mongoose';
import config from '../../../config';
import { userRoles } from './user.constant';
import { IUser, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel>(
  {
    phoneNumber: {
      unique: true,
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: userRoles,
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

    income: {
      type: Number,
    },
    budget: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExistByPhone = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'> | null> {
  return await UserModel.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1, _id: 1 }
  );
};
userSchema.statics.isUserExistById = async function (
  id: Types.ObjectId
): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'> | null> {
  return await UserModel.findOne(
    { _id: id },
    { phoneNumber: 1, password: 1, role: 1, _id: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  //hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );

  next();
});

export const UserModel = model<IUser, IUserModel>('User', userSchema);
