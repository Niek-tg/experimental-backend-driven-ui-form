# Experimental Backend-Driven UI Form

A monorepo setup for a backend-driven UI form system with EventBridge integration.

## Overview

This monorepo contains three interconnected projects:

1. **Infrastructure** (`packages/infrastructure`): AWS CDK project that deploys EventBridge and Lambda functions
2. **Backend** (`packages/backend`): Express.js API server that publishes events to EventBridge
3. **Frontend** (`packages/frontend`): React application with JSON Schema-based forms

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │────────▶│   Backend   │────────▶│  EventBridge │
│   (React)   │         │  (Express)  │         │              │
└─────────────┘         └─────────────┘         └──────┬───────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │    Lambda     │
                                                │   Functions   │
                                                └───────────────┘
```

- **Frontend**: Provides a user interface with forms generated from JSON Schemas
- **Backend**: API server that handles form submissions and publishes events to EventBridge
- **Infrastructure**: AWS resources including EventBridge event bus and Lambda functions that process events

## Prerequisites

- Node.js >= 24.0.0
- pnpm >= 10.0.0
- AWS CLI configured (for infrastructure deployment)
- AWS CDK CLI (installed via infrastructure package)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Servers

**Backend:**
```bash
# Create backend .env file
cp packages/backend/.env.example packages/backend/.env

# Start the backend server
pnpm dev:backend
```

The backend will run on `http://localhost:3001`

**Frontend:**
```bash
# Create frontend .env file (optional)
cp packages/frontend/.env.example packages/frontend/.env

# Start the frontend server
pnpm dev:frontend
```

The frontend will run on `http://localhost:3000`

### 3. Deploy Infrastructure (Optional)

To deploy the AWS infrastructure:

```bash
# Build the infrastructure
cd packages/infrastructure
pnpm install
pnpm build

# Deploy to AWS
pnpm deploy
```

**Note**: Make sure your AWS credentials are configured before deploying.

## Project Structure

```
.
├── packages/
│   ├── infrastructure/      # AWS CDK project
│   │   ├── bin/            # CDK app entry point
│   │   ├── lib/            # CDK stack definitions
│   │   └── lambda/         # Lambda function handlers
│   │       ├── form-submission-handler/
│   │       ├── form-validation-handler/
│   │       └── data-processing-handler/
│   ├── backend/            # Express.js API server
│   │   └── src/
│   │       ├── routes/     # API route handlers
│   │       └── services/   # Business logic (EventBridge)
│   └── frontend/           # React application
│       └── src/
│           ├── components/ # React components
│           └── services/   # API client
├── package.json            # Root package configuration
└── pnpm-workspace.yaml     # Workspace configuration
```

## Features

### Backend API Endpoints

- `GET /api/schemas` - List all available form schemas
- `GET /api/schemas/:schemaId` - Get a specific form schema
- `POST /api/forms/submit` - Submit form data (publishes to EventBridge)
- `POST /api/forms/validate` - Validate form data (publishes to EventBridge)
- `POST /api/forms/process` - Process form data (publishes to EventBridge)

### EventBridge Events

The backend publishes events to EventBridge with the following patterns:

1. **Form Submission**
   - Source: `backoffice.forms`
   - DetailType: `FormSubmitted`

2. **Form Validation**
   - Source: `backoffice.forms`
   - DetailType: `FormValidationRequired`

3. **Data Processing**
   - Source: `backoffice.data`
   - DetailType: `DataProcessingRequired`

### Lambda Functions

Three Lambda functions are deployed to handle EventBridge events:

1. **Form Submission Handler**: Processes form submissions
2. **Form Validation Handler**: Handles form validation requests
3. **Data Processing Handler**: Processes data transformation requests

## Development

### Build All Packages

```bash
pnpm build
```

### Run Linters

```bash
pnpm lint
```

### Clean Build Artifacts

```bash
pnpm clean
```

## Available Scripts

- `pnpm build` - Build all packages
- `pnpm dev:backend` - Start backend development server
- `pnpm dev:frontend` - Start frontend development server
- `pnpm deploy:infra` - Deploy AWS infrastructure
- `pnpm lint` - Run linters for all packages
- `pnpm clean` - Clean all build artifacts

## Configuration

### Backend Configuration

Create a `.env` file in `packages/backend/`:

```env
PORT=3001
NODE_ENV=development
AWS_REGION=us-east-1
EVENT_BUS_NAME=backoffice-event-bus
```

### Frontend Configuration

Create a `.env` file in `packages/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Technology Stack

- **Frontend**: React 19, TypeScript 5.9, Vite 7, @rjsf/core 6 (JSON Schema Forms)
- **Backend**: Express.js 5, TypeScript 5.9, AWS SDK v3 (EventBridge)
- **Infrastructure**: AWS CDK 2.238, TypeScript 5.9, Lambda Node.js 20
- **Package Manager**: pnpm 10+ with workspaces
- **Linting**: ESLint 9 with TypeScript support

## Updating Dependencies

To check for outdated dependencies:

```bash
pnpm outdated -r
```

To update all dependencies to their latest versions:

```bash
pnpm update -r --latest
```

### Breaking Changes to Note

When updating to the latest versions, be aware of these major version changes:

- **React 19**: Uses the new `react-dom/client` API with `createRoot`. Class components are discouraged.
- **Express 5**: Async route handlers are now automatically wrapped. Add global error handling middleware.
- **Vite 7**: Drops CommonJS build, uses ESM only. Ensure all imports use ESM syntax.
- **@rjsf/core 6**: Requires separate validator package (`@rjsf/validator-ajv8`). Theme packages must be imported separately.
- **ESLint 9**: Uses flat config format (`eslint.config.mjs`) instead of `.eslintrc.*` files.
- **AWS CDK 2.238**: Includes the latest AWS service updates. Lambda Node.js 18 is deprecated in favor of Node.js 20+.

## License

This project is private and not licensed for public use.