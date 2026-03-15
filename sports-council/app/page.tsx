import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import Hierarchy from "@/components/Hierarchy";
import AboutCouncil from "@/components/AboutCouncil";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-16">
            <Hero />
            <NewsCarousel />
            <AboutCouncil />
            <Hierarchy />

            {/* ————— FOOTER ————— */}
            <footer className="mt-auto py-20 px-6 border-t border-border bg-card/30">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-brand-srm flex items-center justify-center text-white text-xl font-black">S</div>
                        <span className="text-2xl font-syne font-black text-foreground uppercase tracking-widest">SRM Sports <span className="text-brand-srm">Council</span></span>
                    </div>
                    <p className="text-muted font-outfit text-sm mb-10 max-w-md text-center">
                        Empowering student athletes at SRM University AP through excellence, discipline, and sportsmanship.
                    </p>
                    <div className="w-full h-px bg-border mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2026 SRM Sports Council. All rights reserved.</p>
                        <div className="flex gap-8">
                            {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                                <a key={social} href="#" className="text-muted hover:text-brand-srm text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
