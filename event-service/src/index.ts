import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import { specs } from './config/swagger';
import eventRoutes from './routes/eventRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/events', eventRoutes);
app.use('/api/events', commentRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

const startServer = async () => {
  try {

    await connectDB();

    app.listen(port, () => {
      console.log(`Event Service listening at http://localhost:${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();