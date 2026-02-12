import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const client = new EventBridgeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface EventDetail {
  [key: string]: any;
}

export class EventBridgeService {
  private eventBusName: string;

  constructor() {
    this.eventBusName = process.env.EVENT_BUS_NAME || 'backoffice-event-bus';
  }

  async publishEvent(
    source: string,
    detailType: string,
    detail: EventDetail
  ): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
          EventBusName: this.eventBusName,
        },
      ],
    });

    try {
      const response = await client.send(command);
      console.log('Event published successfully:', {
        source,
        detailType,
        failedEntryCount: response.FailedEntryCount,
      });
      
      if (response.FailedEntryCount && response.FailedEntryCount > 0) {
        console.error('Failed entries:', response.Entries);
        throw new Error('Failed to publish some events');
      }
    } catch (error) {
      console.error('Error publishing event to EventBridge:', error);
      throw error;
    }
  }

  async publishFormSubmission(formData: any): Promise<void> {
    await this.publishEvent('backoffice.forms', 'FormSubmitted', {
      submissionId: `submission-${Date.now()}`,
      formData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishDataProcessing(data: any): Promise<void> {
    await this.publishEvent('backoffice.data', 'DataProcessingRequired', {
      processingId: `processing-${Date.now()}`,
      data,
      recordCount: Array.isArray(data) ? data.length : 1,
      timestamp: new Date().toISOString(),
    });
  }
}

export const eventBridgeService = new EventBridgeService();
