import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entities/Users"; // Import your entities
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from "./secrets"; // Import credentials

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT as unknown as number, // Ensure correct type conversion
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Users], // Add all entity classes
  migrations: ["src/migration/*.ts"], // Path to migration files
  synchronize: false, // Set `false` in production & use migrations
  logging: true, // Enable logging in development
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    // Run pending migrations automatically
    await AppDataSource.runMigrations();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
};
