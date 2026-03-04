import React, { useEffect, useState } from 'react';
import { signOut, getSession } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [intents, setIntents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await getSession();
            if (session) {
                setUser(session.user);
                try {
                    const response = await apiClient.get('/intents');
                    setIntents(response.data.intents);
                } catch (err) {
                    console.error("Failed to fetch intents:", err);
                }
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-transparent p-12 flex flex-col items-center justify-center font-sans">
            <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-xl border border-white/40 max-w-2xl w-full text-center">
                <h1 className="text-4xl font-serif text-charcoal mb-6">Welcome back to CLARE</h1>
                {user && (
                    <p className="text-soft-gray mb-8">
                        Logged in as <span className="font-medium text-sage-600">{user.email}</span>
                    </p>
                )}
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                    {intents.length > 0 && (
                        <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Your Intents</h2>
                            <ul className="space-y-3">
                                {intents.map(intent => (
                                    <li key={intent.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                        <span className="text-charcoal font-medium">{intent.title}</span>
                                        <span className="text-xs px-2 py-1 bg-sage-100 text-sage-600 rounded-full font-bold">{intent.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={() => navigate('/ask')}
                        className="bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-xl transition-all duration-300"
                    >
                        Go to Ask
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-charcoal font-medium py-2 transition-all duration-300"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
