import express from "express";

const app = express();

const PORT = process.env.PORT ?? 3000;

app.get("/healthcheck-express", (req, res) => {
  console.log(
    `HealthCheck processed from port: ${req.socket.localPort}`
  );
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
