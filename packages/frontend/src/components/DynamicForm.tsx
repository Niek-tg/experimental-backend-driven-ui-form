import React, { useState, useEffect } from 'react';
import Form, { type IChangeEvent } from '@rjsf/core';
import type { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { apiService } from '../services/api.service';
import styles from './DynamicForm.module.css';

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
      setSubmitMessage(null);
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
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Loading form...</span>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  if (!schema) {
    return <div className={styles.errorState}>No schema available</div>;
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>{schema.title}</h2>
      {schema.description && (
        <p className={styles.formDescription}>{schema.description}</p>
      )}

      <div className={styles.card}>
        <div className={styles.formWrapper}>
          <Form
            schema={schema}
            validator={validator}
            onSubmit={handleSubmit}
            disabled={submitting}
            showErrorList={false}
          />
        </div>
      </div>

      {submitMessage && (
        <div
          className={`${styles.message} ${
            submitMessage.startsWith('Success')
              ? styles.messageSuccess
              : styles.messageError
          }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
