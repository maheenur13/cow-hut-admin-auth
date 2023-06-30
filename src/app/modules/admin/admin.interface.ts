/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};
export type IAdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id: Types.ObjectId;
  name: IAdminName;
  address: string;
  phoneNumber: string;
  role: 'admin';
  password: string;
};

type IAdminModelStaticType = {
  isAdminExistByPhone(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role' | '_id'>>;
  isAdminExistById(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'phoneNumber' | 'password' | 'role' | '_id'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type IAdminModel = IAdminModelStaticType & Model<IAdmin>;
