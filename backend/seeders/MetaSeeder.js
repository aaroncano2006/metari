const prisma = require("../config/prisma");

const seedMetas = async () => {
  try {
    const metas = await prisma.meta.findMany();
    const overrideDB = false; 

    if (metas.length > 0 && !overrideDB) {
        console.log("Existing Metas found! Aborting database seeding!");
        return;
    }

    const createMany = await prisma.meta.createMany({
      data: [
        {
          title:"Fer el llit",
          description:"Al matí, si pot ser",
          category_id: 2,
          author_id:2,
        },
        {
          title:"Captura un Pikachu shiny",
          description:"A la versio Gold/Silver",
          category_id: 7,
          author_id:3,
          type:"challenge"

        },
        {
          title:"Crear un generador de laberints ",
          description:"En el llenguatge que prefereixis",
          category_id: 3,
          author_id:1,
          type:"challenge"
        },
        {
          title:"Acabar deures de mates",
          description:"",
          category_id: 8,
          author_id:1,
        },
        {
          title:"Caminar 5 km",
          description:"",
          category_id: 5,
          author_id:1,
        },
        {
          title:"Fer una partida al Monopoly",
          description:"",
          category_id: 6,
          author_id:1,
        },
        {
          title:"Fer una partida al Catan",
          description:"",
          category_id: 6,
          author_id:1,
        },
        {
          title:"Fer una partida al Carcassonne",
          description:"",
          category_id: 6,
          author_id:1,
        },
        {
          title:"Passar l'aspirador",
          description:"Siusplau...",
          category_id: 2,
          author_id:2,
        },
        {
          title:"Fer campana",
          description:"no fa mal a ningu ;)",
          category_id: 8,
          author_id:2,
          type:"challenge"
        },
        {
          title:"Acabar el model 3D",
          description:"",
          category_id: 8,
          author_id:2,
          type:"task"
        },
        {
          title:"Netejar el PC",
          description:"",
          category_id: 1,
          author_id:2,
          type:"task"
        },
        {
          title:"Instal·lar GrapheneOS al smartphone",
          description:"Millora la privacitat",
          category_id: 1,
          author_id:2,
          type:"task"
        },
        {
          title:"Rentar els plats",
          description:"",
          category_id: 2,
          author_id:2,
        },
        {
          title:"Repassar equacions de segon grau",
          description:"",
          category_id: 3,
          author_id:1,
        },
        {
          title:"Repassar el teorema de Pitàgores",
          description:"",
          category_id: 3,
          author_id:1,
        },
        {
          title:"Actualitzar despeses del mes",
          description:"",
          category_id: 2,
          author_id:2,
        },
        {
          title:"Automatitzar càlculs amb fulls de càlcul",
          description:"",
          category_id: 3,
          author_id:2,
        },
        {
          title:"Organitzar partit de fútbol",
          description:"",
          category_id: 4,
          author_id:1,
        },
        {
          title:"Organitzar partit de tennis",
          description:"",
          category_id: 4,
          author_id:2,
        },
        {
          title:"Organitzar partit de Paddel",
          description:"",
          category_id: 4,
          author_id:1,
        },
        {
          title:"Apuntar-se a l'amarató",
          description:"",
          category_id: 5,
          author_id:1,
        },
        {
          title:"Fer el Camí de Santiago",
          description:"",
          category_id: 5,
          author_id:1,
        },
        {
          title:"Acabar Expedition 33",
          description:"",
          category_id: 7,
          author_id:1,
        },
        {
          title:"Acabar projecte final de DAW",
          description:"",
          category_id: 8,
          author_id:1,
        },
        {
          title:"Acabar el dibuix pendent",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Pintar amb aquarel·la",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Crear tipografia",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Construir maqueta",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Fer escultura de ceramica",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Completar buscamines",
          description:"En menys de 30 segons",
          category_id: 7,
          author_id:2,
          type:"challenge"
        },
        {
          title:"Pintar amb oli",
          description:"",
          category_id: 9,
          author_id:1,
        },
        {
          title:"Fer backups dels meus fitxers",
          description:"",
          category_id: 1,
          author_id:1,
        },
        {
          title:"Apuntar-se al gimnàs",
          description:"",
          category_id: 5,
          author_id:1,
        },
        {
          title:"Planificar una rutina esportiva",
          description:"",
          category_id: 5,
          author_id:1,
        },
        {
          title:"Completar Crash Banticoot 3 al 105%",
          description:"",
          category_id: 7,
          author_id:1,
          type:"challenge"
        },
        
        
        
      ],
      skipDuplicates: true,
    });

    console.log("Metas seeded!");
  } catch (error) {
    console.log(`Error executant els seeders de les metes: ${error}`);
  }
};

module.exports = {
  seedMetas,
};
