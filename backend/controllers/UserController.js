const prisma = require("../config/prisma");
const utils = require("./Utils") 

//handles bigint values for prisma
// const handleBigInt = (data) =>
//   JSON.parse(
//     JSON.stringify(data, (_, value) =>
//       typeof value === "bigint" ? Number(value) : value
//     )
//   );


//Get all
const getUsuaris = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        // res.status(200).json(usuaris);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al carregar usuaris" });
    }
};

// Get by id (/api/users/1)
const getUsuariById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        // // Si el parametre de la busqueda is NaN, error  exemple: (/api/users/asdas)
        // if (isNaN(id)) {
        //     return res.status(400).json({ error: "ID invàlid" });
        // }

        const user = await prisma.user.findUnique({
            // where: { id: id },
            where: { id },
        });

        // // Si la res no troba l'usuari (404), error.
        // if (!user) {
        //     return res.status(404).json({ error: "Usuari no trobat" });
        // }

        res.status(200).json(handleBigInt(user));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al trobar l'usuari" });
    }
};

//Crea un usuari
const createUsuari = async (req, res) => {
    // const { name, userName, password, email } = req.body;.
    const userBody = req.body;

    try {       
        const user = await prisma.user.create({
            data: {
                name: userBody.name,
                username: userBody.username,
                email : userBody.email,
                password : userBody.password,
                role: "user",
                completed_tasks:0,
                score: 0,
                restore_token: null,
            },
        });        
        res.status(201).json(handleBigInt(user));
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al crear l'usuari" });
    }
};


//Actualitza Usuari
const updateUsuari = async (req, res) => {
    const reqBody = req.body;
    const id = parseInt(req.params.id);

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                name: reqBody.name,
                username: reqBody.username,
                email : reqBody.email,
                password : reqBody.password,
                role: "user", // forçant el rol, no volem que qualsevol canvii el seu rol a admin, o s'ha de comprobar si te rol admin avans de mosificar-lo
                completed_tasks: reqBody.completed_tasks !== undefined ? parseInt(reqBody.completed_tasks) : undefined,
                score: reqBody.score !== undefined ? parseInt(reqBody.score) : undefined,
                restore_token: reqBody.restore_token,
            },
        });
        // res.status(200).json(user);
        res.status(200).json(utils.handleBigInt(user));

    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al actualitzar l'usuari" });
    }
};


// Delete user (/api/users/1)
const deleteUsuari = async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {        
        await prisma.user.delete({
            where: { id },
        });
        res.status(204).json({ message: "Usuari eliminat correctament" });
    } catch (error) {
        console.error("Error en Prisma:", error);
        res.status(500).json({ error: "Error al eliminar l'usuari" });
    }
};

module.exports = {
    getUsuaris,
    getUsuariById,
    createUsuari,
    updateUsuari,
    deleteUsuari,
};