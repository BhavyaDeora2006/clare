import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onAvatarClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = ["Craft", "Learn", "Ask", "Refine", "Echo"];

    return (
        <>
            {/* Background (non-interactive layer) */}
            <div className="fixed inset-0 bg-[url('./assets/clare-light-bg.png')] pointer-events-none z-0" />

            {/* Navbar (interactive layer) */}
            <nav className="relative z-10 flex items-center justify-between py-3 px-10 border-b border-[#e7e5e4]">

                <div
                    onClick={() => navigate('/dashboard')}
                    className="text-[22px] font-light tracking-[0.25em] text-[#78716c] cursor-pointer"
                >
                    CLARE
                </div>

                <div className="flex items-center gap-8">
                    {tabs.map((tab) => {
                        const path = `/${tab.toLowerCase()}`;
                        const isActive = location.pathname === path;

                        return (
                            <button
                                key={tab}
                                onClick={() => navigate(path)}
                                className={`text-[16px] cursor-pointer font-medium bg-transparent border-none pb-1 border-b-2 ${isActive
                                    ? "text-[#1c1917] border-[#57534e]"
                                    : "text-[#a8a29e] border-transparent"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div
                    onClick={onAvatarClick ? onAvatarClick : undefined}
                    className={`w-9 h-9 rounded-full overflow-hidden ${onAvatarClick ? "cursor-pointer hover:scale-105" : "opacity-80"} transition-transform duration-200`}
                >
                    <img
                        src="https://imgs.search.brave.com/bT1Vn8WOO2oMVeeB7eIgRzqPtD7_U0zLN9bt0gIS5R4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDEv/NTAzLzc1Ni9zbWFs/bC9ib3ktZmFjZS1h/dmF0YXItY2FydG9v/bi1mcmVlLXZlY3Rv/ci5qcGc"
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

            </nav>
        </>
    );
}
export default Navbar;