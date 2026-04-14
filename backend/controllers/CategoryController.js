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

    const category = await prisma.category.findUnique({
      where: { id },
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

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error creant categoria" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = req.body;

    const updatedData = await prisma.category.update({
      where: { id },
      data: {
        name: String(data.name),
        description:
          data?.description !== undefined ? String(data.description) : null,
      },
    });

    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error actualitzant categoria" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleteCategory = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.status(204).json({
      "message": "Categoria eliminada correctament!"
    });
  } catch (error) {
    console.error("Error en Prisma:", error);
    res.status(500).json({ error: "Error eliminant categoria" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
