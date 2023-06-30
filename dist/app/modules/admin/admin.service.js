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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwt_helpers_1 = require("../../../helpers/jwt.helpers");
const admin_model_1 = require("./admin.model");
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the admin is already exist or not
    const isExist = yield admin_model_1.AdminModel.isAdminExistByPhone(data.phoneNumber);
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin Already exists!');
    }
    const result = yield admin_model_1.AdminModel.create(data);
    return yield admin_model_1.AdminModel.findOne({ phoneNumber: result.phoneNumber });
});
const getAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield admin_model_1.AdminModel.isAdminExistById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin does not exists!');
    }
    return yield admin_model_1.AdminModel.findById(id);
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield admin_model_1.AdminModel.isAdminExistByPhone(phoneNumber);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist!');
    }
    if (isUserExist.password &&
        !(yield admin_model_1.AdminModel.isPasswordMatched(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password does not match!');
    }
    //create access token and refresh token
    const { _id, role } = isUserExist;
    const accessToken = jwt_helpers_1.jwtHelpers.createToken({ id: _id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.createToken({ id: _id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken };
});
exports.AdminService = {
    createAdmin,
    getAdmin,
    loginAdmin,
};
