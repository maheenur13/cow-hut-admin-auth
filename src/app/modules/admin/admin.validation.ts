import { z } from 'zod';
import { adminRoles } from './admin.constant';

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'password required!' }),
    role: z.enum([...adminRoles] as [string, ...string[]], {
      required_error: 'Role required!',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name required!' }),
      lastName: z.string({ required_error: 'Last Name required!' }),
    }),
    address: z.string({ required_error: 'Address required!' }),

    phoneNumber: z.string({ required_error: 'Phone Number required!' }),
  }),
});
const updateAdminZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.enum([...adminRoles] as [string, ...string[]]).optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
  }),
});
const adminLoginZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'password is required!' }),
    phoneNumber: z.string({ required_error: 'phone number is required!' }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  updateAdminZodSchema,
  adminLoginZodSchema,
};
