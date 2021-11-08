const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config({
  path: `./environment/.env.${process.env.NODE_ENV}`,
});

module.exports = new Sequelize({
  dialectModule: pg,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
});
