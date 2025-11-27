const express = require('express');
const cors = require('cors');
const productsRoutes = require('./src/routes/products');
const categoriesRoutes = require('./src/routes/categories');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRoutes);

app.use('/api/products', productsRoutes);


app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de e-commerce!');
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const { login } = require('./src/controllers/authController');


app.post('/api/login', login);

const path = require('path');
app.use('/img', express.static(path.join(__dirname, '../img')));