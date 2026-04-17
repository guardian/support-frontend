import express from "express";

// Extend Express Request interface to include line1 property
declare global {
  namespace Express {
    interface Request {
      line1?: string;
    }
  }
}

const routerPostcode = express.Router();

const addressLines = [
  { "RH2 7DP": `X Blanford Rd` },
  { "N1 9GU": `X York Rd` },
];

routerPostcode.route("/:postcode").get((req, res) => {
  const { postcode } = req.params;
  const { line1 } = req;
  const address = {
    line1: line1 || "not found",
    line2: "",
    town: "",
    county: "",
    postcode,
  };
  res.send(JSON.stringify(address));
});

routerPostcode.param("postcode", (req, res, next, postcode) => {
  const line1 = addressLines.find((obj) => Object.hasOwn(obj, postcode));
  if (line1) {
    req.line1 = Object.values(line1)[0];
  }
  console.log(
    `Middleware for postcode: ${postcode} gives line1: ${
      req.line1 || "not found"
    }`
  );
  next();
});

export default routerPostcode;
