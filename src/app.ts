// src/app.ts
import express from 'express';
import Database from './db';
import { createReservationRouter } from './reservation/reservation.routes';
import { createOperatingHoursRouter } from './operatingHours/operatingHours.routes';
import { swaggerSetup } from './docs/swagger';
import cors from 'cors';

export class App {
  private readonly app: express.Application;
  private readonly db: Database;

  constructor() {
    this.app = express();
    this.db = new Database();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {

    const corsOptions = {
      origin: 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204
    };
    
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
  }

  private configureRoutes() {
    this.app.use('/api/operating-hours', createOperatingHoursRouter(this.db))
    this.app.use('/api/reservations', createReservationRouter(this.db));

    this.app.use('/api-docs', swaggerSetup.serve, swaggerSetup.setup);
    this.app.get('/api-spec', swaggerSetup.spec);
  }

  public async start(port: any) {
    await this.db.connect();
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  public async stop() {
    await this.db.disconnect();
  }

  public get expressApp() {
    return this.app;
  }
}