import React, { useState, useEffect } from 'react';
import { apiService, Schema } from '../services/api.service';

interface SchemaListProps {
  onSelectSchema: (schemaId: string) => void;
}

const SchemaList: React.FC<SchemaListProps> = ({ onSelectSchema }) => {
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
    return <div className="loading">Loading schemas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="schema-list">
      <h3>Available Forms</h3>
      <ul>
        {schemas.map((schema) => (
          <li key={schema.id}>
            <button onClick={() => onSelectSchema(schema.id)}>
              {schema.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchemaList;
