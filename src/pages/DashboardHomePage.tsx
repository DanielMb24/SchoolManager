
// frontend/src/pages/DashboardHomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Si les "Voir plus" deviennent des liens

const DashboardHomePage: React.FC = () => {
    // Vous pouvez récupérer ces chiffres dynamiquement plus tard
    const stats = [
        { title: "Étudiants", count: 1500, link: "/admin/gestion-etudiants", icon: "🎓" },
        { title: "Enseignants", count: 100, link: "/admin/gestion-enseignants", icon: "👩‍🏫" },
        { title: "Classes", count: 50, link: "/admin/gestion-classes", icon: "🏫" }, // Suppose une page de gestion des classes
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
                            </div>
                            <div className="text-3xl bg-sky-100 text-sky-600 p-3 rounded-lg">
                                {stat.icon}
                            </div>
                        </div>
                        <Link
                            to={stat.link}
                            className="inline-flex items-center text-sky-600 hover:text-sky-800 font-medium text-sm group"
                        >
                            Voir plus
                            <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </Link>
                    </div>
                ))}
            </div>
            {/* Vous pouvez ajouter d'autres sections ici, comme des graphiques, des activités récentes, etc. */}
        </div>
    );
};

export default DashboardHomePage;
