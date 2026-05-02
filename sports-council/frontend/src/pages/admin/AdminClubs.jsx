import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminClubs() {
  const { data: clubs, mutate } = useSWR("/api/clubs", fetcher);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (club) => {
    setEditingClub(club);
    setFormData(club);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/clubs/${editingClub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        setEditingClub(null);
      }
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const handleDelete = async (clubId) => {
    if (confirm("Are you sure you want to delete this club?")) {
      try {
        await fetch(`/api/admin/clubs/${clubId}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting club:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage Clubs</h1>
          <p className="text-muted mt-2">Add, edit, or remove sports clubs</p>
        </div>
        <button className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
          Add New Club
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Convenor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clubs?.map((club) => (
              <tr key={club.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{club.icon || "🏆"}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{club.name}</div>
                      <div className="text-sm text-muted">{club.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {club.convenorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(club)}
                    className="text-brand-srm hover:text-brand-srm/80 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(club.id)}
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
      {editingClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-syne font-bold mb-4">Edit Club</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                placeholder="Convenor Name"
                value={formData.convenorName || ""}
                onChange={(e) => setFormData({ ...formData, convenorName: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingClub(null)}
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
