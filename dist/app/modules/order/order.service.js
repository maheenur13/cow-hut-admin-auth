"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    // initialize the variables for new update values
    const newCowData = {};
    const newBuyerData = {};
    const newSellerData = {};
    // getting cow information
    const cowData = yield cow_model_1.CowModel.findById(orderData.cow);
    // getting seller information
    const sellerData = yield user_model_1.UserModel.findById(cowData === null || cowData === void 0 ? void 0 : cowData.seller);
    // getting buyer information
    const buyerData = yield user_model_1.UserModel.findById(orderData.buyer);
    if (cowData && cowData.label === 'sold out') {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This cow is already sold out!Please choose another one!');
    }
    if (buyerData && cowData && buyerData.budget < cowData.price) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Buyer don't have enough budget! Please increase the budget amount!");
    }
    let newOrder = null;
    const session = yield mongoose_1.default.startSession();
    try {
        if (buyerData && cowData && sellerData) {
            session.startTransaction();
            newCowData.label = 'sold out';
            newBuyerData.budget = buyerData.budget - cowData.price;
            newSellerData.income = sellerData.income + cowData.price;
            yield user_model_1.UserModel.findByIdAndUpdate(buyerData._id, newBuyerData);
            yield user_model_1.UserModel.findByIdAndUpdate(sellerData._id, newSellerData);
            yield cow_model_1.CowModel.findByIdAndUpdate(cowData._id, newCowData);
            newOrder = (yield (yield order_model_1.OrderModel.create(orderData)).populate('cow')).populate('buyer');
            yield session.commitTransaction();
            yield session.endSession();
        }
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newOrder;
});
const getAllService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = payload;
    let query = {};
    if (role !== 'admin') {
        query = { $or: [{ seller: id }, { buyer: id }] }; // Query to match seller or buyer ID
    }
    const result = yield order_model_1.OrderModel.find(query)
        .populate({
        path: 'cow',
        populate: [{ path: 'seller' }],
    })
        .populate('buyer');
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No orders found!');
    }
    return result;
});
const getSingleOrder = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = payload;
    let query = {};
    if (role === 'buyer') {
        query = { _id: orderId, buyer: id }; // Query to match seller or buyer ID
    }
    else if (role === 'seller') {
        query = { _id: orderId, 'cow.seller': id };
    }
    const result = yield order_model_1.OrderModel.findOne(query)
        .populate({
        path: 'cow',
        populate: [{ path: 'seller' }],
    })
        .populate('buyer')
        .lean();
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No order found!');
    }
    return result;
});
exports.OrderService = {
    createOrder,
    getAllService,
    getSingleOrder,
};
