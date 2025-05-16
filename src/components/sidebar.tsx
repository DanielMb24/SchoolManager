
// frontend/src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserDataLocalStorage } from "../types"; // Importez le type

// Supposons que vous ayez des icônes (par exemple, de react-icons ou des SVG)
// import { RiHome2Line, RiFolderLine, RiCalendarEventLine, RiUserLine, RiUserSettingsLine, RiBriefcaseLine, RiFileList2Line, RiNotification2Line, RiMessage2Line, RiLogoutCircleRLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

const Sidebar: React.FC = () => {
  const [userData, setUserData] = useState<UserDataLocalStorage | null>(null);
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsedData: UserDataLocalStorage = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Erreur de parsing userData depuis localStorage:", error);
        // Optionnel: Gérer l'erreur, par exemple en déconnectant l'utilisateur
         handleLogout();
      }
    } else {
      // Si aucune donnée utilisateur, rediriger vers login (ou gérer autrement)
       navigate("/login");
    }
  }, []);

  useEffect(() => {
    // Ouvrir le menu utilisateurs si la route actuelle est une sous-route de gestion
    if (location.pathname.startsWith("/admin/gestion-")) {
      setIsUsersMenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Idéalement, informer l'utilisateur d'une déconnexion réussie (ex: avec un toast)
    navigate("/login");
  };

  const isActive = (path: string, exact = true) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  const toggleUsersMenu = () => {
    setIsUsersMenuOpen(!isUsersMenuOpen);
  };

  const renderCommonLinks = () => (
      <>
        <li>
          <Link
              to="/dashboard" // Assurez-vous que cette route existe dans votre router
              className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
            ${isActive("/dashboard")
                  ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            {/* <RiHome2Line className="mr-3 text-xl" /> */}
            <i className="ri-home-2-line mr-3 text-xl"></i> {/* Utilisez vos icônes */}
            <span>Tableau de Bord</span>
          </Link>
        </li>
        <li>
          <Link
              to="/documents"
              className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
            ${isActive("/documents")
                  ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            {/* <RiFolderLine className="mr-3 text-xl" /> */}
            <i className="bx bx-folder mr-3 text-xl"></i>
            <span>Documents</span>
          </Link>
        </li>
        <li>
          <Link
              to="/calendrier"
              className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
            ${isActive("/calendrier")
                  ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            {/* <RiCalendarEventLine className="mr-3 text-xl" /> */}
            <i className="bx bx-calendar-alt mr-3 text-xl"></i>
            <span>Calendrier</span>
          </Link>
        </li>
      </>
  );

  if (!userData) {
    // Peut-être afficher un spinner de chargement ou null en attendant les données
    return null;
  }

  return (
      <aside className="fixed left-0 top-0 w-64 h-full bg-gray-800 text-white p-4 flex flex-col shadow-2xl z-40">
        <div className="pb-4 mb-4 border-b border-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            {/* <img src="/path-to-your-logo.svg" alt="SchoolManager Logo" className="h-10 w-10" /> */}
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-bleuPerso">School</span><span className="text-vertPerso">Manager</span>
              </h1>
              <p className="text-xs font-bold pl-8 text-gray-300">Systeme de Gestion Scolaire</p>
            </div>
          </Link>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {userData.role === "administrateur" && (
                <li>
                  <button
                      onClick={toggleUsersMenu}
                      className={`w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                  ${isActive("/admin/gestion-", false)
                          ? "bg-gray-700 text-sky-400"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                  >
                    <div className="flex items-center">
                      {/* <RiUserLine className="mr-3 text-xl" /> */}
                      <i className="bx bx-user mr-3 text-xl"></i>
                      <span>Utilisateurs</span>
                    </div>
                    {/* {isUsersMenuOpen ? <RiArrowUpSLine className="text-xl" /> : <RiArrowDownSLine className="text-xl" />} */}
                    <i className={`bx ${isUsersMenuOpen ? 'bx-chevron-up' : 'bx-chevron-down'} ml-2 text-xl`}></i>
                  </button>
                  {isUsersMenuOpen && (
                      <ul className="pl-4 mt-2 space-y-1">
                        <li>
                          <Link
                              to="/admin/gestion-etudiants"
                              className={`flex items-center py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm
                        ${isActive("/admin/gestion-etudiants")
                                  ? "bg-sky-500 text-white"
                                  : "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                              }`}
                          >
                            {/* <RiUserSettingsLine className="mr-2 text-lg" /> */}
                            <i className="bx bx-user-circle mr-2 text-lg"></i>
                            <span>Gestion Étudiants</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                              to="/admin/gestion-enseignants"
                              className={`flex items-center py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm
                        ${isActive("/admin/gestion-enseignants")
                                  ? "bg-sky-500 text-white"
                                  : "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                              }`}
                          >
                            {/* <RiBriefcaseLine className="mr-2 text-lg" /> */}
                            <i className="bx bx-briefcase mr-2 text-lg"></i>
                            <span>Gestion Enseignants</span>
                          </Link>
                        </li>
                      </ul>
                  )}
                </li>
            )}

            {userData.role === "administrateur" && (
                <li>
                  <Link
                      to="/admin/activites"
                      className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                  ${isActive("/admin/activites")
                          ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                  >
                    {/* <RiFileList2Line className="mr-3 text-xl" /> */}
                    <i className="bx bx-list-ul mr-3 text-xl"></i>
                    <span>Activités</span>
                  </Link>
                </li>
            )}

            {renderCommonLinks()}

            {(userData.role === "administrateur" || userData.role === "enseignant") && (
                <>
                  <li>
                    <Link
                        to="/notifications"
                        className={`flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                    ${isActive("/notifications")
                            ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                    >
                      <div className="flex items-center">
                        {/* <RiNotification2Line className="mr-3 text-xl" /> */}
                        <i className="bx bx-bell mr-3 text-xl"></i>
                        <span>Notifications</span>
                      </div>
                      <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    5
                  </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                        to="/messages"
                        className={`flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                    ${isActive("/messages")
                            ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                    >
                      <div className="flex items-center">
                        {/* <RiMessage2Line className="mr-3 text-xl" /> */}
                        <i className="bx bx-envelope mr-3 text-xl"></i>
                        <span>Messages</span>
                      </div>
                      <span className="ml-auto bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    2
                  </span>
                    </Link>
                  </li>
                </>
            )}

            {/* Liens spécifiques pour enseignant non admin */}
            {userData.role === "enseignant" && (
                <li>
                  <Link
                      to="/enseignant/activites" // Route spécifique si nécessaire
                      className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                  ${isActive("/enseignant/activites")
                          ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                  >
                    {/* <RiFileList2Line className="mr-3 text-xl" /> */}
                    <i className="bx bx-list-ul mr-3 text-xl"></i>
                    <span>Mes Activités</span>
                  </Link>
                </li>
            )}


            {/* Liens spécifiques pour étudiant */}
            {userData.role === "etudiant" && (
                <li>
                  <Link
                      to="/etudiant/cours" // Exemple de route spécifique
                      className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                  ${isActive("/etudiant/cours")
                          ? "bg-gradient-to-r from-sky-600 to-cyan-400 text-white shadow-lg"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                  >
                    {/* <RiBookOpenLine className="mr-3 text-xl" /> */}
                    <i className="bx bx-book-open mr-3 text-xl"></i> {/* Exemple d'icône */}
                    <span>Mes Cours</span>
                  </Link>
                </li>
            )}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 ease-in-out"
          >
            {/* <RiLogoutCircleRLine className="mr-2 text-xl" /> */}
            <i className="bx bx-log-out-circle mr-2 text-xl"></i>
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
