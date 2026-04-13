const prisma = require("../config/prisma");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error carregant categories" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    console.log(id);

    const category = await prisma.category.findUnique({
      where: { id: id },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error carregant categoria" });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = req.body;

    const newCategory = await prisma.category.create({
      data: {
        name: String(category.name),
        description:
          category?.description !== undefined
            ? String(category.description)
            : null,
      },
    });

    res.status(200).json(newCategory);
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error creant categoria" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
};
