/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ILocation =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: ILocation;
  breed:
    | 'Brahman'
    | 'Nellore'
    | 'Sahiwal'
    | 'Gir'
    | 'Indigenous'
    | 'Tharparkar'
    | 'Kankrej';
  weight: number;
  label?: 'for sale' | 'sold out';
  category: 'Beef' | 'Dairy' | 'Dual Purpose';
  seller: Types.ObjectId | IUser;
};

export type ICowFilers = {
  searchTerm?: string;
};

type ICowModelStaticType = {
  isCowExistBySellerId(
    id: string,
    sellerId: Types.ObjectId
  ): Promise<Pick<ICow, 'name' | 'seller'>>;
};

export type ICowModel = ICowModelStaticType &
  Model<ICow, Record<string, unknown>>;
