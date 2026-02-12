import { Router, Request, Response } from 'express';
import * as z from 'zod';
import { formSchemas } from '../schemas/formSchemas';

const router = Router();

const jsonSchemas = Object.fromEntries(
  Object.entries(formSchemas).map(([key, schema]) => [key, z.toJSONSchema(schema)]),
);

// Get all available schemas
router.get('/', (req: Request, res: Response) => {
  const schemaList = Object.entries(jsonSchemas).map(([id, schema]) => ({
    id,
    title: (schema as { title?: string }).title ?? id,
  }));
  
  res.json({
    success: true,
    schemas: schemaList,
  });
});

// Get a specific schema by ID
router.get('/:schemaId', (req: Request, res: Response) => {
  const { schemaId } = req.params;
  const schema = jsonSchemas[schemaId as keyof typeof jsonSchemas];
  
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
