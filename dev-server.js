import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Load .env for local development (safe: .env is gitignored)
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.DEV_API_PORT ? Number(process.env.DEV_API_PORT) : 3000;

app.use(express.json());
app.use((req, res, next) => {
  // Simple logging for dev
  console.log(`[dev-api] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', async (req, res) => {
  try {
    // Map request path to api file
    // /api/chat -> api/chat.js
    const apiPath = req.path.replace(/^\/+/, ''); // remove leading slash
    if (apiPath.includes('..')) return res.status(400).send('Bad request');

    const candidate = path.resolve(__dirname, 'api', apiPath || 'index');
    const fullPath = candidate.endsWith('.js') ? candidate : `${candidate}.js`;

    try {
      await fs.promises.access(fullPath, fs.constants.R_OK);
    } catch (err) {
      return res.status(404).send('Not Found');
    }

    // Dynamic import the handler module
    const mod = await import(pathToFileURL(fullPath).href);
    const handler = mod.default || mod.handler;
    if (typeof handler !== 'function') {
      return res.status(500).send('API handler not a function');
    }

    // Call the handler with Express req/res. The Vercel function expects (req,res) with .body already parsed.
    // Our Express req already has .body because of express.json()
    await handler(req, res);
  } catch (err) {
    console.error('Dev API error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`[dev-api] Listening on http://localhost:${PORT} (serving files from /api/*.js)`);
});
