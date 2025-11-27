const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    try {
        const categoriesDir = path.join(__dirname, '../data/categories');
        const categoryFiles = fs.readdirSync(categoriesDir);
        const allCategories = [];

        categoryFiles.forEach(file => {
            const filePath = path.join(categoriesDir, file);
            const categoryData = require(filePath);
            allCategories.push(categoryData);
        });

        res.json(allCategories);
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        res.status(500).json({ error: 'Error al cargar las categorías' });
    }
});

module.exports = router;
