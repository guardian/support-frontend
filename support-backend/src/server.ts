import express from "express";
import routerHealthCheck from "./routes/healthCheck";

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/health-check", routerHealthCheck);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
