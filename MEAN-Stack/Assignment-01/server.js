import express from 'express';
const app = express();
app.get('/', (_req, res) => res.json({ message: 'Hello from the MCA Node.js assignment' }));
const port = Number(process.env.PORT || 3100);
app.listen(port, '127.0.0.1', () => console.log(`Open http://127.0.0.1:${port}`));
