const express = require('express');
const cors = require('cors');
const path = require('path');
const productsRoutes = require('./src/routes/products');
const categoriesRoutes = require('./src/routes/categories');
const { login } = require('./src/controllers/authController');
const authMiddleware = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de e-commerce!');
});

app.post('/api/login', login);

app.use('/img', express.static(path.join(__dirname, '../img')));

app.use('/api/categories', authMiddleware, categoriesRoutes);
app.use('/api/products', authMiddleware, productsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});