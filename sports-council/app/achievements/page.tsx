import AchievementsGallery from "@/components/AchievementsGallery";

export default function AchievementsPage() {
    return (
        <main className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
            <header className="mb-16">
                <span className="text-brand-purple font-semibold text-[10px] tracking-[0.2em] uppercase mb-4 block text-center lg:text-left">
                    Wall of Fame
                </span>
                <h1 className="text-5xl md:text-7xl font-syne font-extrabold text-center lg:text-left">
                    Achievements
                </h1>
                <p className="mt-6 text-muted font-outfit text-lg max-w-2xl opacity-70 text-center lg:text-left">
                    A testament to the grit, sweat, and determination of our student-athletes. SRM University AP celebrates every milestone on our journey to greatness.
                </p>
            </header>

            <AchievementsGallery />
        </main>
    );
}
