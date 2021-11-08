const express = require("express");
const searchRouter = require("./api/search-router");
const productsRouter = require("./api/products-router");

const app = express();

require("dotenv").config({
  path: `./environment/.env.${process.env.NODE_ENV}`,
});

app.use(express.json());
app.use(express.urlencoded());
app.use("/search", searchRouter);
app.use("/products", productsRouter);

app.listen(8000, () => {
  console.log("Server starts");
});
