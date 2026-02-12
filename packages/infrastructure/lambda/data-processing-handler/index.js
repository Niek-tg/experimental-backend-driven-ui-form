exports.handler = async (event) => {
  console.log('Data Processing Event Received:', JSON.stringify(event, null, 2));
  
  const { detail } = event;
  
  try {
    // Process data
    console.log('Processing data:', detail);
    
    // Here you would typically:
    // - Transform data
    // - Aggregate information
    // - Perform calculations
    // - Update records
    // - Trigger workflows
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data processing completed successfully',
        processedRecords: detail.recordCount || 0,
      }),
    };
  } catch (error) {
    console.error('Error processing data:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing data',
        error: error.message,
      }),
    };
  }
};
