exports.handler = async (event) => {
  console.log('Form Submission Event Received:', JSON.stringify(event, null, 2));
  
  const { detail } = event;
  
  try {
    // Process form submission
    console.log('Processing form submission:', detail);
    
    // Here you would typically:
    // - Validate the form data
    // - Store the data in a database
    // - Trigger downstream processes
    // - Send notifications
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submission processed successfully',
        submissionId: detail.submissionId || 'generated-id',
      }),
    };
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing form submission',
        error: error.message,
      }),
    };
  }
};
