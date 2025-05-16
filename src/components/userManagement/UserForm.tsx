// frontend/src/components/userManagement/UserForm.tsx
// @ts-ignore
import React, { useState, useEffect, FormEvent } from 'react';
import { User } from '../../types';

interface UserFormProps {
    user: User | null; // null pour ajout, User pour modification
    onClose: () => void;
    onSave: (userData: Omit<User, 'id' | 'role'>) => void; // On ne gère pas l'id et le rôle ici directement
    role: 'etudiant' | 'enseignant';
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave, role }) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        matricule: '', // Spécifique à étudiant
        specialite: '', // Spécifique à enseignant
        dateInscription: '', // Spécifique à étudiant
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                matricule: user.matricule || '',
                specialite: user.specialite || '',
                dateInscription: user.dateInscription ? new Date(user.dateInscription).toISOString().split('T')[0] : '',
            });
        } else {
            // Réinitialiser pour un nouvel utilisateur
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                matricule: '',
                specialite: '',
                dateInscription: '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "L'adresse email n'est pas valide.";
        }

        if (role === 'etudiant') {
            if (!formData.matricule.trim()) newErrors.matricule = "Le matricule est requis.";
            if (!formData.dateInscription) newErrors.dateInscription = "La date d'inscription est requise.";
        } else if (role === 'enseignant') {
            if (!formData.specialite.trim()) newErrors.specialite = "La spécialité est requise.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSave: any = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
            };
            if (role === 'etudiant') {
                dataToSave.matricule = formData.matricule;
                dataToSave.dateInscription = formData.dateInscription;
            } else if (role === 'enseignant') {
                dataToSave.specialite = formData.specialite;
            }
            onSave(dataToSave);
        }
    };

    const title = `${user ? 'Modifier' : 'Ajouter'} un ${role === 'etudiant' ? 'étudiant' : 'enseignant'}`;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center mb-6 pb-3 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fermer la modale"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                                required
                            />
                            {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                        </div>
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.prenom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                                required
                            />
                            {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                            required
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {role === 'etudiant' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                                <input
                                    type="text"
                                    name="matricule"
                                    id="matricule"
                                    value={formData.matricule}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.matricule ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                                />
                                {errors.matricule && <p className="text-xs text-red-500 mt-1">{errors.matricule}</p>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="dateInscription" className="block text-sm font-medium text-gray-700 mb-1">Date d'inscription</label>
                                <input
                                    type="date"
                                    name="dateInscription"
                                    id="dateInscription"
                                    value={formData.dateInscription}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.dateInscription ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                                />
                                {errors.dateInscription && <p className="text-xs text-red-500 mt-1">{errors.dateInscription}</p>}
                            </div>
                        </>
                    )}

                    {role === 'enseignant' && (
                        <div className="mb-6">
                            <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                            <input
                                type="text"
                                name="specialite"
                                id="specialite"
                                value={formData.specialite}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.specialite ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
                            />
                            {errors.specialite && <p className="text-xs text-red-500 mt-1">{errors.specialite}</p>}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                        >
                            {user ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;