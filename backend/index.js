const express = require("express");
require("dotenv").config();
// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../.env")
// });
const app = express();
const categoryRoutes = require("./routes/CategoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const invitationRoutes = require("./routes/InvitationRoutes");
const metaRoutes = require("./routes/MetaRoutes");
const grupRoutes = require("./routes/GroupRoutes");
const assignationRoutes = require("./routes/AssignationRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const proofRoutes = require("./routes/ProofRoutes");
const groupUserRoutes = require("./routes/GroupUserRoutes");
const indexedMetaRoutes = require("./routes/IndexedMetaRoutes");
const errorHandler = require("./middlewares/errors/errorHandler");
const nodemailer = require("./config/nodemailer");

const environment = process.env.ENVIRONMENT || "dev";

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello world",
  });
});

// app.post("/test-email", async (req, res, next) => {
//   const { to, subject, text } = req.body;

//   try {
//     const info = await nodemailer.sendMail({
//       from: "Metari",
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

app.use("/api/categories", categoryRoutes);
app.use("/api/usuaris", userRoutes);
app.use("/api/invitacions", invitationRoutes);
app.use("/api/metas", metaRoutes);
app.use("/api/grups", grupRoutes);
app.use("/api/assignacions", assignationRoutes);
app.use("/api/comentaris", commentRoutes);
app.use("/api/proves", proofRoutes);
app.use("/api/grupUsuaris", groupUserRoutes);
app.use("/api/indexaMetas", indexedMetaRoutes);

app.use(errorHandler);
const PORT =
  (environment === "dev" ? process.env.LOCAL_PORT : process.env.DOCKER_PORT) ||
  3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
