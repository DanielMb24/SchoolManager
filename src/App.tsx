// frontend/src/App.tsx
// @ts-ignore
import React, { ReactNode } from 'react'; // ✅ Import de ReactNode
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';

import DashboardLayout from './components/layout/MainLayout';
import DashboardHomePage from './pages/DashboardHomePage';
import StudentManagementPage from './pages/StudentManagement';
import TeacherManagementPage from './pages/TeacherManagement';

const isAuthenticated = () => !!localStorage.getItem('authToken');

interface ProtectedRouteProps {
    children: ReactNode; // ✅ Type correct avec l'import
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <Router>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<DashboardHomePage />} />
                    <Route path="admin/gestion-etudiants" element={<StudentManagementPage />} />
                    <Route path="admin/gestion-enseignants" element={<TeacherManagementPage />} />
                </Route>

                <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
