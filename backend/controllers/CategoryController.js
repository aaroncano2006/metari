const prisma = require("../config/prisma");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en Prisma:", error); 
    res.status(500).json({ error: 'Error carregant categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    console.log(id);

    const category = await prisma.category.findUnique({
      where: {id: id}
    });

    res.status(200).json(category);
  } catch (error) {
    console.error("Error en Prisma:", error); 
    res.status(500).json({ error: 'Error carregant categoria' });
  }
}

module.exports = {
  prisma,
  getCategories,
  getCategoryById,
};