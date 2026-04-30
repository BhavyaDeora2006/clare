import React, { useState } from 'react';

import { signIn, signUp, signInWithGoogle, resetPassword } from '../services/authServices';
import background from '../assets/test-light-bg.png';

const Login = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetError('');
        setResetLoading(true);
        try {
            const { error } = await resetPassword(resetEmail);
            if (error) {
                setResetError(error.message);
            } else {
                setResetSent(true);
            }
        } catch (err) {
            setResetError('An unexpected error occurred.');
        } finally {
            setResetLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isSignIn) {
                result = await signIn(email, password);
            } else {
                result = await signUp(email, password);
            }

            if (result.error) {
                setError(result.error.message);
            } else {
                console.log('Success:');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) setError(error.message);
        } catch (err) {
            setError('Google Sign In failed.');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
            {/* Full-screen background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url(${background})` }}
            />

            {/* Subtle luxury overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-24 py-12 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">

                {/* Left Text Section */}
                <div className="mx-[-120px] w-full md:w-[55%] flex flex-col items-start justify-center animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-serif text-charcoal leading-[1.1] mb-10 tracking-wide">
                        Study without <br /> losing your thread.
                    </h1>
                    <p className="text-xl md:text-2xl text-soft-gray font-light max-w-lg leading-relaxed">
                        CLARE preserves your intent, context, and progress.
                    </p>
                </div>

                {/* Right Side - Auth Card */}
                <div className="mx-[-120px] w-full max-w-[480px] animate-fade-in-up transition-all duration-700 delay-100">
                    <div className="bg-white/75 backdrop-blur-xl rounded-[2rem] py-14 px-10 md:px-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/40 flex flex-col min-h-[600px]">

                        {/* Tabs */}
                        <div className="flex space-x-10 mb-12 border-b border-gray-100/60">
                            <button
                                onClick={() => { setIsSignIn(true); setError(''); }}
                                className={`pb-4 text-base font-medium transition-all duration-300 relative ${isSignIn ? 'text-charcoal' : 'text-gray-400 hover:text-gray-500'
                                    }`}
                            >
                                Sign In
                                {isSignIn && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-sage-500 rounded-full animate-scale-x" />
                                )}
                            </button>
                            <button
                                onClick={() => { setIsSignIn(false); setError(''); }}
                                className={`pb-4 text-base font-medium transition-all duration-300 relative ${!isSignIn ? 'text-charcoal' : 'text-gray-400 hover:text-gray-500'
                                    }`}
                            >
                                Create Account
                                {!isSignIn && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-sage-500 rounded-full animate-scale-x" />
                                )}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-gray-100 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 focus:bg-white outline-none transition-all duration-300 text-charcoal placeholder-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                                        Password
                                    </label>
                                    {isSignIn && (
                                        <button type="button" onClick={() => { setShowForgot(true); setResetEmail(email); setResetSent(false); setResetError(''); }} className="text-[10px] text-gray-400 hover:text-sage-500 transition-colors uppercase tracking-[0.05em] font-semibold bg-transparent border-none cursor-pointer">
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-gray-100 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 focus:bg-white outline-none transition-all duration-300 text-charcoal placeholder-gray-300 shadow-sm"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs font-medium mt-2 animate-shake text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(107,143,122,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                                <span className="relative flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        isSignIn ? 'Enter CLARE' : 'Join CLARE'
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200/40"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                                <span className="bg-transparent px-4 text-gray-300 font-bold">or</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center space-x-4 border border-gray-200/60 hover:border-gray-300 bg-white/40 hover:bg-white/80 text-charcoal font-medium py-4 rounded-xl transition-all duration-300 active:scale-[0.98] hover:shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                />
                            </svg>
                            <span className="tracking-wide">Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Forgot Password Overlay */}
            {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setShowForgot(false)} />
                    <div className="relative z-10 w-full max-w-[440px] mx-6 bg-white/90 backdrop-blur-xl rounded-[2rem] py-12 px-10 shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-white/40">
                        <button
                            onClick={() => setShowForgot(false)}
                            className="absolute top-5 right-5 p-2 rounded-lg border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!resetSent ? (
                            <>
                                <h2 className="text-[26px] font-serif text-[#1c1917] mb-3 tracking-wide">Reset password</h2>
                                <p className="text-[13px] text-gray-400 leading-relaxed mb-8">
                                    Enter your email and we'll send you a link to reset your password.
                                </p>
                                <form onSubmit={handleForgotPassword} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full px-5 py-4 rounded-xl bg-white/50 border border-gray-100 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 focus:bg-white outline-none transition-all duration-300 text-charcoal placeholder-gray-300 shadow-sm"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {resetError && <p className="text-red-400 text-xs font-medium text-center">{resetError}</p>}
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(107,143,122,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden border-none cursor-pointer"
                                    >
                                        <span className="relative flex items-center justify-center">
                                            {resetLoading ? 'Sending...' : 'Send Reset Link'}
                                        </span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-[#f4f6f1] rounded-full flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-7 h-7 text-[#8a9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <h3 className="text-[20px] font-serif text-[#1c1917] mb-2">Check your email</h3>
                                <p className="text-[13px] text-gray-400 mb-1">We've sent a reset link to</p>
                                <p className="text-[13px] font-semibold text-[#1c1917] mb-6">{resetEmail}</p>
                                <button
                                    onClick={() => setShowForgot(false)}
                                    className="text-[12px] text-[#8a9a7b] hover:text-[#6b7d5e] font-medium bg-transparent border-none cursor-pointer transition-colors"
                                >
                                    ← Back to login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
