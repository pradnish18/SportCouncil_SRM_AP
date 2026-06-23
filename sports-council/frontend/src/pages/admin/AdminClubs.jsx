import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";
import AdminModal from "../../components/AdminModal";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminClubs() {
  const { data: clubs, mutate } = useSWR("/api/clubs", fetcher);
  const [editingClub, setEditingClub] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const isModalOpen = editingClub || isCreating;

  const handleCloseModal = () => {
    if (hasChanges) {
      setConfirmUnsaved(true);
      return;
    }
    closeForm();
  };

  const closeForm = () => {
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
      achievements: (() => {
        if (Array.isArray(club.achievements)) return club.achievements;
        try {
          const parsed = JSON.parse(club.achievementsList || "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
      })(),
      gallery: Array.isArray(club.gallery) ? club.gallery : [],
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
      logoUrl: "",
      bgImageUrl: "",
      convenor: { name: "", role: "Convenor", details: "" },
      coConvenor: { name: "", role: "Co-Convenor", details: "" },
      coach: { name: "", role: "Coach", details: "", photoUrl: "" },
      achievements: [],
      gallery: [],
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
        closeForm();
      }
    } catch (error) {
      console.error("Error saving club:", error);
    }
  };

  const handleDelete = async (clubId) => {
    setConfirmDelete(clubId);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await fetch(`/api/admin/clubs/${confirmDelete}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      console.error("Error deleting club:", error);
    }
    setConfirmDelete(null);
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
      <AdminModal
        open={!!isModalOpen}
        onClose={handleCloseModal}
        title={isCreating ? "Create Club" : "Edit Club"}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Club Info</label>
            <input
              type="text"
              placeholder="Club Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              rows={3}
            />
            <input
              type="text"
              placeholder="Logo Image URL (emoji or icon URL)"
              value={formData.logoUrl || ""}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <input
              type="text"
              placeholder="Background Image URL"
              value={formData.bgImageUrl || ""}
              onChange={(e) => setFormData({ ...formData, bgImageUrl: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Convenor</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.convenor?.name || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  convenor: { ...formData.convenor, name: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.convenor?.role || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  convenor: { ...formData.convenor, role: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Co-Convenor</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.coConvenor?.name || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coConvenor: { ...formData.coConvenor, name: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.coConvenor?.role || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coConvenor: { ...formData.coConvenor, role: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Coach</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.coach?.name || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coach: { ...formData.coach, name: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.coach?.role || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coach: { ...formData.coach, role: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Coach Details</label>
              <input
                type="text"
                placeholder="Photo URL"
                value={formData.coach?.photoUrl || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coach: { ...formData.coach, photoUrl: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
              <input
                type="text"
                placeholder="Details"
                value={formData.coach?.details || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  coach: { ...formData.coach, details: e.target.value },
                })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
            </div>
          </div>
        </div>

          {/* Key Achievements */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Key Achievements</label>
            {(formData.achievements || []).map((ach, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. South Zone Inter-University Gold 2024"
                  value={ach}
                  onChange={(e) => {
                    const updated = [...(formData.achievements || [])];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, achievements: updated });
                  }}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (formData.achievements || []).filter((_, i) => i !== idx);
                    setFormData({ ...formData, achievements: updated });
                  }}
                  className="px-3 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-sm flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, achievements: [...(formData.achievements || []), ""] })}
              className="text-sm text-brand-srm hover:text-brand-srm/80 transition-colors font-medium"
            >
              + Add Achievement
            </button>
          </div>

          {/* Gallery & Media */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Gallery & Media</label>
            {(formData.gallery || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.url || ""}
                    onChange={(e) => {
                      const updated = [...(formData.gallery || [])];
                      updated[idx] = { ...updated[idx], url: e.target.value };
                      setFormData({ ...formData, gallery: updated });
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                  />
                  <select
                    value={item.type || "image"}
                    onChange={(e) => {
                      const updated = [...(formData.gallery || [])];
                      updated[idx] = { ...updated[idx], type: e.target.value };
                      setFormData({ ...formData, gallery: updated });
                    }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = (formData.gallery || []).filter((_, i) => i !== idx);
                    setFormData({ ...formData, gallery: updated });
                  }}
                  className="px-3 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors text-sm flex-shrink-0 mt-2"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gallery: [...(formData.gallery || []), { url: "", type: "image" }] })}
              className="text-sm text-brand-srm hover:text-brand-srm/80 transition-colors font-medium"
            >
              + Add Media Item
            </button>
          </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
          <button
            onClick={handleCloseModal}
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-brand-srm px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-srm/90 transition-colors"
          >
            Save
          </button>
        </div>
      </AdminModal>

      {/* Confirm Discard Modal */}
      <ConfirmModal
        open={confirmUnsaved}
        onConfirm={() => { closeForm(); setConfirmUnsaved(false); }}
        onCancel={() => setConfirmUnsaved(false)}
        title="Discard Changes?"
        message="You have unsaved changes. Do you want to discard them?"
        confirmLabel="Discard"
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete(null)}
        title="Delete Club?"
        message="Are you sure you want to delete this club? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
