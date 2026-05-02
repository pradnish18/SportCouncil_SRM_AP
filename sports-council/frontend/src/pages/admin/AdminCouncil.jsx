import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminCouncil() {
  const { data: council, mutate } = useSWR("/api/council", fetcher);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData(member);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/council/${editingMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        setEditingMember(null);
      }
    } catch (error) {
      console.error("Error updating council member:", error);
    }
  };

  const handleDelete = async (memberId) => {
    if (confirm("Are you sure you want to delete this council member?")) {
      try {
        await fetch(`/api/admin/council/${memberId}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting council member:", error);
      }
    }
  };

  const allMembers = [
    ...(council?.DIRECTOR || []),
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
        <button className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
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

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-syne font-bold mb-4">Edit Council Member</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <select
                value={formData.tier || ""}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full p-2 border border-border rounded"
              >
                <option value="DIRECTOR">Director</option>
                <option value="CONVENOR">Convenor</option>
                <option value="COACH">Coach</option>
                <option value="STUDENT_BODY">Student Body</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingMember(null)}
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
