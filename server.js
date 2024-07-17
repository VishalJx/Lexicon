const express = require('express');
const connectDB = require('./db/db');
const wordRoutes = require('./routes/routes');
require('dotenv').config();
const cors = require('cors');

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

connectDB();

nextApp.prepare().then(() => {
  const app = express();
  const port = process.env.PORT || 8000;

  app.use(cors());
  app.use(express.json());
  app.use('/api/words', wordRoutes);

  // Handle all other routes with Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});