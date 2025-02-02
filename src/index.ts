import "reflect-metadata";
import express from "express";
import compression from "compression";
import cors from "cors";
import routes from "./routes";
import { PORT } from "./secrets";
import { errorMiddleware } from "./middlewares/error";
import { connectDatabase } from "./data-source"; // Import DB connection

const app = express();

app.use(compression());
app.use(
  cors({
    exposedHeaders: "Content-Disposition",
    origin: true,
  })
);

// middleware
app.use(express.json());

app.use("/v1", routes);

app.use(errorMiddleware);
// Export `app` for testing
export default app;

if (process.env.NODE_ENV !== "test") {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
      });
    })
    .catch((err: any) => {
      console.error("Server startup failed due to DB connection error:", err);
    });
}
