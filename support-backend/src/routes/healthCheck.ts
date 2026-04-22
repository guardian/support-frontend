import express from "express";

const routerHealthCheck = express.Router();

routerHealthCheck.route("/").get((req, res) => {
  res.json({ status: "ok" });
});
routerHealthCheck.param("/", (req, res, next) => {
  console.log(
    `HealthCheck Processed from port:  ${JSON.stringify(req.socket.localPort)}`
  );
  next();
});

export default routerHealthCheck;
