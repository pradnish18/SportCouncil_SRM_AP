import AchievementsGallery from "@/features/achievements/AchievementsGallery";

export default function AchievementsPage() {
    return (
        <main className="min-h-screen pt-32 pb-32 px-6 max-w-7xl mx-auto">
            <header className="mb-24 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="w-12 h-1 bg-brand-srm" />
                    <span className="text-brand-srm font-black text-[10px] tracking-[0.3em] uppercase">
                        Wall of Fame
                    </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-syne font-black text-foreground leading-tight">
                    Our <span className="text-brand-srm">Achievements</span>
                </h1>
                <p className="mt-8 text-muted font-outfit text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
                    A testament to the grit, sweat, and determination of our student-athletes. SRM University AP celebrates every milestone on our journey to greatness.
                </p>
            </header>

            <AchievementsGallery />
        </main>
    );
}
