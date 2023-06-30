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
exports.MyProfileService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const admin_model_1 = require("../admin/admin.model");
const user_model_1 = require("../user/user.model");
const getProfileDetails = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = userData;
    const getOptions = {
        phoneNumber: 1,
        name: 1,
        address: 1,
    };
    if (role === 'admin') {
        return yield admin_model_1.AdminModel.findOne({ _id: id }, getOptions).lean();
    }
    return yield user_model_1.UserModel.findOne({ _id: id }, getOptions).lean();
});
const updateProfile = (id, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = payload, userData = __rest(payload, ["name", "password"]);
    const updatedProfileData = Object.assign({}, userData);
    let newPassword = null;
    if (password) {
        newPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_round));
        updatedProfileData.password = newPassword;
    }
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedProfileData[nameKey] = name[key];
        });
    }
    let result = null;
    const selectableFields = 'name phoneNumber address';
    if (role !== 'admin') {
        result = yield user_model_1.UserModel.findOneAndUpdate({ _id: id }, updatedProfileData, {
            new: true,
        })
            .select(selectableFields)
            .lean();
    }
    else {
        result = yield admin_model_1.AdminModel.findOneAndUpdate({ _id: id }, updatedProfileData, {
            new: true,
        })
            .select(selectableFields)
            .lean();
    }
    return result;
});
exports.MyProfileService = {
    getProfileDetails,
    updateProfile,
};
