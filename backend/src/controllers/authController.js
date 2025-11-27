const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = 'miClaveSuperSecreta'; // En producción usa una variable de entorno

const login = (req, res) => {
  const { email, password } = req.body;

  try {
    // Leer usuarios (esto es un ejemplo, en realidad deberías tener una base de datos)
    const usersDir = path.join(__dirname, '../data/users');
    const userFiles = fs.readdirSync(usersDir);
    
    let userFound = null;
    userFiles.forEach(file => {
      const user = require(path.join(usersDir, file));
      if (user.email === email && user.password === password) {
        userFound = user;
      }
    });

    if (!userFound) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Crear token
    const token = jwt.sign(
      { id: userFound.id, email: userFound.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };