import * as z from 'zod';

export const userRegistrationSchema = z
  .object({
    firstName: z.string().min(2).meta({ title: 'First Name' }),
    lastName: z.string().min(2).meta({ title: 'Last Name' }),
    email: z.string().email().meta({ title: 'Email' }),
    age: z.number().min(18).max(120).meta({ title: 'Age' }).optional(),
    role: z.enum(['admin', 'user', 'viewer']).default('user').meta({ title: 'Role' }),
    bio: z.string().max(500).meta({ title: 'Bio' }).optional(),
  })
  .meta({ title: 'User Registration' });

export const contactFormSchema = z
  .object({
    name: z.string().meta({ title: 'Name' }),
    email: z.string().email().meta({ title: 'Email' }),
    subject: z.string().meta({ title: 'Subject' }).optional(),
    message: z.string().meta({ title: 'Message' }),
    urgent: z.boolean().default(false).meta({ title: 'Urgent' }),
  })
  .meta({ title: 'Contact Form' });

export const formSchemas = {
  userRegistration: userRegistrationSchema,
  contactForm: contactFormSchema,
};

export const formDataSchema = z.union([userRegistrationSchema, contactFormSchema]);
