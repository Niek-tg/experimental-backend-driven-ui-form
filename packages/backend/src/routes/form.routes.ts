import { Router, Request, Response } from 'express';
import { eventBridgeService } from '../services/eventbridge.service';

const router = Router();

// Submit form data
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    
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
    const formData = req.body;
    
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
    const data = req.body;
    
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
