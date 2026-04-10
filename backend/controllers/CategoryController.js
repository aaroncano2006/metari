const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "metari_db",
});

const prisma = new PrismaClient({ adapter });

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en Prisma:", error); 
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

module.exports = {
  prisma,
  getCategories,
};