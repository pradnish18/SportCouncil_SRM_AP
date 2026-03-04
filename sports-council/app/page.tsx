import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import Hierarchy from "@/components/Hierarchy";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Hero />
            <NewsCarousel />
            <Hierarchy />

            {/* Footer / Contact Placeholder */}
            <footer className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 text-center">
                <p className="text-muted text-sm">&copy; 2026 SRM Sports Council. All rights reserved.</p>
            </footer>
        </main>
    );
}
