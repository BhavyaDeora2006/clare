import React, { useState } from "react";

/* ─────────────────────── Reusable Components ─────────────────────── */

// Toggle Switch
const ToggleSwitch = ({ enabled, onToggle, label }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 8px" }}>
        <span style={{ fontSize: 15, color: "#57534e", fontWeight: 500 }}>{label}</span>
        <button
            onClick={onToggle}
            style={{
                position: "relative", display: "inline-flex", height: 24, width: 46,
                alignItems: "center", borderRadius: 999, border: "none", cursor: "pointer",
                backgroundColor: enabled ? "#8a9a7b" : "#d6d3d1", transition: "background-color 0.2s",
                padding: 0, flexShrink: 0,
            }}
        >
            <span style={{
                display: "inline-block", height: 18, width: 18, borderRadius: "50%",
                backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transform: enabled ? "translateX(24px)" : "translateX(3px)",
                transition: "transform 0.2s",
            }} />
        </button>
    </div>
);

// Radio Group
const RadioGroup = ({ label, options, selectedValue, onChange }) => (
    <div style={{ marginBottom: 36 }}>
        <h4 style={{ fontSize: 14.5, fontWeight: 600, color: "#292524", margin: "0 0 16px" }}>{label}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {options.map((opt) => {
                const isSelected = selectedValue === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            borderRadius: 12, padding: "16px 18px", textAlign: "left", cursor: "pointer",
                            border: isSelected ? "1px solid rgba(138,154,123,0.5)" : "1px solid rgba(214,211,208,0.9)",
                            background: isSelected ? "#f4f6f1" : "#fff",
                            boxShadow: isSelected ? "0 0 0 1px rgba(138,154,123,0.2)" : "none",
                            transition: "all 0.15s",
                        }}
                    >
                        <span style={{
                            marginTop: 2, display: "flex", height: 20, width: 20, flexShrink: 0,
                            alignItems: "center", justifyContent: "center", borderRadius: "50%",
                            border: isSelected ? "1.5px solid #8a9a7b" : "1.5px solid #d6d3d1",
                            backgroundColor: "#fff",
                        }}>
                            {isSelected && (
                                <span style={{ height: 10, width: 10, borderRadius: "50%", backgroundColor: "#8a9a7b", display: "block" }} />
                            )}
                        </span>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#292524", lineHeight: 1.3, margin: 0 }}>
                                {opt.label}
                            </p>
                            {opt.description && (
                                <p style={{ fontSize: 12.5, color: "#a8a29e", margin: "5px 0 0", lineHeight: 1.4 }}>
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
        style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "22px 8px", background: "none", border: "none",
            cursor: "pointer", borderRadius: 10, transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#fafaf9"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
        <span style={{ fontSize: 15, color: "#57534e", fontWeight: 500 }}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#a8a29e" }}>
            {value && <span>{value}</span>}
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </span>
    </button>
);

// Section Container
const SectionContainer = ({ title, subtitle, children, footer }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* ── Header: more top breathing room ── */}
        <div style={{ marginBottom: 32, paddingTop: 4 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1c1917", letterSpacing: "-0.01em", margin: "0 0 8px" }}>
                {title}
            </h2>
            {subtitle && (
                <p style={{ fontSize: 14, color: "#a8a29e", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
            )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
            {children}
        </div>

        {/* ── Footer with well-spaced buttons ── */}
        {footer && (
            <div style={{
                paddingTop: 22,
                marginTop: 18,
                borderTop: "1px solid rgba(214,211,208,0.8)",
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14,
            }}>
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
            icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
        },
        {
            id: "preferences", label: "Preferences",
            icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
        },
        {
            id: "study", label: "Study Settings",
            icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        },
        {
            id: "security", label: "Security",
            icon: <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        },
    ];

    return (
        <div style={{
            width: 236,
            flexShrink: 0,
            borderRight: "1px solid rgba(214,211,208,0.7)",
            display: "flex",
            flexDirection: "column",
            /* ── More top padding on the sidebar ── */
            padding: "36px 20px 28px",
            backgroundColor: "#fafaf8",
        }}>
            {/* ── User Profile: more gap and bottom margin ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 6px", marginBottom: 36 }}>
                <div style={{
                    width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #c5cebf, #8a9a7b)",
                    overflow: "hidden", boxShadow: "0 0 0 2px #fff",
                }}>
                    <img
                        src="https://imgs.search.brave.com/bT1Vn8WOO2oMVeeB7eIgRzqPtD7_U0zLN9bt0gIS5R4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDEv/NTAzLzc1Ni9zbWFs/bC9ib3ktZmFjZS1h/dmF0YXItY2FydG9v/bi1mcmVlLXZlY3Rv/ci5qcGc"
                        alt="avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    />
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#292524", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Bhavya Deora
                    </p>
                    <p style={{ fontSize: 12.5, color: "#a8a29e", margin: "4px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        bhavya@email.com
                    </p>
                </div>
            </div>

            {/* ── Nav Items: more gap between each item ── */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12, width: "100%",
                                /* ── Taller nav items ── */
                                padding: "13px 16px",
                                borderRadius: 12, border: "none", cursor: "pointer",
                                fontSize: 14, fontWeight: 500, textAlign: "left", transition: "all 0.15s",
                                backgroundColor: isActive ? "rgba(138,154,123,0.14)" : "transparent",
                                color: isActive ? "#4a6040" : "#78716c",
                            }}
                        >
                            <span style={{ color: isActive ? "#6b7d5e" : "#a8a29e", display: "flex" }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* ── Sidebar footer ── */}
            <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid rgba(214,211,208,0.6)" }}>
                <button style={{
                    padding: "11px 16px", fontSize: 13.5, color: "rgba(239,68,68,0.7)",
                    background: "none", border: "none", cursor: "pointer", width: "100%",
                    textAlign: "left", borderRadius: 12, transition: "all 0.15s", marginTop: 4,
                }}>
                    Delete account
                </button>
            </div>
        </div>
    );
};

/* ─────────────── Background ─────────────── */

const AppBackground = () => (
    <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg, #e8e4dd 0%, #ddd9d2 50%, #d4d0c8 100%)" }}>
        <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
            <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: "0.25em", color: "#78716c" }}>CLARE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {["Craft", "Learn", "Ask", "Refine", "Echo"].map((tab) => (
                    <button key={tab} style={{ fontSize: 14, fontWeight: 500, background: "none", border: "none", cursor: "pointer", paddingBottom: 4, color: tab === "Learn" ? "#1c1917" : "#a8a29e", borderBottom: tab === "Learn" ? "2px solid #57534e" : "2px solid transparent" }}>{tab}</button>
                ))}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,0.5)" }}>
                <img src="https://imgs.search.brave.com/bT1Vn8WOO2oMVeeB7eIgRzqPtD7_U0zLN9bt0gIS5R4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDEv/NTAzLzc1Ni9zbWFs/bC9ib3ktZmFjZS1h/dmF0YXItY2FydG9v/bi1mcmVlLXZlY3Rv/ci5qcGc" alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            </div>
        </nav>
    </div>
);

/* ─────────────────── Sections ──────────────────── */

const AppearanceSection = () => {
    const [theme, setTheme] = useState("dark");
    const [accent, setAccent] = useState("sage");
    const [reduceMotion, setReduceMotion] = useState(false);
    return (
        <SectionContainer title="Appearance" subtitle="Customize the look and feel." footer={<><button style={cancelBtnStyle}>Cancel</button><button style={saveBtnStyle}>Save Changes</button></>}>
            <RadioGroup label="Theme" options={[{ value: "light", label: "Light", description: "Clean and bright." }, { value: "dark", label: "Dark", description: "Easy on the eyes." }, { value: "system", label: "System", description: "Match OS setting." }]} selectedValue={theme} onChange={setTheme} />
            <RadioGroup label="Accent Tone" options={[{ value: "sage", label: "Sage", description: "Calm & natural." }, { value: "slate", label: "Slate", description: "Cool & professional." }, { value: "neutral", label: "Neutral", description: "Minimal & clean." }]} selectedValue={accent} onChange={setAccent} />
            <div style={{ borderTop: "1px solid #eeece9", marginTop: 8, paddingTop: 8 }}>
                <ToggleSwitch label="Reduce Motion" enabled={reduceMotion} onToggle={() => setReduceMotion(!reduceMotion)} />
            </div>
        </SectionContainer>
    );
};

const PreferencesSection = () => {
    const [autoPlay, setAutoPlay] = useState(true);
    const [autoExpand, setAutoExpand] = useState(false);
    const [showPercent, setShowPercent] = useState(true);
    return (
        <SectionContainer title="Preferences" subtitle="Control your learning experience." footer={<><button style={cancelBtnStyle}>Cancel</button><button style={saveBtnStyle}>Save Changes</button></>}>
            <ToggleSwitch label="Auto-play Lessons" enabled={autoPlay} onToggle={() => setAutoPlay(!autoPlay)} />
            <div style={{ borderTop: "1px solid #eeece9" }} />
            <ToggleSwitch label="Auto-expand Chapters" enabled={autoExpand} onToggle={() => setAutoExpand(!autoExpand)} />
            <div style={{ borderTop: "1px solid #eeece9" }} />
            <ToggleSwitch label="Show Completion Percentage" enabled={showPercent} onToggle={() => setShowPercent(!showPercent)} />
        </SectionContainer>
    );
};

const StudySettingsSection = () => {
    const [explanation, setExplanation] = useState("guided");
    const [closure, setClosure] = useState("soft");
    const [clarification, setClarification] = useState("guided-c");
    const [memory, setMemory] = useState("suggested");
    return (
        <SectionContainer title="Study Settings" subtitle="Customize your learning experience." footer={<><button style={cancelBtnStyle}>Cancel</button><button style={saveBtnStyle}>Save Changes</button></>}>
            <RadioGroup label="Explanation Style" options={[{ value: "straight", label: "Straight to the Point", description: "Concise explanations." }, { value: "guided", label: "Guided Understanding", description: "Step-by-step learning (Default)" }, { value: "conceptual", label: "Conceptual Mastery", description: "Deep conceptual links." }]} selectedValue={explanation} onChange={setExplanation} />
            <RadioGroup label="Session Closure" options={[{ value: "open", label: "Open Ended", description: "No structured recap." }, { value: "soft", label: "Soft Closure", description: "Brief reviews and reflection." }, { value: "structured", label: "Structured Closure", description: "Recap and recall." }]} selectedValue={closure} onChange={setClosure} />
            <RadioGroup label="Clarification Style" options={[{ value: "direct", label: "Direct", description: "Short, concise answers." }, { value: "guided-c", label: "Guided", description: "Step-by-step reasoning." }, { value: "exploratory", label: "Exploratory", description: "Extended conceptual links." }]} selectedValue={clarification} onChange={setClarification} />
            <RadioGroup label="Memory Reinforcement" options={[{ value: "manual", label: "Manual", description: "Review only when chosen." }, { value: "suggested", label: "Suggested", description: "Occasional review cues." }, { value: "structured-m", label: "Structured", description: "Active recall surfacing." }]} selectedValue={memory} onChange={setMemory} />
        </SectionContainer>
    );
};

const SecuritySection = () => (
    <SectionContainer title="Security" subtitle="Manage your account security." footer={<><button style={cancelBtnStyle}>Cancel</button><button style={saveBtnStyle}>Save Changes</button></>}>
        <OptionRow label="Connected Accounts" value="Google" onClick={() => {}} />
        <div style={{ borderTop: "1px solid #eeece9" }} />
        <OptionRow label="Change Password" value="" onClick={() => {}} />
        <div style={{ borderTop: "1px solid #eeece9" }} />
        <OptionRow label="Active Sessions" value="This device" onClick={() => {}} />
    </SectionContainer>
);

/* ─────────────── Button Styles ─────────────── */

const cancelBtnStyle = {
    /* ── Generous padding on both buttons ── */
    padding: "12px 28px",
    marginBottom: 16,
    fontSize: 14, fontWeight: 500, color: "#78716c",
    border: "1px solid #e7e5e4", borderRadius: 12, background: "#fff",
    cursor: "pointer", transition: "background 0.15s", letterSpacing: "0.01em",
};

const saveBtnStyle = {
    padding: "12px 28px",
    marginBottom: 16,
    fontSize: 14, fontWeight: 500, color: "#fff",
    border: "none", borderRadius: 12, background: "#8a9a7b",
    cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.14)", transition: "background 0.15s", letterSpacing: "0.01em",
};

const SECTIONS = {
    appearance: AppearanceSection,
    preferences: PreferencesSection,
    study: StudySettingsSection,
    security: SecuritySection,
};

export default function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("study");
    const ActiveContent = SECTIONS[activeSection];

    if (!isOpen) {
        return (
            <>
                <AppBackground />
                <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                    <button onClick={() => setIsOpen(true)} style={{ ...saveBtnStyle, padding: "13px 32px", fontSize: 15 }}>Open Settings</button>
                </div>
            </>
        );
    }

    return (
        <>
            <AppBackground />
            <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)" }} onClick={() => setIsOpen(false)} />

                {/* Modal — slightly taller to give content room */}
                <div className="animate-in" style={{
                    position: "relative", zIndex: 10, width: "100%", maxWidth: 1000, height: 650,
                    backgroundColor: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
                    borderRadius: 20, display: "flex", overflow: "hidden",
                    boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
                }}>
                    <button onClick={() => setIsOpen(false)} style={{ position: "absolute", top: 20, right: 20, zIndex: 20, padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#a8a29e" }}>
                        <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <Sidebar activeSection={activeSection} onSelect={setActiveSection} onBack={() => setIsOpen(false)} />

                    {/* ── Content area: more padding on all sides ── */}
                    <div style={{ flex: 1, padding: "40px 44px 36px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <ActiveContent />
                    </div>
                </div>
            </div>
        </>
    );
}