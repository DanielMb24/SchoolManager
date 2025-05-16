// frontend/src/components/userManagement/StudentManagement.tsx
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    fetchEtudiants,
    addEtudiant,
    updateEtudiant,
    deleteEtudiant,
} from '../../services/etudiantService';   //importation des differents services qu'on peut avoir dans la gestion des etudiants


const StudentManagement: React.FC = () => {
    const [students, setStudents] = useState<User[]>([]); // initialiation d'un nouvel etudiant
    const [isLoading, setIsLoading] = useState(true); // pour le chargement
    const [error, setError] = useState<string | null>(null); // pour les erreurs
    const [showModal, setShowModal] = useState(false); // constance pour la modale
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const data = await fetchEtudiants();
                setStudents(data);
            } catch (err) {
                setError("Erreur lors du chargement des étudiants.");
            } finally {
                setIsLoading(false);
            }
        };
        loadStudents().then(r => {

        });
    }, []);


    //fonction pour appeler ajouter d'un etudiant
    const handleAddStudent = () => {
        setCurrentUser(null);

        setError(null);
        setShowModal(true);
    };

    const handleEditStudent = (student: User) => {
        setCurrentUser(student);
        setError(null);
        setShowModal(true);
    };

    const handleDeleteStudent = async (studentId: string | number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
            try {
                await deleteEtudiant(studentId);
                setStudents(prev => prev.filter(s => s.id !== studentId));
            } catch (err) {
                setError("Erreur lors de la suppression de l'étudiant.");
            }
        }
    };

    const handleSaveStudent = async (studentData: Omit<User, 'id' | 'role'>) => {
        try {
            if (currentUser) {
                const updated = await updateEtudiant(currentUser.id, studentData);
                setStudents(prev =>
                    prev.map(s => String(s.id) === String(updated.id) ? updated : s)
                );

            } else {
                const created = await addEtudiant(studentData);
                setStudents(prev => [...prev, created]);
            }
            setShowModal(false);
            setCurrentUser(null);
        } catch (err) {
            setError("Erreur lors de l'enregistrement de l'étudiant.");
        }
    };

    const columns = [
        { Header: 'Matricule', accessor: 'matricule' },
        { Header: 'Nom', accessor: 'nom' },
        { Header: 'Prénom', accessor: 'prenom' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Date Inscription', accessor: 'dateInscription' },
        {
            Header: 'Actions',
            Cell: ({ row }: any) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEditStudent(row.original)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Modifier"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDeleteStudent(row.original.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <div className="text-center py-10">Chargement des étudiants...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Gestion des Étudiants</h2>
                <button
                    onClick={handleAddStudent}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Ajouter un étudiant
                </button>
            </div>

            <UserTable columns={columns} data={students} />

            {showModal && (
                <UserForm
                    user={currentUser}
                    onClose={() => { setShowModal(false); setCurrentUser(null); }}
                    onSave={handleSaveStudent}
                    role="etudiant"
                />
            )}
        </div>
    );
};

export default StudentManagement;
