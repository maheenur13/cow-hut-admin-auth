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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const pagination_helpers_1 = require("../../../helpers/pagination.helpers");
const user_model_1 = require("../user/user.model");
const cow_constants_1 = require("./cow.constants");
const cow_model_1 = require("./cow.model");
// create cow
const createCow = (cowData) => __awaiter(void 0, void 0, void 0, function* () {
    const isSellerValid = yield user_model_1.UserModel.findById(cowData.seller);
    if (!isSellerValid || isSellerValid.role !== 'seller') {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'invalid seller!');
    }
    if (!cowData.label) {
        cowData.label = 'for sale';
    }
    const newCow = (yield cow_model_1.CowModel.create(cowData)).populate('seller');
    return newCow;
});
// get all cow
const getAllCow = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = pagination_helpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constants_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                let newData = {};
                if (field === 'minPrice') {
                    newData = {
                        price: { $gte: Number(value) },
                    };
                }
                else if (field === 'maxPrice') {
                    newData = {
                        price: { $lte: Number(value) },
                    };
                }
                else if (field === 'location') {
                    newData = {
                        location: { $regex: value, $options: 'i' },
                    };
                }
                else {
                    newData = {
                        [field]: value,
                    };
                }
                return newData;
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.CowModel.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .lean();
    const total = yield cow_model_1.CowModel.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single cow
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.CowModel.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow do not exist!');
    }
    return yield cow_model_1.CowModel.findById(id).populate('seller');
});
// delete cow
const deleteCow = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.CowModel.isCowExistBySellerId(id, userData.id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow do not exist!');
    }
    return yield cow_model_1.CowModel.findByIdAndDelete(id).populate('seller');
});
// update single cow
const updateCow = (userData, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.CowModel.isCowExistBySellerId(id, userData.id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow do not exist!');
    }
    const updatedUserData = Object.assign({}, payload);
    const result = yield cow_model_1.CowModel.findByIdAndUpdate(id, updatedUserData, {
        new: true,
    }).populate('seller');
    return result;
});
exports.CowService = {
    createCow,
    getAllCow,
    getSingleCow,
    deleteCow,
    updateCow,
};
