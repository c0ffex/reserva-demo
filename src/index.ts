// src/index.ts
import { App } from './app';

const PORT = process.env.PORT ?? 3000;
const app = new App();

app.start(PORT).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await app.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await app.stop();
  process.exit(0);
});