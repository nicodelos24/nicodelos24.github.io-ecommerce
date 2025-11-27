const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


router.get('/', (req, res) => {
    try {
        const productsDir = path.join(__dirname, '../data/products');
        const productFiles = fs.readdirSync(productsDir);
        const allProducts = [];

        productFiles.forEach(file => {
            const filePath = path.join(productsDir, file);
            const productData = require(filePath);
            allProducts.push(productData);
        });

        res.json(allProducts);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});


router.get('/:id', (req, res) => {
    try {
        const productId = req.params.id;
        const productPath = path.join(__dirname, `../data/products/${productId}.json`);
        
        if (fs.existsSync(productPath)) {
            const product = require(productPath);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        res.status(500).json({ error: 'Error al cargar el producto' });
    }
});

module.exports = router;