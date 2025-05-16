const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // <-- Déclare ici AVANT utilisation

// Importation des routes
const authRoutes = require('./routes/auth');
const etudiantsRoutes = require('./routes/etudiants');
const enseignantsRoutes = require('./routes/enseignants');

const db = require('./config/db');

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('SchoolManager API is running!');
});
app.use('/api/auth', authRoutes);
app.use('/api/etudiants', etudiantsRoutes);
app.use('/api/enseignants', enseignantsRoutes);

// Gestionnaire d'erreurs (à la fin)
app.use((err, req, res, next) => {
    console.error(err.stack || err.message || err);
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    res.status(statusCode).json({
        message: err.message || 'Une erreur interne est survenue.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// Connexion DB puis démarrage serveur
db.query('SELECT 1')
    .then(() => {
        console.log('MySQL Database connected successfully.');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the MySQL database');
        console.error(err);
        process.exit(1);
    });
