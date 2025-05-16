const express = require('express');
const router = express.Router();

const db = require('../config/db')
// GET tous les enseignants
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM enseignants");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors du chargement des enseignants.' });
    }
});

// POST ajouter un enseignant
router.post('/', async (req, res) => {
    const { nom, prenom, email, specialite } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO enseignants (nom, prenom, email, specialite) VALUES (?, ?, ?, ?)",
            [nom, prenom, email, specialite]
        );
        res.status(201).json({ id: result.insertId, nom, prenom, email, specialite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l’ajout.' });
    }
});

// PUT modifier un enseignant
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, specialite } = req.body;
    try {
        await db.query(
            "UPDATE enseignants SET nom = ?, prenom = ?, email = ?, specialite = ? WHERE id = ?",
            [nom, prenom, email, specialite, id]
        );
        res.json({ id, nom, prenom, email, specialite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
    }
});

// DELETE supprimer un enseignant
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM enseignants WHERE id = ?", [id]);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
});

module.exports = router;
