
// frontend/src/components/layout/DashboardLayout.tsx
// @ts-ignore
import React, { useEffect, useState } from 'react';

import {Link, Outlet, useNavigate} from 'react-router-dom'; // Outlet est crucial ici
import { UserDataLocalStorage } from '../../types';
import Sidebar from "../sidebar";

const DashboardLayout: React.FC = () => {
    const [userData, setUserData] = useState<UserDataLocalStorage | null>(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('authToken');

        // Rediriger vers la page de connexion
        navigate('/login');
    };
    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const parsedData: UserDataLocalStorage = JSON.parse(storedData);
            setUserData(parsedData);
        } else {
            // Si pas de données utilisateur, l'App.tsx devrait déjà gérer la redirection
            // mais une vérification ici peut être une sécurité supplémentaire.
            // navigate('/login');
        }
    }, [navigate]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                // Gérer l'erreur si la demande de plein écran est refusée
                console.warn(`Erreur lors du passage en plein écran : ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(r => {

                });
            }
        }
    };


    const renderNavbar = () => (
        <div className="py-3 px-6 bg-white flex items-center shadow-md sticky top-0 z-30 border-b border-gray-200">
            {/* Vous pouvez ajouter un bouton pour ouvrir/fermer la sidebar sur mobile ici */}
            {/* <button className="md:hidden text-gray-600">
                <i className="bx bx-menu text-2xl"></i>
            </button> */}
            <div className="ml-auto flex items-center gap-4">
                <button
                    onClick={toggleFullScreen}
                    title="Plein écran"
                    className="text-gray-500 hover:text-sky-600 transition-colors"
                >
                    {/* Utiliser une icône plus appropriée si disponible */}
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z" />
                    </svg>
                </button>

                <div className="relative group">
                    <button className="flex items-center gap-2">
                        <div className="w-9 h-9 relative">
                            <img
                                className="w-full h-full rounded-full object-cover border-2 border-sky-500"
                                src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg" // Remplacez par une image dynamique ou un placeholder
                                alt="Avatar de l'utilisateur"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="text-left hidden sm:block">
                            <h2 className="text-sm font-semibold text-gray-700">
                                {userData?.nom || 'Utilisateur'}
                            </h2>
                            <p className="text-xs text-gray-500 capitalize">{userData?.role}</p>
                        </div>
                    </button>
                    {/* Dropdown de profil (optionnel) */}
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block py-1">
                        <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100">Mon Profil</Link>
                        <button onClick={() => { handleLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 text-red-600">
                            Se déconnecter
                        </button>
                    </div>
                </div>
          </div>
        </div>
    );


    if (!userData) {
        // Gérer le cas où les données utilisateur ne sont pas encore chargées
        // Cela pourrait être un écran de chargement global
        return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
                {renderNavbar()}
                <div className="p-4 md:p-6 lg:p-8">
                    <Outlet /> {/* C'est ici que le contenu des routes enfants sera rendu */}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
