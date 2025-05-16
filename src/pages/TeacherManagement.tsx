// frontend/src/pages/TeacherManagementPage.tsx
import React from 'react';
// Plus tard, vous importerez votre composant de gestion des enseignants
import TeacherManagement from '../components/userManagement/TeacherManagement';

const TeacherManagementPage: React.FC = () => {

    return (

        <div className="bg-white p-6 rounded-lg shadow-md">
            <TeacherManagement />

        </div>
    );
};

export default TeacherManagementPage;