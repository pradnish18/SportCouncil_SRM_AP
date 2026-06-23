import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";
import AdminModal from "../../components/AdminModal";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminCouncil() {
  const { data: council, mutate } = useSWR("/api/council", fetcher);
  const [editingMember, setEditingMember] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ tier: "STUDENT_BODY", order: 0 });
  const [originalData, setOriginalData] = useState({});
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const isModalOpen = editingMember || isCreating;

  const handleCloseModal = () => {
    if (hasChanges) {
      setConfirmUnsaved(true);
      return;
    }
    closeForm();
  };

  const closeForm = () => {
    setEditingMember(null);
    setIsCreating(false);
    setFormData({ tier: "STUDENT_BODY", order: 0 });
    setOriginalData({});
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData(member);
    setOriginalData(member);
    setIsCreating(false);
  };

  const handleAdd = () => {
    setEditingMember(null);
    const emptyFormData = { name: "", title: "", tier: "STUDENT_BODY", photoUrl: "", order: 0 };
    setFormData(emptyFormData);
    setOriginalData(emptyFormData);
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const method = editingMember ? "PUT" : "POST";
      const url = editingMember ? `/api/admin/council/${editingMember.id}` : "/api/admin/council";
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
      console.error("Error saving council member:", error);
    }
  };

  const handleDelete = (memberId) => {
    setConfirmDelete(memberId);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await fetch(`/api/admin/council/${confirmDelete}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      console.error("Error deleting council member:", error);
    }
    setConfirmDelete(null);
  };

  const allMembers = [
    ...(council?.DIRECTOR || []),
    ...(council?.ASSISTANT_DIRECTOR || []),
    ...(council?.CONVENOR || []),
    ...(council?.COACH || []),
    ...(council?.STUDENT_BODY || []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage Council</h1>
          <p className="text-muted mt-2">Manage council members and leadership</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
          Add New Member
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allMembers?.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {member.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {member.tier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-brand-srm hover:text-brand-srm/80 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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

      {/* Edit / Add Modal */}
      <AdminModal
        open={!!isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? "Edit Council Member" : "Add Council Member"}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Member Info</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={formData.photoUrl || ""}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <select
              value={formData.tier || "STUDENT_BODY"}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            >
              <option value="DIRECTOR">Director</option>
              <option value="ASSISTANT_DIRECTOR">Assistant Director</option>
              <option value="CONVENOR">Convenor</option>
              <option value="COACH">Coach</option>
              <option value="STUDENT_BODY">Student Body</option>
            </select>
            <input
              type="number"
              placeholder="Order"
              value={formData.order ?? 0}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
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
        title="Delete Member?"
        message="Are you sure you want to delete this council member? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
