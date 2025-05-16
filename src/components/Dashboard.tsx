// frontend/src/components/Dashboard.tsx

import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Sidebar from "./sidebar";


interface UserData {
    nom: string;
    role: 'administrateur' | 'enseignant' | 'etudiant' | string;
}

const Dashboard: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const parsedData: UserData = JSON.parse(storedData);
            setUserData(parsedData);
        }
    }, []);

    const renderCards = () => (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Etudiants */}
                <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between mb-6">
                        <div>
                            <div className="text-2xl font-semibold">1500</div>
                            <div className="text-sm font-medium text-gray-400">Étudiants</div>
                        </div>
                    </div>
                    <a href="#" className="text-[#f84525] font-medium text-sm hover:text-red-800">Voir plus</a>
                </div>

                {/* Enseignants */}
                <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between mb-6">
                        <div>
                            <div className="text-2xl font-semibold">100</div>
                            <div className="text-sm font-medium text-gray-400">Enseignants</div>
                        </div>
                    </div>
                    <a href="#" className="text-[#f84525] font-medium text-sm hover:text-red-800">Voir plus</a>
                </div>

                {/* Classes */}
                <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                    <div className="flex justify-between mb-6">
                        <div>
                            <div className="text-2xl font-semibold">50</div>
                            <div className="text-sm font-medium text-gray-400">Classes</div>
                        </div>
                    </div>
                    <a href="#" className="text-[#f84525] font-medium text-sm hover:text-red-800">Voir plus</a>
                </div>
            </div>
        </div>
    );

    const renderNavbar = () => (
        <div className="py-5 px-6 bg-white flex items-center shadow-md sticky top-0 z-30">
            <ul className="ml-auto flex items-center gap-4">
                {/* Fullscreen button */}
                <button
                    onClick={() => {
                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                        } else {
                            document.documentElement.requestFullscreen();
                        }
                    }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg width="24" height="24" fill="gray" viewBox="0 0 24 24">
                        <path d="M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z" />
                    </svg>
                </button>

                {/* Profile */}
                <li className="dropdown ml-3">
                    <button className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg"
                                alt="profile"
                            />
                            <div className="absolute top-0 left-7 w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                {userData?.nom || 'Utilisateur'}
                            </h2>
                            <p className="text-xs text-gray-500">{userData?.role}</p>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    );

    if (!userData) return null;

    return (
        <div className="flex bg-gray-200 min-h-screen font-inter">
            <Sidebar />
            <main className="w-full md:w-[calc(100%-256px)] md:ml-64 transition-all">
                {renderNavbar()}
                {renderCards()}
            </main>
        </div>
    );
};

export default Dashboard;
