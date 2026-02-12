import axios from 'axios';
import type { RJSFSchema } from '@rjsf/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Schema {
  id: string;
  title: string;
}

export interface SchemaResponse {
  success: boolean;
  schema?: RJSFSchema;
  schemas?: Schema[];
  message?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  error?: string;
}

export const apiService = {
  // Get all available schemas
  async getSchemas(): Promise<Schema[]> {
    const response = await apiClient.get<SchemaResponse>('/schemas');
    return response.data.schemas || [];
  },

  // Get a specific schema by ID
  async getSchema(schemaId: string): Promise<RJSFSchema | null> {
    const response = await apiClient.get<SchemaResponse>(`/schemas/${schemaId}`);
    return response.data.schema ?? null;
  },

  // Submit form data
  async submitForm(formData: any): Promise<FormSubmissionResponse> {
    const response = await apiClient.post<FormSubmissionResponse>('/forms/submit', formData);
    return response.data;
  },

  // Validate form data
  async validateForm(formData: any): Promise<FormSubmissionResponse> {
    const response = await apiClient.post<FormSubmissionResponse>('/forms/validate', formData);
    return response.data;
  },

  // Process form data
  async processData(data: any): Promise<FormSubmissionResponse> {
    const response = await apiClient.post<FormSubmissionResponse>('/forms/process', data);
    return response.data;
  },
};
