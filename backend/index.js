const express = require('express');
require('dotenv').config();
const app = express();
const categoryRoutes = require('./routes/CategoryRoutes');

app.use(express.json());

app.get("/", (request, response) => {
    return response.status(200).json({
        message: "Hello world"
    });
});

app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});