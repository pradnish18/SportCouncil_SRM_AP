import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminAchievements() {
  const { data: achievements, mutate } = useSWR("/api/achievements", fetcher);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData(achievement);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/achievements/${editingAchievement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        setEditingAchievement(null);
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  const handleDelete = async (achievementId) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await fetch(`/api/admin/achievements/${achievementId}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting achievement:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage Achievements</h1>
          <p className="text-muted mt-2">Track and showcase sports achievements</p>
        </div>
        <button className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
          Add New Achievement
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Achievement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Sport
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {achievements?.map((achievement) => (
              <tr key={achievement.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">{achievement.title}</div>
                    <div className="text-sm text-muted">{achievement.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {achievement.sport}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {achievement.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="text-brand-srm hover:text-brand-srm/80 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-syne font-bold mb-4">Edit Achievement</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <textarea
                placeholder="Description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-border rounded"
                rows={3}
              />
              <input
                type="text"
                placeholder="Sport"
                value={formData.sport || ""}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <select
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-border rounded"
              >
                <option value="TROPHY">Trophy</option>
                <option value="ACCOLADE">Accolade</option>
                <option value="RECORD">Record</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingAchievement(null)}
                className="px-4 py-2 text-muted hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand-srm text-white rounded hover:bg-brand-srm/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
