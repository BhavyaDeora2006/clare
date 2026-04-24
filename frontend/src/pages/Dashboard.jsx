import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPreferences, updatePreferences } from "../services/preferencesService";
import Navbar from "../components/Navbar";

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
const OptionRow = ({ label, value, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-[22px] px-2 bg-transparent border-none cursor-pointer rounded-[10px] transition-colors duration-150 hover:bg-[#fafaf9]"
    >
        <span className="text-[15px] text-[#57534e] font-medium">{label}</span>
        <span className="flex items-center gap-2 text-[14px] text-[#a8a29e]">
            {value && <span>{value}</span>}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </span>
    </button>
);

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
const Sidebar = ({ activeSection, onSelect, onBack }) => {
    const navItems = [
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
    ];

    return (
        <div className="w-[236px] shrink-0 border-r border-[rgba(214,211,208,0.7)] flex flex-col pt-9 px-5 pb-7 bg-[#fafaf8]">
            {/* ── User Profile: more gap and bottom margin ── */}
            <div className="flex items-center gap-[14px] px-1.5 mb-9">
                <div className="w-[50px] h-[50px] rounded-full shrink-0 bg-gradient-to-br from-[#c5cebf] to-[#8a9a7b] overflow-hidden shadow-[0_0_0_2px_#fff]">
                    <img
                        src="https://assets.leetcode.com/users/Bhavya_Deora/avatar_1772714696.png"
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#292524] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                        Bhavya Deora
                    </p>
                    <p className="text-[12.5px] text-[#a8a29e] mt-1 mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
                        bhavya@email.com
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

            {/* ── Sidebar footer ── */}
            <div className="mt-auto pt-6 border-t border-[rgba(214,211,208,0.6)]">
                <button className="py-[11px] px-4 text-[13.5px] text-red-500/70 bg-transparent border-none cursor-pointer w-full text-left rounded-xl transition-all duration-150 mt-1 hover:bg-gray-100/50">
                    Delete account
                </button>
            </div>
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

const SecuritySection = ({ prefs, updateField, onSave, onCancel }) => (
    <SectionContainer
        title="Security"
        subtitle="Manage your account security."
        footer={<><CancelBtn onClick={onCancel} /><SaveBtn onClick={onSave} /></>}
    >
        <OptionRow label="Connected Accounts" value="Google" onClick={() => { }} />
        <div className="border-t border-[#eeece9]" />
        <OptionRow label="Change Password" value="" onClick={() => { }} />
        <div className="border-t border-[#eeece9]" />
        <OptionRow label="Active Sessions" value="This device" onClick={() => { }} />
    </SectionContainer>
);

const SECTIONS = {
    appearance: AppearanceSection,
    preferences: PreferencesSection,
    study: StudySettingsSection,
    security: SecuritySection,
};

const defaultPrefs = {
    theme: "dark",
    accent: "sage",
    reduce_motion: false,
    auto_play: true,
    auto_expand: false,
    show_percent: true,
    explanation_style: "guided",
    session_closure: "soft",
    clarification_style: "guided-c",
    memory_reinforcement: "suggested",
};

export default function SettingsModal() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("study");

    // Single source of truth for all preferences
    const [prefs, setPrefs] = useState(defaultPrefs);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch from backend
    const loadPreferences = async () => {
        try {
            setIsLoading(true);
            const data = await getPreferences();
            if (data && Object.keys(data).length > 0) {
                // Merge defaultPrefs with incoming data
                setPrefs(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error("Failed to load preferences:", err.response?.data || err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load preferences when modal opens
    useEffect(() => {
        if (isOpen) {
            loadPreferences();
        }
    }, [isOpen]);

    const updateField = (key, value) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const closeDashboard = () => {
        setIsOpen(false);
        navigate(-1);
    };

    const handleSave = async () => {
        try {
            await updatePreferences(prefs);
            console.log("Successfully saved preferences");
            closeDashboard();
        } catch (err) {
            console.error("Failed to save preferences:", err.response?.data || err);
        }
    };

    const handleCancel = () => {
        loadPreferences(); // Revert any unsaved changes
        closeDashboard();
    };

    const ActiveContent = SECTIONS[activeSection];

    if (!isOpen) {
        return (
            <>
                <Navbar onAvatarClick={() => setIsOpen(true)} />
                <div className="relative z-10 flex items-center justify-center min-h-screen ">
                </div>
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

                    <Sidebar activeSection={activeSection} onSelect={setActiveSection} onBack={closeDashboard} />

                    {/* ── Content area: more padding on all sides ── */}
                    <div className="flex-1 pt-10 px-11 pb-9 overflow-hidden flex flex-col">
                        <ActiveContent
                            prefs={prefs}
                            updateField={updateField}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
