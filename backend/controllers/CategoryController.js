const prisma = require("../config/prisma");

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error carregant categories" });
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    // Aquesta condició si es manté
    if (!category) {
      const error = new Error("No s'ha trobat la categoria");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error en Prisma:", error);
    // res.status(500).json({ error: "Error carregant categoria" });
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = req.body;

    // Aquesta condició serà modificada quan afegim els validadors.
    if (!category.name || typeof(category.name) !== "string") {
      const error = new Error("Invalid category name");
      error.statusCode = 404;
      throw error;
    }

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
    // res.status(500).json({ error: "Error creant categoria" });
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // const category = await prisma.category.findUnique({
    //   where: { id },
    // });

    // // Aquesta condició si es manté
    // if (!category) {
    //   const error = new Error("No s'ha trobat la categoria");
    //   error.statusCode = 404;
    //   throw error;
    // }

    const data = req.body;

    // Aquesta condició serà modificada quan afegim els validadors.
    if (!data.name || typeof(data.name) !== "string") {
      const error = new Error("Invalid category name");
      error.statusCode = 400;
      throw error;
    }

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
    // res.status(500).json({ error: "Error actualitzant categoria" });
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
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
    // res.status(500).json({ error: "Error eliminant categoria" });
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
