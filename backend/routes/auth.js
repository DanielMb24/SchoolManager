// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Ensure db.js is correct and exporting a promise pool
require('dotenv').config();

const router = express.Router(); // Crucial: Initializes the router
const JWT_SECRET = process.env.JWT_SECRET;

// --- Registration Route ---
router.post('/register', async (req, res) => {
    const { nom, prenom, role, email, mdp } = req.body;

    if (!nom || !prenom || !role || !email || !mdp) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    if (mdp.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }
    // ... (rest of the registration logic from the previous example) ...
    try {
        const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mdp, salt);
        const [result] = await db.query(
            'INSERT INTO users (nom, prenom, role, email, password) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, role, email, hashedPassword]
        );
        res.status(201).json({ message: 'Utilisateur créé avec succès!', userId: result.insertId });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création du compte.' });
    }
});

// --- Login Route ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }
    // ... (rest of the login logic from the previous example) ...
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        const { password: _, ...userData } = user;
        res.status(200).json({
            message: 'Connexion réussie!',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
});

module.exports = router; // Crucial: Exports the router instance