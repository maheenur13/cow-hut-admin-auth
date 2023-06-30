"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const admin_constant_1 = require("./admin.constant");
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'password required!' }),
        role: zod_1.z.enum([...admin_constant_1.adminRoles], {
            required_error: 'Role required!',
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First Name required!' }),
            lastName: zod_1.z.string({ required_error: 'Last Name required!' }),
        }),
        address: zod_1.z.string({ required_error: 'Address required!' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone Number required!' }),
    }),
});
const updateAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        role: zod_1.z.enum([...admin_constant_1.adminRoles]).optional(),
        name: zod_1.z
            .object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
        })
            .optional(),
        address: zod_1.z.string().optional(),
    }),
});
const adminLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: 'password is required!' }),
        phoneNumber: zod_1.z.string({ required_error: 'phone number is required!' }),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
    updateAdminZodSchema,
    adminLoginZodSchema,
};
