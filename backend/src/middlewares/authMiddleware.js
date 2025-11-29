
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'miClaveSuperSecreta'; 

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Error al verificar token' });
  }
};

module.exports = authMiddleware;