import { z } from 'zod';
import { userRoles } from '../user/user.constant';

const signUpZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'password required!' }),
    role: z.enum([...userRoles] as [string, ...string[]], {
      required_error: 'Role required!',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name required!' }),
      lastName: z.string({ required_error: 'Last Name required!' }),
    }),
    address: z.string({ required_error: 'Address required!' }),
    budget: z.number({ required_error: 'Budget required!' }),
    income: z.number({ required_error: 'Income required!' }),
    phoneNumber: z.string({ required_error: 'Phone Number required!' }),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'password required!' }),
    phoneNumber: z.string({ required_error: 'Phone Number required!' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  refreshTokenZodSchema,
  signUpZodSchema,
  loginZodSchema,
};
