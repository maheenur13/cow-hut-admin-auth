import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { ICow } from '../cow/cow.interface';
import { CowModel } from '../cow/cow.model';
import { IUser } from '../user/user.interface';
import { UserModel } from '../user/user.model';
import { IOrder } from './order.interfaces';
import { OrderModel } from './order.model';

const createOrder = async (orderData: IOrder): Promise<IOrder | null> => {
  // initialize the variables for new update values
  const newCowData: Partial<ICow> = {};
  const newBuyerData: Partial<IUser> = {};
  const newSellerData: Partial<IUser> = {};

  // getting cow information
  const cowData = await CowModel.findById(orderData.cow);

  // getting seller information
  const sellerData = await UserModel.findById(cowData?.seller);

  // getting buyer information
  const buyerData = await UserModel.findById(orderData.buyer);

  if (cowData && cowData.label === 'sold out') {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This cow is already sold out!Please choose another one!'
    );
  }

  if (buyerData && cowData && buyerData.budget < cowData.price) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Buyer don't have enough budget! Please increase the budget amount!"
    );
  }
  let newOrder = null;
  const session = await mongoose.startSession();
  try {
    if (buyerData && cowData && sellerData) {
      session.startTransaction();

      newCowData.label = 'sold out';

      newBuyerData.budget = buyerData.budget - cowData.price;
      newSellerData.income = sellerData.income + cowData.price;

      await UserModel.findByIdAndUpdate(buyerData._id, newBuyerData);
      await UserModel.findByIdAndUpdate(sellerData._id, newSellerData);
      await CowModel.findByIdAndUpdate(cowData._id, newCowData);
      newOrder = (
        await (await OrderModel.create(orderData)).populate('cow')
      ).populate('buyer');

      await session.commitTransaction();
      await session.endSession();
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newOrder;
};

const getAllService = async (payload: JwtPayload): Promise<IOrder[]> => {
  const { id, role } = payload;

  let query = {};

  if (role !== 'admin') {
    query = { $or: [{ seller: id }, { buyer: id }] }; // Query to match seller or buyer ID
  }

  const result = await OrderModel.find(query)
    .populate({
      path: 'cow',
      populate: [{ path: 'seller' }],
    })
    .populate('buyer');
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No orders found!');
  }
  return result;
};
const getSingleOrder = async (
  orderId: string,
  payload: JwtPayload
): Promise<IOrder> => {
  const { id, role } = payload;

  let query = {};

  if (role === 'buyer') {
    query = { _id: orderId, buyer: id }; // Query to match seller or buyer ID
  } else if (role === 'seller') {
    query = { _id: orderId, 'cow.seller': id };
  }

  const result = await OrderModel.findOne(query)
    .populate({
      path: 'cow',
      populate: [{ path: 'seller' }],
    })
    .populate('buyer')
    .lean();
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No order found!');
  }
  return result;
};

export const OrderService = {
  createOrder,
  getAllService,
  getSingleOrder,
};
