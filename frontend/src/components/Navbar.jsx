import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onAvatarClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = ["Craft", "Learn", "Ask", "Refine", "Echo"];

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
                onClick={() => navigate("/dashboard")}
                className="
          text-[22px] font-light tracking-[0.25em]
          text-[#78716c]
          cursor-pointer
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

            {/* Avatar */}
            <div
                onClick={onAvatarClick || undefined}
                className={`
          w-9 h-9 rounded-full overflow-hidden
          ${onAvatarClick ? "cursor-pointer" : "opacity-80"}
        `}
            >
                <img
                    src="https://assets.leetcode.com/users/Bhavya_Deora/avatar_1772714696.png"
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                />
            </div>
        </nav>
    );
};

export default Navbar;