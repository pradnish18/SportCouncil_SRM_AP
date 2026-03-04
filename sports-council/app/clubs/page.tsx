import ClubsGrid from "@/components/ClubsGrid";

export default function ClubsPage() {
    return (
        <main className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
            <header className="mb-16">
                <span className="text-brand-green font-semibold text-[10px] tracking-[0.2em] uppercase mb-4 block text-center lg:text-left">
                    Sports Directory
                </span>
                <h1 className="text-5xl md:text-7xl font-syne font-extrabold text-center lg:text-left">
                    Our Clubs
                </h1>
                <p className="mt-6 text-muted font-outfit text-lg max-w-2xl opacity-70 text-center lg:text-left">
                    Discover a diverse range of sporting disciplines, meet the leadership, and join our elite teams.
                </p>
            </header>

            <ClubsGrid />
        </main>
    );
}
