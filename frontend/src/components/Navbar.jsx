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