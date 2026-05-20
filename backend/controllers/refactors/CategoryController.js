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
    const reqBody = req.body;

    const data = {
      name: reqBody.name,
      description:
        reqBody?.description !== undefined ? reqBody.description : null,
    };

    const validate = await validateCategory(data);

    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const category = await prisma.category.create({
      data
    });

    res.status(201).json(category);
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

    const reqBody = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: {id}
    });

    const data = {
       name: reqBody.name ?? existingCategory.name,
       description: reqBody.description ?? existingCategory.description,
    };

    const validate = await validateCategory(data, true);

    if (validate) {
      const error = new Error(validate);
      error.statusCode = 400;
      throw error;
    }

    const updatedData = await prisma.category.update({
      where: { id },
      data
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

    await prisma.meta.updateMany({
      where: { category_id: id },
      data: { category_id: null },
    });

    await prisma.category.delete({
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
