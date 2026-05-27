import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminClubs() {
  const { data: clubs, mutate } = useSWR("/api/clubs", fetcher);
  const [editingClub, setEditingClub] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleCloseModal = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      );
      if (!confirmClose) return;
    }
    setEditingClub(null);
    setIsCreating(false);
    setFormData({});
    setOriginalData({});
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    const clubData = {
      ...club,
      convenor: {
        name: club.convenorName || "",
        role: club.convenorRole || "Convenor",
        details: club.convenorDetails || "",
      },
      coConvenor: {
        name: club.coConvenorName || "",
        role: club.coConvenorRole || "Co-Convenor",
        details: club.coConvenorDetails || "",
      },
      coach: {
        name: club.coachName || "",
        role: club.coachRole || "Coach",
        details: club.coachDetails || "",
        photoUrl: club.coachPhotoUrl || "",
      },
    };
    setFormData(clubData);
    setOriginalData(clubData);
    setIsCreating(false);
  };

  const handleAdd = () => {
    setEditingClub(null);
    const emptyFormData = {
      name: "",
      description: "",
      bgImageUrl: "",
      convenor: { name: "", role: "Convenor", details: "" },
      coConvenor: { name: "", role: "Co-Convenor", details: "" },
      coach: { name: "", role: "Coach", details: "", photoUrl: "" },
      order: 0,
    };
    setFormData(emptyFormData);
    setOriginalData(emptyFormData);
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = editingClub ? `/api/admin/clubs/${editingClub.id}` : "/api/admin/clubs";
      const method = editingClub ? "PUT" : "POST";
      const payload = {
        ...formData,
        convenor: formData.convenor,
        coConvenor: formData.coConvenor,
        coach: formData.coach,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        mutate();
        setEditingClub(null);
        setIsCreating(false);
        setFormData({});
        setOriginalData({});
      }
    } catch (error) {
      console.error("Error saving club:", error);
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
        <button onClick={handleAdd} className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
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
                Coach
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {club.coachName || "TBD"}
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

      {/* Edit/Create Modal */}
      {(editingClub || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-muted hover:text-foreground text-2xl leading-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-syne font-bold mb-4">
              {isCreating ? "Create Club" : "Edit Club"}
            </h2>
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
                placeholder="Club Background Image URL"
                value={formData.bgImageUrl || ""}
                onChange={(e) => setFormData({ ...formData, bgImageUrl: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Convenor Name"
                    value={formData.convenor?.name || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      convenor: { ...formData.convenor, name: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Convenor Role"
                    value={formData.convenor?.role || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      convenor: { ...formData.convenor, role: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded mt-2"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Co-Convenor Name"
                    value={formData.coConvenor?.name || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coConvenor: { ...formData.coConvenor, name: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Co-Convenor Role"
                    value={formData.coConvenor?.role || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coConvenor: { ...formData.coConvenor, role: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded mt-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Coach Name"
                    value={formData.coach?.name || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coach: { ...formData.coach, name: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Coach Role"
                    value={formData.coach?.role || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coach: { ...formData.coach, role: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded mt-2"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Coach Photo URL"
                    value={formData.coach?.photoUrl || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coach: { ...formData.coach, photoUrl: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Coach Details"
                    value={formData.coach?.details || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      coach: { ...formData.coach, details: e.target.value },
                    })}
                    className="w-full p-2 border border-border rounded mt-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseModal}
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
