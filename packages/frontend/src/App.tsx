import React, { useState } from 'react';
import Header from './components/Header';
import SchemaList from './components/SchemaList';
import DynamicForm from './components/DynamicForm';
import styles from './App.module.css';

const App: React.FC = () => {
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);

  return (
    <div className={styles.app}>
      <Header />

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <SchemaList
            selectedId={selectedSchema}
            onSelectSchema={setSelectedSchema}
          />
        </aside>

        <main className={styles.main}>
          {selectedSchema ? (
            <DynamicForm key={selectedSchema} schemaId={selectedSchema} />
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderInner}>
                <div className={styles.placeholderIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className={styles.placeholderTitle}>No Form Selected</h2>
                <p className={styles.placeholderText}>
                  Choose a form from the sidebar to start editing.
                  Your backend-driven forms will appear here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
