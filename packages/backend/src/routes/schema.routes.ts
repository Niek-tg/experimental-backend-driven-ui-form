import { Router, Request, Response } from 'express';

const router = Router();

// Sample JSON Schema for a user registration form
const sampleSchemas = {
  userRegistration: {
    title: 'User Registration',
    type: 'object',
    required: ['firstName', 'lastName', 'email'],
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name',
        minLength: 2,
      },
      lastName: {
        type: 'string',
        title: 'Last Name',
        minLength: 2,
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
      },
      age: {
        type: 'number',
        title: 'Age',
        minimum: 18,
        maximum: 120,
      },
      role: {
        type: 'string',
        title: 'Role',
        enum: ['admin', 'user', 'viewer'],
        default: 'user',
      },
      bio: {
        type: 'string',
        title: 'Bio',
        maxLength: 500,
      },
    },
  },
  contactForm: {
    title: 'Contact Form',
    type: 'object',
    required: ['name', 'email', 'message'],
    properties: {
      name: {
        type: 'string',
        title: 'Name',
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
      },
      subject: {
        type: 'string',
        title: 'Subject',
      },
      message: {
        type: 'string',
        title: 'Message',
      },
      urgent: {
        type: 'boolean',
        title: 'Urgent',
        default: false,
      },
    },
  },
};

// Get all available schemas
router.get('/', (req: Request, res: Response) => {
  const schemaList = Object.keys(sampleSchemas).map((key) => ({
    id: key,
    title: sampleSchemas[key as keyof typeof sampleSchemas].title,
  }));
  
  res.json({
    success: true,
    schemas: schemaList,
  });
});

// Get a specific schema by ID
router.get('/:schemaId', (req: Request, res: Response) => {
  const { schemaId } = req.params;
  const schema = sampleSchemas[schemaId as keyof typeof sampleSchemas];
  
  if (!schema) {
    return res.status(404).json({
      success: false,
      message: 'Schema not found',
    });
  }
  
  res.json({
    success: true,
    schema,
  });
});

export default router;
