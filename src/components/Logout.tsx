// frontend/src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('authToken');
        alert("Vous êtes déconnecté.");
        // Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
            Déconnexion
        </button>
    );
}

export default Logout;
