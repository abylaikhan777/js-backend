const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "baqulauDB",
  password: "postgresql",
  port: 5432,
});

module.exports = pool;
