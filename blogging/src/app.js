import express from 'express';
import { userrouter } from './router/user.js';
import { blogrouter } from './router/blog.js';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || process.env.PORT_NUMBER;

await mongoose.connect(process.env.MONGO_URL);
console.log('Connected to MongoDB');
app.use(express.json());
app.use(cors());

// Correct static path
app.use(express.static(path.join(__dirname, '../public')));

app.use(userrouter);
app.use(blogrouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
