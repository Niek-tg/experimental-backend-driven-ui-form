import React, { useState, useEffect } from 'react';
import Form, { type IChangeEvent } from '@rjsf/core';
import type { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { apiService } from '../services/api.service';

interface DynamicFormProps {
  schemaId: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schemaId }) => {
  const [schema, setSchema] = useState<RJSFSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSchema();
  }, [schemaId]);

  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSchema = await apiService.getSchema(schemaId);
      setSchema(fetchedSchema);
    } catch (err) {
      setError('Failed to load form schema');
      console.error('Error loading schema:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({ formData }: IChangeEvent) => {
    try {
      setSubmitting(true);
      setSubmitMessage(null);
      const response = await apiService.submitForm(formData);
      
      if (response.success) {
        setSubmitMessage(`Success! Submission ID: ${response.submissionId}`);
      } else {
        setSubmitMessage(`Error: ${response.message}`);
      }
    } catch (err) {
      setSubmitMessage('Failed to submit form');
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!schema) {
    return <div className="error">No schema available</div>;
  }

  return (
    <div className="dynamic-form">
      <h2>{schema.title}</h2>
      <Form
        schema={schema}
        validator={validator}
        onSubmit={handleSubmit}
        disabled={submitting}
      />
      {submitMessage && (
        <div className={`message ${submitMessage.startsWith('Success') ? 'success' : 'error'}`}>
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
