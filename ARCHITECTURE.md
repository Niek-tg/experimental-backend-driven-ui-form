# Architecture Documentation

## System Overview

This system implements a backend-driven UI form architecture that uses AWS EventBridge to decouple form submission from processing. The architecture consists of three main components that work together to provide a flexible, scalable form management system.

## Components

### 1. Frontend (React)

**Technology**: React 18, TypeScript, Vite, @rjsf/core

**Responsibilities**:
- Render dynamic forms based on JSON Schemas
- Fetch form schemas from the backend API
- Submit form data to the backend
- Provide a user-friendly interface for form interaction

**Key Features**:
- JSON Schema-based form generation using @rjsf/core
- Dynamic form loading and rendering
- API integration with the backend
- Responsive design

**API Integration**:
```typescript
GET /api/schemas          // List all schemas
GET /api/schemas/:id      // Get specific schema
POST /api/forms/submit    // Submit form data
POST /api/forms/validate  // Validate form
POST /api/forms/process   // Process data
```

### 2. Backend (Express.js)

**Technology**: Express.js, TypeScript, AWS SDK v3

**Responsibilities**:
- Serve form schemas to the frontend
- Accept form submissions
- Publish events to AWS EventBridge
- Act as the API gateway for the backoffice

**Key Components**:

1. **Schema Routes** (`src/routes/schema.routes.ts`)
   - Manage form schema definitions
   - Serve schemas to the frontend
   - Currently includes User Registration and Contact Form schemas

2. **Form Routes** (`src/routes/form.routes.ts`)
   - Handle form submissions
   - Trigger validation requests
   - Initiate data processing

3. **EventBridge Service** (`src/services/eventbridge.service.ts`)
   - Abstract EventBridge integration
   - Publish events with proper structure
   - Handle event publishing errors

**Event Structure**:
```typescript
{
  Source: "backoffice.forms" | "backoffice.data",
  DetailType: "FormSubmitted" | "FormValidationRequired" | "DataProcessingRequired",
  Detail: {
    // Event-specific data
    timestamp: ISO8601String,
    submissionId: string,
    formData: any
  }
}
```

### 3. Infrastructure (AWS CDK)

**Technology**: AWS CDK v2, TypeScript

**Deployed Resources**:

1. **EventBridge Event Bus**
   - Name: `backoffice-event-bus`
   - Central hub for all backoffice events
   - Enables loose coupling between services

2. **Lambda Functions**:
   - **Form Submission Handler**: Processes form submissions
   - **Form Validation Handler**: Validates form data
   - **Data Processing Handler**: Processes and transforms data

3. **EventBridge Rules**:
   - Route events based on source and detail type
   - Connect event bus to Lambda functions
   - Enable event-driven architecture

**Event Patterns**:
```typescript
// Form Submission Rule
{
  source: ["backoffice.forms"],
  detailType: ["FormSubmitted"]
}

// Form Validation Rule
{
  source: ["backoffice.forms"],
  detailType: ["FormValidationRequired"]
}

// Data Processing Rule
{
  source: ["backoffice.data"],
  detailType: ["DataProcessingRequired"]
}
```

## Data Flow

### Form Submission Flow

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │ 1. User submits form
       ▼
┌─────────────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │ 2. POST /api/forms/submit
       ▼
┌─────────────┐
│ EventBridge │
│  Event Bus  │
└──────┬──────┘
       │ 3. FormSubmitted event
       ▼
┌─────────────┐
│   Lambda    │
│   Handler   │
└─────────────┘
       │ 4. Process submission
       ▼
    [Database/External Systems]
```

### Schema Retrieval Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. Request schemas
       ▼
┌─────────────┐
│   Backend   │
└──────┬──────┘
       │ 2. GET /api/schemas
       ▼
┌─────────────┐
│   Return    │
│   JSON      │
│   Schemas   │
└─────────────┘
```

## Event-Driven Architecture Benefits

1. **Decoupling**: Frontend and backend are decoupled from processing logic
2. **Scalability**: Lambda functions scale automatically based on load
3. **Reliability**: EventBridge provides built-in retry and DLQ support
4. **Flexibility**: Easy to add new event handlers without modifying existing code
5. **Observability**: All events flow through EventBridge for monitoring

## Extensibility

### Adding New Event Types

1. Define new event type in backend service:
```typescript
async publishNewEvent(data: any): Promise<void> {
  await this.publishEvent(
    'backoffice.custom',
    'NewEventType',
    data
  );
}
```

2. Create Lambda handler in `packages/infrastructure/lambda/`

3. Add EventBridge rule in CDK stack:
```typescript
const newRule = new events.Rule(this, 'NewRule', {
  eventBus: this.eventBus,
  eventPattern: {
    source: ['backoffice.custom'],
    detailType: ['NewEventType'],
  },
});
newRule.addTarget(new targets.LambdaFunction(newHandler));
```

### Adding New Forms

Add schema definition in `packages/backend/src/routes/schema.routes.ts`:

```typescript
myForm: {
  title: 'My Form',
  type: 'object',
  properties: {
    // Define fields
  }
}
```

The form will automatically appear in the frontend.

## Security Considerations

1. **API Authentication**: Currently, the API is open. In production, add authentication middleware.
2. **CORS**: Configure appropriate CORS settings for production.
3. **AWS Credentials**: Use IAM roles and policies, never hardcode credentials.
4. **Input Validation**: Validate all form inputs on the backend before publishing events.
5. **Rate Limiting**: Implement rate limiting to prevent abuse.

## Deployment

### Local Development
```bash
# Start backend
pnpm dev:backend

# Start frontend (in another terminal)
pnpm dev:frontend
```

### AWS Infrastructure
```bash
cd packages/infrastructure
pnpm deploy
```

### Production Considerations
- Set up CI/CD pipeline
- Configure production environment variables
- Set up monitoring and alerting
- Implement proper error handling
- Add logging and tracing

## Monitoring

### Backend Metrics
- API response times
- Error rates
- Request counts

### EventBridge Metrics
- Event publishing success/failure rates
- Rule invocation counts
- DLQ messages

### Lambda Metrics
- Invocation counts
- Duration
- Error rates
- Concurrent executions

## Future Enhancements

1. **Database Integration**: Store form submissions in a database
2. **Authentication**: Add user authentication and authorization
3. **Form Builder**: Visual form builder for non-technical users
4. **Workflow Engine**: Complex multi-step workflows
5. **Analytics**: Form submission analytics and reporting
6. **Notifications**: Email/SMS notifications for form events
7. **File Uploads**: Support for file attachments in forms
8. **Versioning**: Schema versioning and migration support
