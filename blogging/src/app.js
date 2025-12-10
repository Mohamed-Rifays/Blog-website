import express from 'express';
import { userrouter } from './router/user.js';
import { blogrouter } from './router/blog.js';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

await mongoose.connect('mongodb://127.0.0.1:27017/blogging-api');
app.use(express.json());
app.use(cors());

// Correct static path
app.use(express.static(path.join(__dirname, '../public')));

app.use(userrouter);
app.use(blogrouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
