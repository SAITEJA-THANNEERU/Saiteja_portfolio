import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// Dynamic API handler for /api/* routes
app.use('/api', async (req, res) => {
  try {
    const apiPath = req.path.replace(/^\/+/, '');
    if (apiPath.includes('..')) return res.status(400).json({ error: 'Bad request' });

    const candidate = path.resolve(__dirname, 'api', apiPath || 'index');
    let fullPath = candidate.endsWith('.ts') || candidate.endsWith('.js') ? candidate : `${candidate}.ts`;
    try {
      await fs.promises.access(fullPath, fs.constants.R_OK);
    } catch {
      fullPath = candidate.endsWith('.js') ? candidate : `${candidate}.js`;
      try {
        await fs.promises.access(fullPath, fs.constants.R_OK);
      } catch {
        return res.status(404).json({ error: 'API route not found' });
      }
    }

    const mod = await import(pathToFileURL(fullPath).href);
    const handler = mod.default || mod.handler;
    if (typeof handler !== 'function') {
      return res.status(500).json({ error: 'API handler not a function' });
    }

    await handler(req, res);
  } catch (err) {
    console.error('API Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Serve Vite dev server or static files
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Running on http://0.0.0.0:${PORT}`);
});
