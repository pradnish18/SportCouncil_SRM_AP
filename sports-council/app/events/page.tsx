import EventsList from "@/components/EventsList";

export default function EventsPage() {
    return (
        <main className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto">
            <header className="mb-16">
                <span className="text-brand-amber font-semibold text-[10px] tracking-[0.2em] uppercase mb-4 block text-center lg:text-left">
                    Timeline
                </span>
                <h1 className="text-5xl md:text-7xl font-syne font-extrabold text-center lg:text-left">
                    Sports Events
                </h1>
                <p className="mt-6 text-muted font-outfit text-lg max-w-2xl opacity-70 text-center lg:text-left">
                    Stay updated with ongoing matches, plan for future competitions, and relive the glory of past victories.
                </p>
            </header>

            <EventsList />
        </main>
    );
}
