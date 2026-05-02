import { useNavigate, useLocation } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";
const Navbar = ({ onAvatarClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarPreview } = usePreferences();

    const tabs = ["Dashboard", "Craft", "Learn", "Ask", "Refine", "Echo"];

    return (
        <nav
            className="
    sticky top-0 z-20
    flex items-center justify-between
    px-10 py-3

    bg-[#faf9f6]/15
    backdrop-blur-sm

    border-b border-[#e7e5e4]/40
    shadow-[0_1px_6px_rgba(0,0,0,0.03)]
  ">
            {/* Logo */}
            <div
                className="
          text-[22px] font-light tracking-[0.25em]
          text-[#78716c]
        "
            >
                CLARE
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-10">
                {tabs.map((tab) => {
                    const path = `/${tab.toLowerCase()}`;
                    const isActive = location.pathname === path;

                    return (
                        <button
                            key={tab}
                            onClick={() => navigate(path)}
                            className={`
                text-[15px] font-medium pb-[2px]
                border-b-2 cursor-pointer

                ${isActive
                                    ? "text-[#1c1917] border-[#57534e]"
                                    : "text-[#a8a29e] border-transparent"
                                }
              `}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Settings + Avatar */}
            <div className="flex items-center gap-3">
                {/* Settings gear */}
                <button
                    onClick={() => navigate("/settings")}
                    className="p-1.5 rounded-lg border-none bg-transparent cursor-pointer text-[#a8a29e] hover:text-[#78716c] hover:bg-[#f5f5f0] transition-colors"
                    title="Settings"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>

                {/* Avatar */}
                <div
                    onClick={onAvatarClick || (() => navigate("/settings"))}
                    className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
                >
                    <img
                        src={avatarPreview || "/default-avatar.png"}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;