const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});

const adapter = new PrismaMariaDb({
  host: process.env.ADAPTER_HOST || "localhost",
  port: process.env.ADAPTER_PORT || 3306,
  user: process.env.ADAPTER_USER || "root",
  password: process.env.ADAPTER_PASSWORD,
  database: process.env.ADAPTER_DATABASE,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;