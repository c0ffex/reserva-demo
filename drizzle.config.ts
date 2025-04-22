import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

configDotenv();

export default defineConfig({
  schema: "./src/db/schemas/*.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});