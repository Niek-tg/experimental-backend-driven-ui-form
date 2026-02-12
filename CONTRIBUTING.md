# Contributing Guide

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- AWS CLI (for infrastructure deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Niek-tg/experimental-backend-driven-ui-form.git
cd experimental-backend-driven-ui-form
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment files:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

## Development Workflow

### Running the Backend

```bash
pnpm dev:backend
```

The backend will start on `http://localhost:3001`

### Running the Frontend

```bash
pnpm dev:frontend
```

The frontend will start on `http://localhost:3000`

### Building All Packages

```bash
pnpm build
```

### Cleaning Build Artifacts

```bash
pnpm clean
```

## Project Structure

```
packages/
├── infrastructure/      # AWS CDK project
│   ├── bin/            # CDK app entry point
│   ├── lib/            # Stack definitions
│   └── lambda/         # Lambda function code
├── backend/            # Express.js API
│   └── src/
│       ├── routes/     # API routes
│       └── services/   # Business logic
└── frontend/           # React app
    └── src/
        ├── components/ # React components
        └── services/   # API client
```

## Adding New Form Schemas

To add a new form schema, edit `packages/backend/src/routes/schema.routes.ts`:

```typescript
const sampleSchemas = {
  // Add your new schema here
  myNewForm: {
    title: 'My New Form',
    type: 'object',
    required: ['field1'],
    properties: {
      field1: {
        type: 'string',
        title: 'Field 1',
      },
      // Add more fields...
    },
  },
};
```

The form will automatically appear in the frontend's form list.

## Deploying Infrastructure

To deploy the AWS infrastructure:

```bash
cd packages/infrastructure
pnpm install
pnpm build

# Optional: Preview changes
pnpm diff

# Deploy
pnpm deploy
```

Make sure your AWS credentials are configured before deploying.

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
AWS_REGION=us-east-1
EVENT_BUS_NAME=backoffice-event-bus
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Testing

Currently, this project focuses on the infrastructure setup. Testing can be extended in the future.

## Code Style

- TypeScript is used throughout the project
- Follow existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure all packages build successfully
4. Test your changes locally
5. Submit a pull request with a clear description

## Questions?

If you have questions or need help, please open an issue on GitHub.
