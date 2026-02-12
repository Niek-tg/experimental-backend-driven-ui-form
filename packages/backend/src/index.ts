import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/form.routes';
import schemaRoutes from './routes/schema.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/schemas', schemaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Event Bus: ${process.env.EVENT_BUS_NAME}`);
});

export default app;
