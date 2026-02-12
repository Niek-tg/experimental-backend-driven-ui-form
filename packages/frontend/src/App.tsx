import React, { useState } from 'react';
import SchemaList from './components/SchemaList';
import DynamicForm from './components/DynamicForm';
import './App.css';

const App: React.FC = () => {
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Backoffice - Backend-Driven UI Forms</h1>
        <p>Select a form to get started</p>
      </header>
      
      <div className="app-content">
        <aside className="sidebar">
          <SchemaList onSelectSchema={setSelectedSchema} />
        </aside>
        
        <main className="main-content">
          {selectedSchema ? (
            <DynamicForm key={selectedSchema} schemaId={selectedSchema} />
          ) : (
            <div className="placeholder">
              <p>Select a form from the list to begin</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
