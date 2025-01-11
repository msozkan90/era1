import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import { specs } from './config/swagger';
import { checkDatabaseConnection } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/users', userRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

const startServer = async () => {
  try {
    await checkDatabaseConnection();

    app.listen(port, () => {
      console.log(`Auth Service listening at http://localhost:${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();