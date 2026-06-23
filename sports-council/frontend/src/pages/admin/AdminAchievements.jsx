import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";
import AdminModal from "../../components/AdminModal";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminAchievements() {
  const { data: achievements, mutate } = useSWR("/api/achievements", fetcher);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const isModalOpen = editingAchievement || isCreating;

  const handleCloseModal = () => {
    if (hasChanges) {
      setConfirmUnsaved(true);
      return;
    }
    closeForm();
  };

  const closeForm = () => {
    setEditingAchievement(null);
    setIsCreating(false);
    setFormData({});
    setOriginalData({});
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData(achievement);
    setOriginalData(achievement);
    setIsCreating(false);
  };

  const handleAdd = () => {
    setEditingAchievement(null);
    const emptyFormData = { title: "", description: "", sport: "", category: "", year: new Date().getFullYear() };
    setFormData(emptyFormData);
    setOriginalData(emptyFormData);
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = editingAchievement ? `/api/admin/achievements/${editingAchievement.id}` : "/api/admin/achievements";
      const method = editingAchievement ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        closeForm();
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
    }
  };

  const handleDelete = (achievementId) => {
    setConfirmDelete(achievementId);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await fetch(`/api/admin/achievements/${confirmDelete}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage Achievements</h1>
          <p className="text-muted mt-2">Track and showcase sports achievements</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
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

      {/* Edit/Create Modal */}
      <AdminModal
        open={!!isModalOpen}
        onClose={handleCloseModal}
        title={isCreating ? "Create Achievement" : "Edit Achievement"}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Achievement Info</label>
            <input
              type="text"
              placeholder="Title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Sport"
              value={formData.sport || ""}
              onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <select
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            >
              <option value="TROPHY">Trophy</option>
              <option value="ACCOLADE">Accolade</option>
              <option value="RECORD">Record</option>
            </select>
          </div>
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
        title="Delete Achievement?"
        message="Are you sure you want to delete this achievement? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
