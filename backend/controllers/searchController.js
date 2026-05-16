const prisma = require("../config/prisma");
const utils = require("../helpers/Utils");

const search = async (req, res, next) => {
  try {
    const searchWord = req.body.search;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchWord,
            },
          },
          {
            username: {
              contains: searchWord,
            },
          },
        ],
      },
    });

    const metas = await prisma.meta.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchWord,
            },
          },
          {
            description: {
              contains: searchWord,
            },
          },
        ],
        is_public: true
      },
      include: {
        category: true,
        author: true,
      },
    });

    const groups = await prisma.group.findMany({
      where: {
        OR: [
          {
            name: searchWord,
          },
          {
            description: searchWord,
          },
        ],
        is_public: true
      },
      include: {
        owner: true,
        groupUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
        users,
        metas: utils.handleBigInt(metas),
        groups
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    search
};