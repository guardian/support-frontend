import express from "express";
import routerHealthCheck from "./routes/healthCheck";

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use("/healthcheck-express", routerHealthCheck);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
