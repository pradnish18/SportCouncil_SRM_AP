import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminEvents() {
  const { data: events, mutate } = useSWR("/api/events", fetcher);
  const [editingEvent, setEditingEvent] = useState(null);
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
    setEditingEvent(null);
    setIsCreating(false);
    setFormData({});
    setOriginalData({});
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setOriginalData(event);
    setIsCreating(false);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    const emptyFormData = { title: "", sport: "", date: "", time: "", venue: "" };
    setFormData(emptyFormData);
    setOriginalData(emptyFormData);
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        setEditingEvent(null);
        setIsCreating(false);
        setFormData({});
        setOriginalData({});
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage Events</h1>
          <p className="text-muted mt-2">Schedule and manage sports events</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
          Add New Event
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events?.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">{event.title}</div>
                    <div className="text-sm text-muted">{event.sport}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Date(event.date).toLocaleDateString()} {event.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {event.venue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-brand-srm hover:text-brand-srm/80 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
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
      {(editingEvent || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-muted hover:text-foreground text-2xl leading-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-syne font-bold mb-4">
              {isCreating ? "Create Event" : "Edit Event"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <input
                type="text"
                placeholder="Sport"
                value={formData.sport || ""}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <input
                type="datetime-local"
                value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <input
                type="text"
                placeholder="Venue"
                value={formData.venue || ""}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
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
