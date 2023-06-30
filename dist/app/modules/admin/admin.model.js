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
exports.AdminModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const admin_constant_1 = require("./admin.constant");
const adminSchema = new mongoose_1.Schema({
    phoneNumber: {
        unique: true,
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: admin_constant_1.adminRoles,
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
adminSchema.statics.isAdminExistByPhone = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.AdminModel.findOne({ phoneNumber }, { name: 1, password: 1, role: 1, phoneNumber: 1, _id: 1 }).lean();
    });
};
adminSchema.statics.isAdminExistById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.AdminModel.findOne({ _id: id }, { name: 1, password: 1, role: 1, phoneNumber: 1, _id: 1 }).lean();
    });
};
adminSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
adminSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //hashing user password
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_round));
        next();
    });
});
exports.AdminModel = (0, mongoose_1.model)('Admin', adminSchema);
