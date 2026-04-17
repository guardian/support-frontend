import express from "express";
import routerPostcode from "./routes/postcode";

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/postcode-lookup", routerPostcode);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
