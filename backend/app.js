const express = require('express');
const cors = require('cors');
const path = require('path');
const productsRoutes = require('./src/routes/products');
const categoriesRoutes = require('./src/routes/categories');
const { login } = require('./src/controllers/authController');
const authMiddleware = require('./src/middlewares/authMiddleware');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: "localhost", 
  user: "root", 
  password:"jap2025", 
  database: "ecommerce",
  connectionLimit: 5
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de e-commerce!');
});

app.post('/api/login', login);


/* DESAFÍATE ENTREGA 8 */
app.post('/api/cart', async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO carrito (id_usuario) VALUES (?)",
      [userId]
    );

    const cartId = result.insertId;

    const queryItems = `
      INSERT INTO item_carrito 
      (id_carrito, id_producto, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?)
    `;

   
    for (const item of items) {
      await conn.query(queryItems, [
        cartId,            
        item.id_producto,  
        item.cantidad,     
        item.precio        
      ]);
    }

    res.json({
      message: "Carrito guardado",
      cartId: cartId
    });

  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: "Error al guardar el carrito" });
  } finally {

    if (conn) conn.end();
  }
});


app.use('/img', express.static(path.join(__dirname, '../img')));

app.use('/api/categories', authMiddleware, categoriesRoutes);
app.use('/api/products', authMiddleware, productsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);



});

