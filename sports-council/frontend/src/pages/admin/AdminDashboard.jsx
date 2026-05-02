import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminDashboard() {
  const { data: stats } = useSWR("/api/stats", fetcher);
  const { data: clubs } = useSWR("/api/clubs", fetcher);
  const { data: events } = useSWR("/api/events", fetcher);
  const { data: achievements } = useSWR("/api/achievements", fetcher);

  const dashboardStats = [
    {
      title: "Total Clubs",
      value: clubs?.length || 0,
      icon: "🏆",
      color: "text-blue-600",
    },
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: "📅",
      color: "text-green-600",
    },
    {
      title: "Achievements",
      value: achievements?.length || 0,
      icon: "🏅",
      color: "text-yellow-600",
    },
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: "👥",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-syne font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-2">Welcome to the SRM Sports Council admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.title} className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`text-4xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-syne font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
            Add New Club
          </button>
          <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors">
            Schedule Event
          </button>
          <button className="p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-600/90 transition-colors">
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
}
