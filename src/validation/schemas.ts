import { z } from 'zod';

// Base schemas
export const idSchema = z.string().uuid('Invalid ID format');
export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z\d]/, 'Password must contain at least one special character');

// Message schemas
export const messageContentSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(4000, 'Message is too long (max 4000 characters)')
  .trim();

export const messageRoleSchema = z.enum(['user', 'assistant'], {
  errorMap: () => ({ message: 'Invalid message role' }),
});

export const messageSchema = z.object({
  id: idSchema.optional(),
  content: messageContentSchema,
  role: messageRoleSchema,
  timestamp: z.date().optional(),
  userId: idSchema.optional(),
  metadata: z
    .object({
      tokens: z.number().int().positive().optional(),
      model: z.string().optional(),
      processingTime: z.number().positive().optional(),
      confidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

// Chat schemas
export const chatTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(100, 'Title is too long (max 100 characters)')
  .trim();

export const chatSessionSchema = z.object({
  id: idSchema.optional(),
  title: chatTitleSchema,
  messages: z.array(messageSchema).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: idSchema,
});

export const createChatSchema = z.object({
  title: chatTitleSchema.optional(),
  firstMessage: messageContentSchema.optional(),
});

export const updateChatSchema = z.object({
  title: chatTitleSchema.optional(),
});

// User schemas
export const userNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long (max 50 characters)')
  .regex(/^[A-Za-z\s'-]+$/, 'Name contains invalid characters')
  .trim();

export const userSchema = z.object({
  id: z.string().min(1, 'User ID is required'), // Accept any string ID (MongoDB ObjectId)
  googleId: z.string().optional(),
  email: emailSchema,
  name: userNameSchema,
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')).optional(),
  role: z.enum(['user', 'admin']).default('user'),
  isAdmin: z.boolean().default(false),
  createdAt: z.union([z.string().datetime(), z.date()]).optional().transform(val => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }),
  updatedAt: z.union([z.string().datetime(), z.date()]).optional().transform(val => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }),
});

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    name: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Profile schemas
export const updateProfileSchema = z.object({
  name: userNameSchema.optional(),
  email: emailSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// API response schemas
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string(),
    success: z.boolean(),
    timestamp: z.string().datetime(),
  });

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime(),
});

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().positive(),
    }),
  });

// Query parameter schemas
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const chatListQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      'File must be an image (JPEG, PNG, GIF, or WebP)'
    ),
});

// Settings schemas
export const themeSchema = z.enum(['light', 'dark', 'system'], {
  errorMap: () => ({ message: 'Invalid theme option' }),
});

export const settingsSchema = z.object({
  theme: themeSchema,
  notifications: z
    .object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      marketing: z.boolean().default(false),
    })
    .default({}),
  privacy: z
    .object({
      profileVisible: z.boolean().default(true),
      analyticsEnabled: z.boolean().default(true),
    })
    .default({}),
});

// Environment schema
export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  VITE_API_URL: z.string().url('Invalid API URL'),
  VITE_APP_NAME: z.string().min(1, 'App name is required'),
  VITE_APP_VERSION: z.string().min(1, 'App version is required'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type ChatSessionFormData = z.infer<typeof chatSessionSchema>;
export type CreateChatFormData = z.infer<typeof createChatSchema>;
export type UpdateChatFormData = z.infer<typeof updateChatSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ChatListQuery = z.infer<typeof chatListQuerySchema>; 