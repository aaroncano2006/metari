const express = require('express');
require('dotenv').config();
const app = express();
const categoryRoutes = require('./routes/CategoryRoutes');
const errorHandler = require('./middlewares/errors/errorHandler');

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello world"
    });
});

app.use('/api/categories', categoryRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});