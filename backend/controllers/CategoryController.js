const prisma = require("../config/prisma");
const {
  validateCategory,
} = require("../middlewares/validators/validateCategory");

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

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
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = req.body;

    const validate = await validateCategory(category);

    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
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
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const data = req.body;

    const validate = await validateCategory(category);

    if (validate) {
      const error = new Error(validate);
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
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("ID invàlid");
      error.statusCode = 400;
      throw error;
    }

    const deleteCategory = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error en Prisma:", error);
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
