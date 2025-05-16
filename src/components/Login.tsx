// frontend/src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', { // Your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            // Login successful
            console.log('Login successful:', data);
            localStorage.setItem('authToken', data.token); // Store the token
            localStorage.setItem('userData', JSON.stringify(data.user));


            // Navigate to a protected route or dashboard
            navigate('/dashboard'); // Replace with your desired route

        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen"> {/* Outer div if needed for layout, or remove if App.tsx handles full page layout */}
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 my-15 bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* Ensure the image path is correct relative to your public folder setup */}
                    {/* If using Vite/CRA and image is in public: src="/images/logo.png" */}
                    <img className="mx-auto h-20 w-auto" src="../../public/images/logo.png" alt="Your Company"/>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Connectez vous a votre compte</h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-2" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm/6 font-medium text-gray-900">Mot de passe</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-vertPerso">Mot de passe oublie?</a> {/* Implement this feature if needed */}
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-2" />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                                {loading ? 'Connexion' : 'Se Connecter'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Nouveau sur la plateforme?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-vertPerso">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
