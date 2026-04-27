const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();
// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../.env")
// });
const app = express();

app.use(helmet())
// app.use(helmet())
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// )

//avans de les rutes!! despes de helmet!!
app.use(cors())
// app.use(
//   cors({
//     origin: "http://localhost:5173"
//   })
// );


// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = ["http://localhost:3001/", "http://localhost:5173/"]

//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   }),
// );


app.use(express.json());



const categoryRoutes = require('./routes/CategoryRoutes');
const userRoutes = require('./routes/UserRoutes');
const invitationRoutes = require('./routes/InvitationRoutes');
const metaRoutes = require('./routes/MetaRoutes');
const grupRoutes = require('./routes/GroupRoutes');
const assignationRoutes = require('./routes/AssignationRoutes');
const commentRoutes = require('./routes/CommentRoutes');
const proofRoutes = require('./routes/ProofRoutes');
const groupUserRoutes = require('./routes/GroupUserRoutes');
const indexedMetaRoutes = require('./routes/IndexedMetaRoutes');
const errorHandler = require('./middlewares/errors/errorHandler');
const nodemailer = require('./config/nodemailer');

const environment = process.env.ENVIRONMENT || "dev";
const PORT =
  (environment === "dev" ? process.env.LOCAL_PORT : process.env.DOCKER_PORT) ||
  3001;
const HOST = (environment === "dev" ? process.env.LOCALHOST : process.env.DOCKERHOST) || "http://localhost"
const BASE_URL = `${HOST}:${PORT}`;

app.get("/api", (req, res) => {
  res.json({
    ok: true,
    message: "Metari API - Documentation for security audit",
    endpoints: {
      categories: {
        base: `${BASE_URL}/api/categories`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      usuaris: {
        base: `${BASE_URL}/api/usuaris`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      invitacions: {
        base: `${BASE_URL}/api/invitacions`,
        methods: {
          GET: ["/:userid/:sentorreceived/:status"],
          POST: ["/:senderid/:receiverid", "/:senderid/:receiverid/:groupid"],
          PUT: ["/:receiverid/:id"],
          DELETE: ["/:userid/:id"]
        }
      },
      metas: {
        base: `${BASE_URL}/api/metas`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      grups: {
        base: `${BASE_URL}/api/grups`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      assignacions: {
        base: `${BASE_URL}/api/assignacions`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      comentaris: {
        base: `${BASE_URL}/api/comentaris`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      proves: {
        base: `${BASE_URL}/api/proves`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      },
      grups_usuaris: {
        base: `${BASE_URL}/api/grups-usuaris`,
        methods: {
          GET: ["/", "/:group_id/:user_id"],
          POST: ["/"],
          PUT: ["/:group_id/:user_id"],
          DELETE: ["/:group_id/:user_id"]
        }
      },
      indexa_metas: {
        base: `${BASE_URL}/api/indexa-metas`,
        methods: {
          GET: ["/", "/:id"],
          POST: ["/"],
          PUT: ["/:id"],
          DELETE: ["/:id"]
        }
      }
    }
  });
});

// app.post("/api/test-email", async (req, res, next) => {
//   const { to, subject, text } = req.body;

//   try {
//     const info = await nodemailer.sendMail({
//       from: 'Metari',
//       to: to,
//       subject: subject,
//       text: text,
//       html: `<p>${text}</p>`,
//     });

//     res.status(200).json({
//       message: "Correo enviado correctamente",
//       info: info.messageId,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

app.use('/api/categories', categoryRoutes);
app.use('/api/usuaris', userRoutes);
app.use('/api/invitacions', invitationRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/grups', grupRoutes);
app.use('/api/assignacions', assignationRoutes );
app.use('/api/comentaris', commentRoutes );
app.use('/api/proves', proofRoutes );
app.use('/api/grups-usuaris', groupUserRoutes );
app.use('/api/indexa-metas', indexedMetaRoutes );

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
