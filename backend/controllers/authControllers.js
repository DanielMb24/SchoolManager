
// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { nom, prenom, role, email, mdp, confirmMdp } = req.body;

    // Validations de base
    if (!nom || !prenom || !role || !mdp || !confirmMdp) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }
    if (mdp !== confirmMdp) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }
    if (mdp.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    let userEmail = email;
    if (role === 'etudiant') {
        // Pour les étudiants, l'email est optionnel. S'il n'est pas fourni, il sera NULL.
        // S'il est fourni (chaîne vide ou valeur), il sera stocké.
        // Assurez-vous que votre frontend envoie `null` ou n'envoie pas du tout le champ `email`
        // si l'étudiant ne doit pas en avoir.
        userEmail = email ? email.trim() : null;
        if (userEmail === "") userEmail = null;
    } else {
        // Pour admin et enseignant, l'email est requis
        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "L'email est requis pour les administrateurs et les enseignants." });
        }
        userEmail = email.trim();
    }

    try {
        // Vérifier si l'email existe déjà (s'il est fourni et non null)
        if (userEmail) {
            const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [userEmail]);
            if (existingUser.length > 0) {
                return res.status(409).json({ message: "Cet email est déjà utilisé." });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mdp, salt);

        const newUser = {
            nom,
            prenom,
            role,
            email: userEmail, // Sera NULL si étudiant sans email
            password: hashedPassword
        };

        const [result] = await db.query('INSERT INTO users SET ?', newUser);
        res.status(201).json({ message: "Utilisateur enregistré avec succès!", userId: result.insertId });

    } catch (error) {
        console.error("Erreur d'inscription:", error);
        // Vérifier les erreurs spécifiques de la base de données (ex: contrainte d'unicité)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Cet email est déjà utilisé (erreur base de données)." });
        }
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "L'email et le mot de passe sont requis." });
    }

    try {
        // Les étudiants peuvent s'inscrire sans email. La connexion se fait TOUJOURS par email ici.
        // Si les étudiants doivent se connecter autrement (ex: matricule), cette logique doit être adaptée.
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects (email non trouvé)." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects (mot de passe erroné)." });
        }

        const tokenPayload = {
            id: user.id,
            role: user.role,
            nom: user.nom
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expire en 1 heure

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true en production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 'strict' ou 'lax'. 'lax' est souvent nécessaire pour le dev.
            maxAge: 3600000 // 1 heure
        });

        res.status(200).json({
            message: "Connexion réussie!",
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        expires: new Date(0)
    });
    res.status(200).json({ message: "Déconnexion réussie." });
};

exports.checkAuthStatus = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({ isAuthenticated: false, user: null }); // Ou 401 si vous préférez
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Optionnel: vérifier si l'utilisateur existe toujours dans la DB
        const [users] = await db.query('SELECT id, nom, prenom, email, role FROM users WHERE id = ?', [decoded.id]);
        if (users.length === 0) {
            // Cas où le token est valide mais l'utilisateur a été supprimé
            res.cookie('token', '', { httpOnly: true, expires: new Date(0) }); // Invalider le cookie
            return res.status(200).json({ isAuthenticated: false, user: null, message: "Utilisateur non trouvé." });
        }
        res.status(200).json({ isAuthenticated: true, user: users[0] });
    } catch (error) {
        // Token invalide ou expiré
        res.cookie('token', '', { httpOnly: true, expires: new Date(0) }); // Invalider le cookie en cas d'erreur
        res.status(200).json({ isAuthenticated: false, user: null, message: "Session invalide ou expirée." });
    }
};