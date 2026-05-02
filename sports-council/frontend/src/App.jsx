import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import NewsCarousel from "./components/NewsCarousel";
import Hierarchy from "./components/Hierarchy";
import AboutCouncil from "./components/AboutCouncil";
import ClubsGrid from "./components/ClubsGrid";
import EventsList from "./components/EventsList";
import AchievementsGallery from "./components/AchievementsGallery";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { ThemeProvider } from "./components/ThemeProvider";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminCouncil from "./pages/admin/AdminCouncil";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNews from "./pages/admin/AdminNews";
import AdminStats from "./pages/admin/AdminStats";

function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <NewsCarousel />
      <AboutCouncil />
      <Hierarchy />
      <SiteFooter />
    </main>
  );
}

function PageShell({ title, children }) {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground pt-28 px-6 pb-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 font-syne text-4xl font-black uppercase tracking-wide text-foreground md:text-6xl">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/30 px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-srm text-xl font-black text-white">
            S
          </div>
          <span className="font-syne text-2xl font-black uppercase tracking-widest text-foreground">
            SRM Sports <span className="text-brand-srm">Council</span>
          </span>
        </div>
        <p className="mb-10 max-w-md text-center font-outfit text-sm text-muted">
          Empowering student athletes at SRM University AP through excellence, discipline, and sportsmanship.
        </p>
        <div className="mb-10 h-px w-full bg-border" />
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
            &copy; 2026 SRM Sports Council. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Instagram", "Twitter", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted transition-colors hover:text-brand-srm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <ScrollProgressBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/clubs"
            element={
              <PageShell title="Clubs">
                <ClubsGrid />
              </PageShell>
            }
          />
          <Route
            path="/events"
            element={
              <PageShell title="Events">
                <EventsList />
              </PageShell>
            }
          />
          <Route
            path="/achievements"
            element={
              <PageShell title="Achievements">
                <AchievementsGallery />
              </PageShell>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clubs" element={<AdminClubs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="council" element={<AdminCouncil />} />
            <Route path="stats" element={<AdminStats />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
