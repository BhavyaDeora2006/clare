import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../services/authServices';
import { supabase } from '../services/supabaseClient';
import background from '../assets/test-light-bg.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true/false = result

  /* ── Verify the recovery session from the URL token ── */
  useEffect(() => {
    const checkSession = async () => {
      // Supabase automatically exchanges the token from the URL hash
      // and fires a PASSWORD_RECOVERY event
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setTokenValid(true);
      } else {
        // Listen for the auth event in case it hasn't fired yet
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'PASSWORD_RECOVERY' && session) {
              setTokenValid(true);
            }
          }
        );

        // Give it a few seconds, then mark as invalid
        const timeout = setTimeout(() => {
          setTokenValid(prev => prev === null ? false : prev);
        }, 4000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        // Handle common Supabase errors
        if (updateError.message.includes('same_password')) {
          setError('New password must be different from your current password.');
        } else if (updateError.message.includes('weak_password')) {
          setError('Password is too weak. Use at least 6 characters.');
        } else {
          setError(updateError.message);
        }
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Checking token state ── */
  if (tokenValid === null) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${background})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 z-0" />
        <div className="relative z-10 text-center">
          <svg className="animate-spin h-8 w-8 text-[#8a9a7b] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-[14px] text-gray-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  /* ── Invalid / expired token ── */
  if (tokenValid === false) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${background})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 z-0" />
        <div className="relative z-10 w-full max-w-[480px] mx-auto px-6">
          <div className="bg-white/75 backdrop-blur-xl rounded-[2rem] py-14 px-10 md:px-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/40 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-[24px] font-serif text-[#1c1917] mb-3">
              Link expired or invalid
            </h2>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-8">
              This password reset link has expired, already been used, or is invalid.
              Please request a new one.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(107,143,122,0.3)] transition-all duration-300 active:scale-[0.98] relative overflow-hidden border-none cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              <span className="relative">Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${background})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 z-0" />

      <div className="relative z-10 w-full max-w-[480px] mx-auto px-6">
        <div className="bg-white/75 backdrop-blur-xl rounded-[2rem] py-14 px-10 md:px-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/40">

          {!success ? (
            <>
              <h1 className="text-[28px] font-serif text-[#1c1917] mb-3 tracking-wide">
                Set new password
              </h1>
              <p className="text-[14px] text-gray-400 leading-relaxed mb-10">
                Enter your new password below. Must be at least 6 characters.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-gray-100 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 focus:bg-white outline-none transition-all duration-300 text-charcoal placeholder-gray-300 shadow-sm"
                    required
                    autoFocus
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-gray-100 focus:border-sage-500 focus:ring-1 focus:ring-sage-500/20 focus:bg-white outline-none transition-all duration-300 text-charcoal placeholder-gray-300 shadow-sm"
                    required
                    minLength={6}
                  />
                </div>

                {/* Password strength hint */}
                {password.length > 0 && password.length < 6 && (
                  <p className="text-amber-400 text-xs font-medium text-center">
                    Password needs at least 6 characters ({6 - password.length} more)
                  </p>
                )}

                {/* Mismatch warning */}
                {confirm.length > 0 && password !== confirm && (
                  <p className="text-amber-400 text-xs font-medium text-center">
                    Passwords don't match
                  </p>
                )}

                {error && (
                  <p className="text-red-400 text-xs font-medium text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || password.length < 6 || password !== confirm}
                  className="w-full bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(107,143,122,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden border-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </span>
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#f4f6f1] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#8a9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-[24px] font-serif text-[#1c1917] mb-3">
                Password updated
              </h2>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
