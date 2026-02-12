#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackofficeInfrastructureStack } from '../lib/backoffice-infrastructure-stack';

const app = new cdk.App();

new BackofficeInfrastructureStack(app, 'BackofficeInfrastructureStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Infrastructure for backend-driven UI form backoffice',
});

app.synth();
