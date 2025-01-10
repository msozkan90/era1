import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Event Service is running' });
});

app.listen(port, () => {
  console.log(`Event Service listening at http://localhost:${port}`);
});