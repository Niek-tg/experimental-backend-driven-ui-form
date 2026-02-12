import React, { useState, useEffect } from 'react';
import { apiService, Schema } from '../services/api.service';
import styles from './SchemaList.module.css';

interface SchemaListProps {
  selectedId: string | null;
  onSelectSchema: (schemaId: string) => void;
}

const SchemaList: React.FC<SchemaListProps> = ({ selectedId, onSelectSchema }) => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchemas();
  }, []);

  const loadSchemas = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSchemas = await apiService.getSchemas();
      setSchemas(fetchedSchemas);
    } catch (err) {
      setError('Failed to load schemas');
      console.error('Error loading schemas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Loading forms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.retryBtn} onClick={loadSchemas}>
          Retry
        </button>
      </div>
    );
  }

  if (schemas.length === 0) {
    return <p className={styles.empty}>No forms available</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Forms</h3>
        <span className={styles.badge}>{schemas.length}</span>
      </div>

      <div className={styles.list}>
        {schemas.map((schema) => (
          <button
            key={schema.id}
            className={`${styles.item} ${selectedId === schema.id ? styles.itemActive : ''}`}
            onClick={() => onSelectSchema(schema.id)}
          >
            <div className={styles.itemIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemTitle}>{schema.title}</span>
            </div>
            <svg className={styles.itemArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchemaList;
