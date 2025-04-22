import { Client } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/schema";
import dotenv from "dotenv";

dotenv.config();

class Database {
  client: Client;
  db: NodePgDatabase<typeof schema>;
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.client, { schema });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Database connected.");
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Database disconnected.");
    } catch (error) {
      console.error("Disconnection error:", error);
      throw error;
    }
  }
}

export default Database;
