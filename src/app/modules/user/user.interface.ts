/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id: Types.ObjectId;
  name: IUserName;
  address: string;
  income: number;
  budget: number;
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
};

type IUserModelStaticType = {
  isUserExistByPhone(
    phoneNumber: string
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'>>;
  isUserExistById(
    id: Types.ObjectId
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | '_id'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type IProfile = {
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  password?: string;
  address: string;
};

export type IUserModel = IUserModelStaticType & Model<IUser>;

// export type IUserModel = Model<IUser, Record<string, unknown>>;
