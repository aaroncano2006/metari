const express = require('express');
require('dotenv').config();
const app = express();
const categoryRoutes = require('./routes/CategoryRoutes');
const userRoutes = require('./routes/UserRoutes');
const metaRoutes = require('./routes/MetaRoutes');
const errorHandler = require('./middlewares/errors/errorHandler');
const transporter = require('./config/nodemailer');

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello world"
    });
});

app.post("/test-email", async (req, res, next) => {
  const { to, subject, text } = req.body;

  try {
    const info = await transporter.sendMail({
      from: 'Metari',
      to: to,
      subject: subject,
      text: text,
      html: `<p>${text}</p>`,
    });

    res.status(200).json({
      message: "Correo enviado correctamente",
      info: info.messageId,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.use('/api/categories', categoryRoutes);
app.use('/api/usuaris', userRoutes);
app.use('/api/metas', metaRoutes);



app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});