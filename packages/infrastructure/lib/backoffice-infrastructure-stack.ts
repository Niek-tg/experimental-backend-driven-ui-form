import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class BackofficeInfrastructureStack extends cdk.Stack {
  public readonly eventBus: events.EventBus;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create EventBridge event bus
    this.eventBus = new events.EventBus(this, 'BackofficeEventBus', {
      eventBusName: 'backoffice-event-bus',
    });

    // Lambda function to handle form submission events
    const formSubmissionHandler = new lambda.Function(this, 'FormSubmissionHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/form-submission-handler')),
      functionName: 'backoffice-form-submission-handler',
      environment: {
        EVENT_BUS_NAME: this.eventBus.eventBusName,
      },
    });

    // Lambda function to handle data processing events
    const dataProcessingHandler = new lambda.Function(this, 'DataProcessingHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/data-processing-handler')),
      functionName: 'backoffice-data-processing-handler',
      environment: {
        EVENT_BUS_NAME: this.eventBus.eventBusName,
      },
    });

    // EventBridge rule for form submission events
    const formSubmissionRule = new events.Rule(this, 'FormSubmissionRule', {
      eventBus: this.eventBus,
      eventPattern: {
        source: ['backoffice.forms'],
        detailType: ['FormSubmitted'],
      },
      ruleName: 'backoffice-form-submission-rule',
    });
    formSubmissionRule.addTarget(new targets.LambdaFunction(formSubmissionHandler));

    // EventBridge rule for data processing events
    const dataProcessingRule = new events.Rule(this, 'DataProcessingRule', {
      eventBus: this.eventBus,
      eventPattern: {
        source: ['backoffice.data'],
        detailType: ['DataProcessingRequired'],
      },
      ruleName: 'backoffice-data-processing-rule',
    });
    dataProcessingRule.addTarget(new targets.LambdaFunction(dataProcessingHandler));

    // Grant EventBridge permissions to invoke Lambda functions
    this.eventBus.grantPutEventsTo(formSubmissionHandler);
    this.eventBus.grantPutEventsTo(dataProcessingHandler);

    // Outputs
    new cdk.CfnOutput(this, 'EventBusName', {
      value: this.eventBus.eventBusName,
      description: 'EventBridge Event Bus Name',
      exportName: 'BackofficeEventBusName',
    });

    new cdk.CfnOutput(this, 'EventBusArn', {
      value: this.eventBus.eventBusArn,
      description: 'EventBridge Event Bus ARN',
      exportName: 'BackofficeEventBusArn',
    });
  }
}
