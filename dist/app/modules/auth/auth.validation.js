"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("../user/user.constant");
const signUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'password required!' }),
        role: zod_1.z.enum([...user_constant_1.userRoles], {
            required_error: 'Role required!',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name required!' }),
            lastName: zod_1.z.string({ required_error: 'Last Name required!' }),
        }),
        address: zod_1.z.string({ required_error: 'Address required!' }),
        budget: zod_1.z.number({ required_error: 'Budget required!' }),
        income: zod_1.z.number({ required_error: 'Income required!' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number required!' }),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'password required!' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number required!' }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
exports.AuthValidation = {
    refreshTokenZodSchema,
    signUpZodSchema,
    loginZodSchema,
};
