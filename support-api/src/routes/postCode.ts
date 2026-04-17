import express from "express";

type PostcodeFinderResult = {
  lineOne: string;
  lineTwo: string;
  city: string;
};

// Extend Express Request interface to include line1 property
declare global {
  namespace Express {
    interface Request extends PostcodeFinderResult {}
  }
}

const routerPostcode = express.Router();

const addresses = {
  RH27DP: {
    lineOne: `X Blanford Rd`,
    lineTwo: "",
    city: "",
  },
  N19GU: {
    lineOne: `X York Rd`,
    lineTwo: "",
    city: "",
  },
  OTHER: {
    lineOne: `Cant Find`,
    lineTwo: "",
    city: "",
  },
};
routerPostcode.route("/:postcode").get((req, res) => {
  const { postcode } = req.params;
  const { lineOne, lineTwo, city } = req;
  const address: PostcodeFinderResult = {
    lineOne,
    lineTwo,
    city,
  };
  res.send(JSON.stringify(address));
});

routerPostcode.param("postcode", (req, res, next, postcode) => {
  const lookupPostcode = postcode.replace(" ", "").toUpperCase();
  const indexPostCode =
    lookupPostcode === "RH27DP" || lookupPostcode === "N19GU"
      ? (lookupPostcode as keyof typeof addresses)
      : "OTHER";
  const address: PostcodeFinderResult = addresses[indexPostCode];
  req.lineOne = address.lineOne;
  req.lineTwo = address.lineTwo;
  req.city = address.city;
  console.log(
    `Middleware for postcode: ${postcode} gives lineOne: ${
      req.lineOne || "not found"
    }`
  );
  next();
});

export default routerPostcode;
