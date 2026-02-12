import { Router, Request, Response } from 'express';
import { formDataSchema } from '../schemas/formSchemas';
import { eventBridgeService } from '../services/eventbridge.service';

const router = Router();

// Submit form data
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const parsedFormData = formDataSchema.safeParse(req.body);

    if (!parsedFormData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data',
        error: parsedFormData.error.flatten(),
      });
    }
    const formData = parsedFormData.data;
    
    // Publish form submission event to EventBridge
    await eventBridgeService.publishFormSubmission(formData);
    
    res.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: `submission-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Validate form data
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const parsedFormData = formDataSchema.safeParse(req.body);

    if (!parsedFormData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data',
        error: parsedFormData.error.flatten(),
      });
    }
    const formData = parsedFormData.data;
    
    // Publish form validation event to EventBridge
    await eventBridgeService.publishFormValidation(formData);
    
    res.json({
      success: true,
      message: 'Form validation requested',
      validationId: `validation-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error validating form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate form',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Process form data
router.post('/process', async (req: Request, res: Response) => {
  try {
    const parsedData = formDataSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data',
        error: parsedData.error.flatten(),
      });
    }
    const data = parsedData.data;
    
    // Publish data processing event to EventBridge
    await eventBridgeService.publishDataProcessing(data);
    
    res.json({
      success: true,
      message: 'Data processing requested',
      processingId: `processing-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
