import bgImage from "../assets/test-light-bg.png";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate()
    return (
        <>

            {/* Background */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center px-6 pt-16 pb-24">

                <div className="w-full max-w-[1100px] space-y-24">

                    {/* Sections will go here */}

                    {/* Hero */}
                    <div className="text-center space-y-10 pt-10">

                        {/* Glow layer */}
                        <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#e7d9c8]/40 blur-[120px] rounded-full -z-10" />

                        <h1 className="text-5xl md:text-6xl font-serif text-stone-800 tracking-wide leading-tight">
                            Study without losing the thread.
                        </h1>

                        {/* Loop */}
                        <div className="flex justify-center items-center gap-6 opacity-80">

                            {["Craft", "Learn", "Ask", "Refine", "Echo"].map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-sm text-stone-600">
                                    <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-[#d6d3d1]/50 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-300">
                                        {step[0]}
                                    </div>
                                    <span className="mt-2">{step}</span>
                                </div>
                            ))}

                        </div>

                        <p className="text-stone-600 text-lg max-w-xl mx-auto leading-relaxed">
                            CLARE is a continuous study space — where understanding is allowed to take its time.
                        </p>

                        <button className="cursor-pointer px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#c2a47e] to-[#b5936d] text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.2)] transition-all duration-500" onClick={()=>navigate('/login')}>
                            Begin your study →
                        </button>
                    </div>

                    <div className="w-full flex justify-center">
                        <div className="h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[#d6d3d1]/60 to-transparent" />
                    </div>

                    {/* Contrast */}
                    <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center
  bg-white/30 backdrop-blur-md border border-[#d6d3d1]/40
  rounded-2xl px-8 md:px-12 py-10 md:py-12
  shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

                        {/* Subtle divider */}
                        <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-[1px] bg-[#d6d3d1]/40" />

                        {/* Inner glow */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none
    shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />

                        {/* Today */}
                        <div className="text-center opacity-80 max-w-[280px] mx-auto">
                            <h3 className="text-xl font-serif mb-6 text-stone-600 tracking-[0.08em]">
                                Before Clare
                            </h3>

                            <ul className="space-y-3 text-stone-600 leading-relaxed tracking-[0.02em]">
                                {[
                                    "Scattered plans",
                                    "Learning in tabs",
                                    "Doubts lost in chats",
                                    "Isolated tests",
                                    "Restarted revision"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#a8a29e]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* With CLARE */}
                        <div className="text-center max-w-[280px] mx-auto">
                            <h3 className="text-xl font-serif mb-6 text-stone-900 tracking-[0.08em]">
                                With CLARE
                            </h3>

                            <ul className="space-y-3 text-stone-700 leading-relaxed tracking-[0.02em]">
                                {[
                                    "One connected path",
                                    "Lessons in one place",
                                    "Questions in context",
                                    "Practice that fits",
                                    "Revision with recall"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8a9a7b]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className="w-full flex justify-center">
                        <div className="h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[#d6d3d1]/60 to-transparent" />
                    </div>

                    {/* Philosophy */}
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">

                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 leading-[1.3] tracking-[0.02em]">
                            Learning gives information. <br />
                            Studying builds memory.
                        </h2>

                        <p className="mt-4 text-stone-600 text-[15px] leading-relaxed tracking-[0.02em]">
                            CLARE remembers where you left off, so you can continue — not restart.
                        </p>

                    </div>
                    <div className="mt-8 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#d6d3d1] to-transparent" />

                    {/* Features */}
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            "Persistent learning paths",
                            "Lessons that speak & stay",
                            "Questions with memory",
                            "Recall that feels natural"
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group
  rounded-xl px-5 py-4 text-center
  bg-white/25 backdrop-blur-sm border border-[#d6d3d1]/40

  shadow-[0_6px_20px_rgba(0,0,0,0.04)]
  transition-all duration-300

  hover:bg-white/35 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                            >
                                <p className="text-sm text-stone-700 tracking-[0.03em] leading-snug">
                                    {item}
                                </p>
                            </div>
                        ))}

                    </div>

                    <div className="w-full flex justify-center">
                        <div className="h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[#d6d3d1]/60 to-transparent" />
                    </div>

                    {/* Story */}
                    <div className="text-center space-y-10">

                        <h2 className="text-3xl font-serif text-stone-800">
                            Remember when the professor explained this?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">

                            {[
                                { step: "01", text: "Upload once." },
                                { step: "02", text: "Ask later." },
                                { step: "03", text: "Recall when it matters." }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl p-6 bg-white/40 border border-[#d6d3d1]/40 backdrop-blur-md text-stone-600 text-left"
                                >
                                    <div className="text-xs text-[#a8a29e] mb-2 tracking-widest">
                                        {item.step}
                                    </div>
                                    <div className="text-base">{item.text}</div>
                                </div>
                            ))}

                        </div>
                    </div>



                </div>
            </div>
        </>
    );
};

export default Home;