import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
import { signOut, signOutGlobal } from "../services/authServices";
import { supabase } from "../services/supabaseClient";
import Navbar from "../components/Navbar";
import bgImage from "../assets/test-light-bg.png";

/* ─────────────────────── Reusable Components ─────────────────────── */

// Toggle Switch
const ToggleSwitch = ({ enabled, onToggle, label }) => (
    <div className="flex items-center justify-between py-5 px-2">
        <span className="text-[15px] text-[#57534e] font-medium">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-[46px] items-center rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200 p-0 ${enabled ? "bg-[#8a9a7b]" : "bg-[#d6d3d1]"
                }`}
        >
            <span
                className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${enabled ? "translate-x-[24px]" : "translate-x-[3px]"
                    }`}
            />
        </button>
    </div>
);

// Radio Group
const RadioGroup = ({ label, options, selectedValue, onChange }) => (
    <div className="mb-9">
        <h4 className="text-[14.5px] font-semibold text-[#292524] m-0 mb-4">{label}</h4>
        <div className="grid grid-cols-3 gap-[14px]">
            {options.map((opt) => {
                const isSelected = selectedValue === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-start gap-3 rounded-xl py-4 px-[18px] text-left cursor-pointer transition-all duration-150 ${isSelected
                            ? "border border-[#8a9a7b]/50 bg-[#f4f6f1] shadow-[0_0_0_1px_rgba(138,154,123,0.2)]"
                            : "border border-[rgba(214,211,208,0.9)] bg-white shadow-none"
                            }`}
                    >
                        <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white ${isSelected ? "border-[#8a9a7b]" : "border-[#d6d3d1]"
                                }`}
                        >
                            {isSelected && (
                                <span className="block h-2.5 w-2.5 rounded-full bg-[#8a9a7b]" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#292524] leading-tight m-0">
                                {opt.label}
                            </p>
                            {opt.description && (
                                <p className="text-[12.5px] text-[#a8a29e] mt-1.5 mb-0 leading-snug">
                                    {opt.description}
                                </p>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
);

// Option Row
// const OptionRow = ({ label, value, onClick }) => (
//     <button
//         onClick={onClick}
//         className="flex items-center justify-between w-full py-[22px] px-2 bg-transparent border-none cursor-pointer rounded-[10px] transition-colors duration-150 hover:bg-[#fafaf9]"
//     >
//         <span className="text-[15px] text-[#57534e] font-medium">{label}</span>
//         <span className="flex items-center gap-2 text-[14px] text-[#a8a29e]">
//             {value && <span>{value}</span>}
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//             </svg>
//         </span>
//     </button>
// );

// Section Container
const SectionContainer = ({ title, subtitle, children, footer }) => (
    <div className="flex flex-col h-full">
        {/* ── Header: more top breathing room ── */}
        <div className="mb-8 pt-1">
            <h2 className="text-2xl font-bold text-[#1c1917] tracking-[-0.01em] m-0 mb-2">
                {title}
            </h2>
            {subtitle && (
                <p className="text-[14px] text-[#a8a29e] m-0 leading-relaxed">{subtitle}</p>
            )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
            {children}
        </div>

        {/* ── Footer with well-spaced buttons ── */}
        {footer && (
            <div className="pt-[22px] mt-[18px] border-t border-[rgba(214,211,208,0.8)] flex items-center justify-end gap-[14px]">
                {footer}
            </div>
        )}
    </div>
);

// Sidebar
const Sidebar = ({ activeSection, onSelect, onBack, onDeleteAccount }) => {
    const { avatarPreview } = usePreferences();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
        };
        fetchUser();
    }, []);

    const navItems = [
        {
            id: "profile", label: "Profile",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
        },
        {
            id: "appearance", label: "Appearance",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
        },
        {
            id: "preferences", label: "Preferences",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
        },
        {
            id: "study", label: "Study Settings",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        },
        {
            id: "security", label: "Security",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        },
        {
            id: "session", label: "Session",
            icon: <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>,
        },
    ];

    return (
        <div className="w-[236px] shrink-0 border-r border-[rgba(214,211,208,0.7)] flex flex-col pt-9 px-5 pb-7 bg-[#fafaf8]">
            {/* ── User Profile: more gap and bottom margin ── */}
            <div className="flex items-center gap-[14px] px-1.5 mb-9">
                <div className={`w-[50px] h-[50px] rounded-full shrink-0 overflow-hidden shadow-[0_0_0_2px_${isDark ? '#292524' : '#fff'}]  ${isDark ? 'bg-[#292524]' : 'bg-[#f4f6f1]'}`}>
                    <img src={avatarPreview || '/default-avatar.png'} alt="avatar" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#292524] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[12.5px] text-[#a8a29e] mt-1 mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                        {user?.email || ''}
                    </p>
                </div>
            </div>

            {/* ── Nav Items: more gap between each item ── */}
            <nav className="flex-1 flex flex-col gap-1.5">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`flex items-center gap-3 w-full py-[13px] px-4 rounded-xl border-none cursor-pointer text-[14px] font-medium text-left transition-all duration-150 ${isActive ? "bg-[#8a9a7b]/14 text-[#4a6040]" : "bg-transparent text-[#78716c]"
                                }`}
                        >
                            <span className={`flex ${isActive ? "text-[#6b7d5e]" : "text-[#a8a29e]"}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>


        </div>
    );
};

/* ─────────────── Background ─────────────── */



/* ─────────────────── Button Styles ──────────────────── */

const CancelBtn = ({ onClick }) => (
    <button
        onClick={onClick}
        className="py-3 px-7 mb-4 text-[14px] font-medium text-[#78716c] border border-[#e7e5e4] rounded-xl bg-white cursor-pointer transition-colors duration-150 tracking-[0.01em] hover:bg-gray-50"
    >
        Cancel
    </button>
);

const SaveBtn = ({ onClick, children = "Save Changes", className = "" }) => (
    <button
        onClick={onClick}
        className={`py-3 px-7 mb-4 text-[14px] font-medium text-white border-none rounded-xl bg-[#8a9a7b] cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.14)] transition-colors duration-150 tracking-[0.01em] hover:bg-[#7a8a6b] ${className}`}
    >
        {children}
    </button>
);

/* ─────────────────── Sections ──────────────────── */

const ProfileSection = () => {
    const { avatarPreview, previewAvatar, uploadAvatar } = usePreferences();
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [tempName, setTempName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false)

useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        // 🔽 fetch from profiles (PRIMARY SOURCE)
        const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", user.id)
            .single();

        const name =
            profile?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "";

        setUsername(name);
        setTempName(name);
    };

    fetchUser();
}, []);

    const handleSaveName = async () => {
    if (!user || !tempName.trim()) return;

    try {
        // 1️⃣ update auth metadata
        await supabase.auth.updateUser({
            data: { full_name: tempName }
        });

        // 2️⃣ update profiles table (IMPORTANT)
        const { error } = await supabase
            .from("profiles")
            .update({ name: tempName })
            .eq("id", user.id);

        if (error) {
            console.error("Profile update error:", error);
            return;
        }

        // 3️⃣ update UI
        setUsername(tempName);
        setIsEditingName(false);

    } catch (err) {
        console.error(err);
    }
};

    const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ instant UI preview
    previewAvatar(file);

    // ✅ upload + persist
    await uploadAvatar(file);
};

    return (
        <SectionContainer
            title="Profile"
            subtitle="Manage your public profile."
        >
            <div className="mb-8">
                <h4 className="text-[14px] font-semibold text-[#292524] m-0 mb-4">Profile Picture</h4>
                <div className="flex items-center gap-6">
                    <div className="relative group w-[90px] h-[90px] rounded-full overflow-hidden border border-[#e7e5e4] shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-[#f4f6f1] shrink-0">
                        <img src={avatarPreview || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />

                        {/* Hover Overlay */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 text-[13px] font-medium text-[#57534e] bg-white border border-[#d6d3d1] rounded-xl cursor-pointer hover:bg-[#fafaf8] transition-colors shadow-sm"
                        >
                            Change photo
                        </button>
                        <p className="text-[12px] text-[#a8a29e] mt-2 mb-0">
                            JPG, GIF or PNG. 1MB max.
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Display Name */}
            <div className="mb-8">
                <h4 className="text-[14px] font-semibold text-[#292524] m-0 mb-4">Display Name</h4>
                {!isEditingName ? (
                    <div className="flex items-center gap-3">
                        <span className="text-[15px] font-serif text-[#57534e]">
                            {username || "Set a display name"}
                        </span>
                        <button
                            onClick={() => { setTempName(username); setIsEditingName(true); }}
                            className="p-1.5 bg-transparent border-none cursor-pointer text-[#a8a29e] hover:text-[#8a9a7b] transition-colors"
                            aria-label="Edit name"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="p-4 bg-white/45 border border-[#d6d3d1]/40 rounded-2xl flex flex-col gap-3 max-w-[320px]">
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[rgba(214,211,208,0.9)] bg-white text-[#57534e] font-serif focus:border-[#8a9a7b] text-[14px] outline-none transition-colors"
                            placeholder="Your display name"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button
                                onClick={() => setIsEditingName(false)}
                                className="px-4 py-2 text-[13px] font-medium rounded-xl border cursor-pointer transition-colors text-[#78716c] border-[#e7e5e4] bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveName}
                                className="px-4 py-2 text-[13px] font-medium text-white border-none rounded-xl bg-[#8a9a7b] cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:bg-[#7a8a6b] transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SectionContainer>
    );
};

const AppearanceSection = ({ prefs, updateField, onSave, onCancel }) => {
    return (
        <SectionContainer
            title="Appearance"
            subtitle="Customize the look and feel."
            footer={<><CancelBtn onClick={onCancel} /><SaveBtn onClick={onSave} /></>}
        >
            <RadioGroup
                label="Theme"
                options={[{ value: "light", label: "Light", description: "Clean and bright." }, { value: "dark", label: "Dark", description: "Easy on the eyes." }, { value: "system", label: "System", description: "Match OS setting." }]}
                selectedValue={prefs.theme}
                onChange={(v) => updateField("theme", v)}
            />
            <RadioGroup
                label="Accent Tone"
                options={[{ value: "sage", label: "Sage", description: "Calm & natural." }, { value: "slate", label: "Slate", description: "Cool & professional." }, { value: "neutral", label: "Neutral", description: "Minimal & clean." }]}
                selectedValue={prefs.accent}
                onChange={(v) => updateField("accent", v)}
            />
            <div className="border-t border-[#eeece9] mt-2 pt-2">
                <ToggleSwitch label="Reduce Motion" enabled={prefs.reduce_motion} onToggle={() => updateField("reduce_motion", !prefs.reduce_motion)} />
            </div>
        </SectionContainer>
    );
};

const PreferencesSection = ({ prefs, updateField, onSave, onCancel }) => {
    return (
        <SectionContainer
            title="Preferences"
            subtitle="Control your learning experience."
            footer={<><CancelBtn onClick={onCancel} /><SaveBtn onClick={onSave} /></>}
        >
            <ToggleSwitch label="Auto-play Lessons" enabled={prefs.auto_play} onToggle={() => updateField("auto_play", !prefs.auto_play)} />
            <div className="border-t border-[#eeece9]" />
            <ToggleSwitch label="Auto-expand Chapters" enabled={prefs.auto_expand} onToggle={() => updateField("auto_expand", !prefs.auto_expand)} />
            <div className="border-t border-[#eeece9]" />
            <ToggleSwitch label="Show Completion Percentage" enabled={prefs.show_percent} onToggle={() => updateField("show_percent", !prefs.show_percent)} />
        </SectionContainer>
    );
};

const StudySettingsSection = ({ prefs, updateField, onSave, onCancel }) => {
    return (
        <SectionContainer
            title="Study Settings"
            subtitle="Customize your learning experience."
            footer={<><CancelBtn onClick={onCancel} /><SaveBtn onClick={onSave} /></>}
        >
            <RadioGroup
                label="Explanation Style"
                options={[{ value: "straight", label: "Straight to the Point", description: "Concise explanations." }, { value: "guided", label: "Guided Understanding", description: "Step-by-step learning (Default)" }, { value: "conceptual", label: "Conceptual Mastery", description: "Deep conceptual links." }]}
                selectedValue={prefs.explanation_style}
                onChange={(v) => updateField("explanation_style", v)}
            />
            <RadioGroup
                label="Session Closure"
                options={[{ value: "open", label: "Open Ended", description: "No structured recap." }, { value: "soft", label: "Soft Closure", description: "Brief reviews and reflection." }, { value: "structured", label: "Structured Closure", description: "Recap and recall." }]}
                selectedValue={prefs.session_closure}
                onChange={(v) => updateField("session_closure", v)}
            />
            <RadioGroup
                label="Clarification Style"
                options={[{ value: "direct", label: "Direct", description: "Short, concise answers." }, { value: "guided-c", label: "Guided", description: "Step-by-step reasoning." }, { value: "exploratory", label: "Exploratory", description: "Extended conceptual links." }]}
                selectedValue={prefs.clarification_style}
                onChange={(v) => updateField("clarification_style", v)}
            />
            <RadioGroup
                label="Memory Reinforcement"
                options={[{ value: "manual", label: "Manual", description: "Review only when chosen." }, { value: "suggested", label: "Suggested", description: "Occasional review cues." }, { value: "structured-m", label: "Structured", description: "Active recall surfacing." }]}
                selectedValue={prefs.memory_reinforcement}
                onChange={(v) => updateField("memory_reinforcement", v)}
            />
        </SectionContainer>
    );
};

const SecuritySection = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailFeedback, setEmailFeedback] = useState({ type: '', msg: '' });
    const [passwordFeedback, setPasswordFeedback] = useState({ type: '', msg: '' });
    const [signOutFeedback, setSignOutFeedback] = useState({ type: '', msg: '' });
    const [signingOutAll, setSigningOutAll] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };
        fetchUser();
    }, []);

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setUpdatingEmail(true);
        setEmailFeedback({ type: '', msg: '' });
        try {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) {
                setEmailFeedback({ type: 'error', msg: error.message });
            } else {
                setEmailFeedback({ type: 'success', msg: 'Check your inbox to confirm the change.' });
                setEmail('');
            }
        } catch {
            setEmailFeedback({ type: 'error', msg: 'Failed to update email.' });
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordFeedback({ type: 'error', msg: 'Passwords do not match.' });
            return;
        }
        setUpdatingPassword(true);
        setPasswordFeedback({ type: '', msg: '' });
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setPasswordFeedback({ type: 'error', msg: error.message });
            } else {
                setPasswordFeedback({ type: 'success', msg: 'Password updated successfully.' });
                setPassword('');
                setConfirmPassword('');
            }
        } catch {
            setPasswordFeedback({ type: 'error', msg: 'Failed to update password.' });
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleSignOutAll = async () => {
        setSigningOutAll(true);
        setSignOutFeedback({ type: '', msg: '' });
        try {
            const { error } = await signOutGlobal();
            if (error) {
                setSignOutFeedback({ type: 'error', msg: error.message });
            } else {
                navigate('/login');
            }
        } catch {
            setSignOutFeedback({ type: 'error', msg: 'Sign out failed.' });
        } finally {
            setSigningOutAll(false);
        }
    };

    return (
        <SectionContainer
            title="Security"
            subtitle="Manage your account and sessions."
        >
            {/* Read-only current email & last sign in */}
            {user && (
                <div className="mb-6">
                    <p className="text-[14px] font-semibold text-[#292524] mb-2">Current Email</p>
                    <input
                        type="text"
                        value={user.email || ''}
                        readOnly
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(214,211,208,0.9)] bg-[#f4f6f1] text-[#78716c] text-[14px] outline-none cursor-not-allowed mb-2"
                    />
                    <p className="text-[12px] text-[#a8a29e]">
                        Last signed in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) : 'Unknown'}
                    </p>
                </div>
            )}

            <div className="border-t border-[#eeece9] my-6" />

            {/* Change Email */}
            <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#292524] m-0 mb-4">Change Email</h4>
                <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="New email address"
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(214,211,208,0.9)] bg-white text-[#57534e] text-[14px] outline-none focus:border-[#8a9a7b] transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={updatingEmail || !email}
                        className="w-full py-3 rounded-xl text-[14px] font-medium text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_12px_rgba(138,154,123,0.25)] transition-all duration-300 cursor-pointer border-none disabled:opacity-60"
                    >
                        {updatingEmail ? 'Updating...' : 'Update Email'}
                    </button>
                    {emailFeedback.msg && (
                        <p className={`text-xs font-medium text-center m-0 mt-1 ${emailFeedback.type === 'error' ? 'text-red-400' : 'text-[#8a9a7b]'}`}>
                            {emailFeedback.msg}
                        </p>
                    )}
                </form>
            </div>

            <div className="border-t border-[#eeece9] my-6" />

            {/* Change Password */}
            <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#292524] m-0 mb-4">Change Password</h4>
                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(214,211,208,0.9)] bg-white text-[#57534e] text-[14px] outline-none focus:border-[#8a9a7b] transition-colors"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-[rgba(214,211,208,0.9)] bg-white text-[#57534e] text-[14px] outline-none focus:border-[#8a9a7b] transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={updatingPassword || !password || !confirmPassword}
                        className="w-full py-3 rounded-xl text-[14px] font-medium text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_12px_rgba(138,154,123,0.25)] transition-all duration-300 cursor-pointer border-none disabled:opacity-60"
                    >
                        {updatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                    {passwordFeedback.msg && (
                        <p className={`text-xs font-medium text-center m-0 mt-1 ${passwordFeedback.type === 'error' ? 'text-red-400' : 'text-[#8a9a7b]'}`}>
                            {passwordFeedback.msg}
                        </p>
                    )}
                </form>
            </div>

            <div className="border-t border-[#eeece9] my-6" />

            {/* Active Sessions */}
            <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#292524] m-0 mb-4">Active Sessions</h4>
                <div className="flex items-center gap-3 py-4 px-4 bg-[#f4f6f1] border border-[rgba(214,211,208,0.5)] rounded-xl mb-4">
                    <svg className="w-5 h-5 text-[#8a9a7b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[14px] text-[#57534e] m-0 font-medium">You are currently signed in on this device.</p>
                </div>

                <button
                    onClick={handleSignOutAll}
                    disabled={signingOutAll}
                    className="w-full py-3 rounded-xl text-[14px] font-medium text-[#78716c] bg-transparent border border-[#d6d3d1] hover:bg-[#fafaf8] transition-all duration-300 cursor-pointer disabled:opacity-60"
                >
                    {signingOutAll ? 'Signing out everywhere...' : 'Sign out of all devices'}
                </button>
                {signOutFeedback.msg && (
                    <p className={`text-xs font-medium text-center m-0 mt-2 ${signOutFeedback.type === 'error' ? 'text-red-400' : 'text-[#8a9a7b]'}`}>
                        {signOutFeedback.msg}
                    </p>
                )}
            </div>
        </SectionContainer>
    );
};

const SessionSection = ({ onDeleteAccount }) => {
    const navigate = useNavigate();
    const [signingOut, setSigningOut] = useState(false);
    const [signingOutAll, setSigningOutAll] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', msg: '' });

    const handleSignOut = async () => {
        setSigningOut(true);
        setFeedback({ type: '', msg: '' });
        try {
            const { error } = await signOut();
            if (error) {
                setFeedback({ type: 'error', msg: error.message });
            } else {
                navigate('/login');
            }
        } catch {
            setFeedback({ type: 'error', msg: 'Sign out failed.' });
        } finally {
            setSigningOut(false);
        }
    };

    const handleSignOutAll = async () => {
        setSigningOutAll(true);
        setFeedback({ type: '', msg: '' });
        try {
            const { error } = await signOutGlobal();
            if (error) {
                setFeedback({ type: 'error', msg: error.message });
            } else {
                navigate('/login');
            }
        } catch {
            setFeedback({ type: 'error', msg: 'Sign out failed.' });
        } finally {
            setSigningOutAll(false);
        }
    };

    return (
        <SectionContainer
            title="Session"
            subtitle="Manage your sign-in sessions."
        >
            <div className="flex flex-col mt-2">
                {feedback.msg && (
                    <p className={`text-xs font-medium text-center m-0 mb-4 ${feedback.type === 'error' ? 'text-red-400' : 'text-[#8a9a7b]'
                        }`}>{feedback.msg}</p>
                )}

                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full py-4 mb-4 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] shadow-[0_10px_30px_rgba(138,154,123,0.25)] hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)] transition-all duration-300 cursor-pointer border-none disabled:opacity-60"
                >
                    {signingOut ? 'Signing out...' : 'Sign out of this device'}
                </button>

                <button
                    onClick={handleSignOutAll}
                    disabled={signingOutAll}
                    className="w-full py-4 rounded-xl text-[14px] font-medium text-[#78716c] bg-transparent border border-[#d6d3d1] hover:bg-[#fafaf8] hover:border-[#a8a29e] transition-all duration-300 cursor-pointer disabled:opacity-60"
                >
                    {signingOutAll ? 'Signing out everywhere...' : 'Sign out of all devices'}
                </button>

                <div className="my-4 h-[1px] bg-[#e7e5e4]" />

                <button
                    onClick={onDeleteAccount}
                    className="w-full py-4 rounded-xl text-[14px] font-medium text-red-400 bg-transparent border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
                >
                    Delete Account
                </button>
            </div>
        </SectionContainer>
    );
};

const SECTIONS = {
    profile: ProfileSection,
    appearance: AppearanceSection,
    preferences: PreferencesSection,
    study: StudySettingsSection,
    security: SecuritySection,
    session: SessionSection,
};

export default function SettingsModal() {
    const navigate = useNavigate();
    const { prefs, updateField, savePreferences, loadPreferences } = usePreferences();
    const [isOpen, setIsOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("study");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const closeDashboard = () => {
        setIsOpen(false);
        navigate(-1);
    };

    const handleSave = async () => {
        try {
            await savePreferences();
            console.log("Successfully saved preferences");
            closeDashboard();
        } catch (err) {
            console.error("Failed to save preferences:", err.response?.data || err);
        }
    };

    const handleCancel = () => {
        loadPreferences(); // Revert any unsaved changes from context
        closeDashboard();
    };

    const handleDeleteConfirm = async () => {
        if (deleteInput === 'DELETE') {
            await supabase.auth.signOut();
            navigate('/login');
        }
    };

    const ActiveContent = SECTIONS[activeSection];

    if (!isOpen) {
        return (
            <>
                <Navbar onAvatarClick={() => setIsOpen(true)} />
                <div className="relative z-10 flex items-center justify-center min-h-screen "></div>
            </>
        );
    }

    return (
        <>
            <Navbar onAvatarClick={() => setIsOpen(true)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-black/15 backdrop-blur-[2px]"
                    onClick={closeDashboard}
                />

                {/* Modal — slightly taller to give content room */}
                <div className="animate-in relative z-10 w-full max-w-[1000px] h-[650px] bg-white/95 backdrop-blur-[20px] rounded-[20px] flex overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)]">
                    <button
                        onClick={closeDashboard}
                        className="absolute top-5 right-5 z-20 p-2 rounded-lg border-none bg-transparent cursor-pointer text-[#a8a29e] hover:bg-[#a8a29e]/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <Sidebar
                        activeSection={activeSection}
                        onSelect={setActiveSection}
                        onBack={closeDashboard}
                        onDeleteAccount={() => setShowDeleteModal(true)}
                    />

                    {/* ── Content area: more padding on all sides ── */}
                    <div className="flex-1 pt-10 px-11 pb-9 overflow-hidden flex flex-col">
                        <ActiveContent
                            prefs={prefs}
                            updateField={updateField}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDeleteAccount={() => setShowDeleteModal(true)}
                        />
                    </div>
                </div>

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-stone-800 m-0">Delete your account</h3>
                            </div>
                            <p className="text-[14px] text-stone-600 mb-6 m-0 leading-relaxed">
                                This will end your session. Type <strong>DELETE</strong> to confirm.
                            </p>
                            <input
                                type="text"
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                className="w-full px-4 py-3 border border-stone-300 rounded-xl mb-6 outline-none focus:border-red-400 text-stone-800 text-[14px]"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteInput('');
                                    }}
                                    className="px-5 py-2.5 text-[14px] font-medium text-stone-600 bg-transparent border-none cursor-pointer hover:bg-stone-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={deleteInput !== 'DELETE'}
                                    onClick={handleDeleteConfirm}
                                    className="px-5 py-2.5 text-[14px] font-medium text-white bg-red-500 border-none cursor-pointer rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
