// server/routes/etudiants.js (Exemple simplifié)
const express = require('express');
const router = express.Router();
const db = require('.././config/db'); // Votre configuration de connexion MySQL

// GET tous les étudiants
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nom, prenom, email, matricule, DATE_FORMAT(dateInscription, "%Y-%m-%d") as dateInscription, "etudiant" as role FROM etudiants');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des étudiants." });
    }
});

// POST un nouvel étudiant
router.post('/', async (req, res) => {
    const { nom, prenom, email, matricule, dateInscription } = req.body;
    // Ajoutez la validation des données ici
    if (!nom || !prenom || !email || !matricule || !dateInscription) {
        return res.status(400).json({ message: "Tous les champs requis ne sont pas fournis." });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO etudiants (nom, prenom, email, matricule, dateInscription) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, matricule, dateInscription]
        );
        res.status(201).json({ id: result.insertId, nom, prenom, email, matricule, dateInscription, role: 'etudiant' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'étudiant." });
    }
});

// PUT (modifier) un étudiant
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, matricule, dateInscription } = req.body;
    // Validation
    if (!nom || !prenom || !email || !matricule || !dateInscription) {
        return res.status(400).json({ message: "Tous les champs requis ne sont pas fournis." });
    }
    try {
        const [result] = await db.query(
            'UPDATE etudiants SET nom = ?, prenom = ?, email = ?, matricule = ?, dateInscription = ? WHERE id = ?',
            [nom, prenom, email, matricule, dateInscription, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Étudiant non trouvé." });
        }
        res.json({ id, nom, prenom, email, matricule, dateInscription, role: 'etudiant' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la modification de l'étudiant." });
    }
});

// DELETE un étudiant
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM etudiants WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Étudiant non trouvé." });
        }
        res.status(204).send(); // No content
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'étudiant." });
    }
});

module.exports = router;