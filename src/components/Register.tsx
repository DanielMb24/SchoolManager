import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        role: '',
        email: '',
        mdp: '',
        confirmMdp: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailField, setShowEmailField] = useState(true); // Or based on role logic

    const navigate = useNavigate();

    // Logic to show/hide email based on role, if needed.
    // For now, we assume email is always needed.
    useEffect(() => {
        if (formData.role === 'etudiant' || formData.role === 'enseignant' || formData.role === 'administrateur') { // Example logic
            setShowEmailField(true);
        } else {
            setShowEmailField(false);
        }
    }, [formData.role]);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.mdp !== formData.confirmMdp) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }
        if (formData.mdp.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            setLoading(false);
            return;
        }

        // Prepare data for backend (remove confirmMdp)
        const { confirmMdp, ...submissionData } = formData;

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', { // Your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            setSuccess('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
            // Optionally navigate to login page after a delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md   ">
                <img className="mx-auto h-20 w-auto" src="../../public/images/logo.png" alt="Your Company"/>
                <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

                <form onSubmit={handleSubmit} id="form-inscription" className="space-y-4">
                    <div className="flex gap-4">
                        <div>
                            <label htmlFor="nom" className="block mb-1 text-sm font-medium">Nom</label>
                            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required
                                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        <div>
                            <label htmlFor="prenom" className="block mb-1 text-sm font-medium">Prénom</label>
                            <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange}
                                   required
                                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block mb-1 text-sm font-medium">Rôle</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un rôle</option>
                            <option value="administrateur">Administrateur</option>
                            <option value="enseignant">Enseignant</option>
                            <option value="etudiant">Étudiant</option>
                        </select>
                    </div>

                    {/* The email field in your original code was hidden.
                        Make sure your logic correctly shows it if it's needed based on role or always.
                        For now, it's always visible and required.
                    */}
                    {showEmailField && (
                        <div id="email-container">
                            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    )}

                    <div>
                        <label htmlFor="mdp" className="block mb-1 text-sm font-medium">Mot de passe</label>
                        <input type="password" id="mdp" name="mdp" value={formData.mdp} onChange={handleChange} minLength={6} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="confirmMdp" className="block mb-1 text-sm font-medium">Confirmer mot de passe</label>
                        <input type="password" id="confirmMdp" name="confirmMdp" value={formData.confirmMdp} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                    <div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
