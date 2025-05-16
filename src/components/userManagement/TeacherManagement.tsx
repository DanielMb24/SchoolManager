import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    fetchEnseignants,
    addEnseignant,
    updateEnseignant,
    deleteEnseignant
} from '../../services/enseignantService';
import { toast } from 'react-toastify';

const TeacherManagement: React.FC = () => {
    const [teachers, setTeachers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const data = await fetchEnseignants();
                setTeachers(data);
            } catch (err) {
                setError('Erreur de chargement des enseignants');
                toast.error("Erreur de chargement des enseignants");
            } finally {
                setIsLoading(false);
            }
        };
        loadTeachers().then(r => {

        });
    }, []);

    const handleAddTeacher = () => {
        setCurrentUser(null);
        setError(null);
        setShowModal(true);
    };

    const handleEditTeacher = (teacher: User) => {
        setCurrentUser(teacher);
        setError(null);
        setShowModal(true);
    };

    const handleDeleteTeacher = async (teacherId: string | number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
            try {
                await deleteEnseignant(teacherId);
                setTeachers(prev => prev.filter(t => t.id !== teacherId));
                toast.success("Enseignant supprimé avec succès");
            } catch (err) {
                setError("Erreur lors de la suppression.");
                toast.error("Erreur lors de la suppression.");
            }
        }
    };

    const handleSaveTeacher = async (teacherData: Omit<User, 'id' | 'role'>) => {
        try {
            if (currentUser) {
                const updated = await updateEnseignant(currentUser.id, teacherData);
                setTeachers(prev => prev.map(t => t.id === currentUser.id ? updated : t));
                toast.success("Enseignant mis à jour avec succès");
            } else {
                const created = await addEnseignant(teacherData);
                setTeachers(prev => [...prev, created]);
                toast.success("Nouvel enseignant ajouté");
            }
            setShowModal(false);
            setCurrentUser(null);
        } catch (err) {
            setError("Erreur lors de l'enregistrement.");
            toast.error("Erreur lors de l'enregistrement.");
        }
    };

    const columns = [
        { Header: 'Nom', accessor: 'nom' },
        { Header: 'Prénom', accessor: 'prenom' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Spécialité', accessor: 'specialite' },
        {
            Header: 'Actions',
            Cell: ({ row }: any) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEditTeacher(row.original)} className="text-blue-600 hover:text-blue-800 p-1" title="Modifier">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteTeacher(row.original.id)} className="text-red-600 hover:text-red-800 p-1" title="Supprimer">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <div className="text-center py-10">Chargement des enseignants...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Gestion des Enseignants</h2>
                <button
                    onClick={handleAddTeacher}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Ajouter un enseignant
                </button>
            </div>
            <UserTable columns={columns} data={teachers} />
            {showModal && (
                <UserForm
                    user={currentUser}
                    onClose={() => { setShowModal(false); setCurrentUser(null); }}
                    onSave={handleSaveTeacher}
                    role="enseignant"
                />
            )}
        </div>
    );
};

export default TeacherManagement;
