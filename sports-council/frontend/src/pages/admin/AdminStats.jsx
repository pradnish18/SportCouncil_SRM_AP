import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminStats() {
  const { data: stats, mutate } = useSWR("/api/stats", fetcher);
  const [formData, setFormData] = useState(stats || { totalTeams: 0, totalMembers: 0 });

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-syne font-bold text-foreground">Manage Statistics</h1>
        <p className="text-muted mt-2">Update global sports council statistics</p>
      </div>

      <div className="max-w-md bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-syne font-bold mb-6">Global Stats</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Total Teams
            </label>
            <input
              type="number"
              value={formData.totalTeams || 0}
              onChange={(e) => setFormData({ ...formData, totalTeams: parseInt(e.target.value) })}
              className="w-full p-2 border border-border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Total Members
            </label>
            <input
              type="number"
              value={formData.totalMembers || 0}
              onChange={(e) => setFormData({ ...formData, totalMembers: parseInt(e.target.value) })}
              className="w-full p-2 border border-border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 px-4 py-2 bg-brand-srm text-white rounded hover:bg-brand-srm/90 transition-colors"
        >
          Update Stats
        </button>
      </div>
    </div>
  );
}
