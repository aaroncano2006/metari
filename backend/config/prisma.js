const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../../.env"),
// });

const environment = process.env.ENVIRONMENT || "dev";

const adapter = new PrismaMariaDb({
  host:
    (environment === "dev"
      ? process.env.LOCAL_ADAPTER_HOST
      : process.env.DOCKER_ADAPTER_HOST) || "localhost",
  port:
    (environment === "dev"
      ? process.env.LOCAL_ADAPTER_PORT
      : process.env.DOCKER_ADAPTER_PORT) || 3306,
  // user: process.env.ADAPTER_USER || "root",
  // password: process.env.ADAPTER_PASSWORD,
  // database: process.env.ADAPTER_DATABASE,
  user:
    (environment === "dev"
      ? process.env.LOCAL_ADAPTER_USER
      : process.env.DOCKER_ADAPTER_USER) || "root",
  password:
    environment === "dev"
      ? process.env.LOCAL_ADAPTER_PASSWORD
      : process.env.DOCKER_ADAPTER_PASSWORD,
  database:
    environment === "dev"
      ? process.env.LOCAL_ADAPTER_DATABASE
      : process.env.DOCKER_ADAPTER_DATABASE,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
