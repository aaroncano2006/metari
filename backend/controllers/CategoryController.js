const prisma = require("../config/prisma");

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