import express from "express";

const routerHealthCheck = express.Router();

routerHealthCheck.route("/").get((req, res) => {
  console.log(
    `HealthCheck processed from port:  ${JSON.stringify(req.socket.localPort)}`
  );
  res.json({ status: "ok" });
});

export default routerHealthCheck;
