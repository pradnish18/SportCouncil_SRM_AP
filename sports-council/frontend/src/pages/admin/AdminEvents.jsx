import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";
import AdminModal from "../../components/AdminModal";
import ConfirmModal from "../../components/ConfirmModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function CalendarPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const date = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(date.getMonth());
  const [viewYear, setViewYear] = useState(date.getFullYear());

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDay = new Date(viewYear, viewMonth, 1).getDay();
  const today = new Date();

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const pick = (day) => {
    const picked = new Date(viewYear, viewMonth, day);
    const currentTime = value ? new Date(value) : new Date();
    picked.setHours(currentTime.getHours(), currentTime.getMinutes());
    onChange(picked.toISOString());
    setOpen(false);
  };

  const displayVal = value
    ? new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-left text-foreground hover:border-brand-srm focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
      >
        {displayVal || <span className="text-muted/50">Select date</span>}
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 rounded-2xl border border-border bg-background p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="p-1 rounded-lg hover:bg-foreground/5 text-foreground"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold font-syne text-foreground">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={next} className="p-1 rounded-lg hover:bg-foreground/5 text-foreground"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] font-black uppercase tracking-wider text-muted py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === viewMonth && new Date(value).getFullYear() === viewYear;
              const isToday = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
              return (
                <button
                  key={day}
                  onClick={() => pick(day)}
                  className={`w-full aspect-square rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-brand-srm text-white"
                      : isToday
                        ? "border border-brand-srm/40 text-foreground hover:bg-foreground/5"
                        : "text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEvents() {
  const { data: events, mutate } = useSWR("/api/events", fetcher);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const isModalOpen = editingEvent || isCreating;

  const handleCloseModal = () => {
    if (hasChanges) {
      setConfirmUnsaved(true);
      return;
    }
    closeForm();
  };

  const closeForm = () => {
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
    const emptyFormData = { title: "", sport: "", date: "", time: "", venue: "", registrationLink: "" };
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
        closeForm();
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = (eventId) => {
    setConfirmDelete(eventId);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await fetch(`/api/admin/events/${confirmDelete}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    setConfirmDelete(null);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Registration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {event.registrationLink ? (
                    <span className="text-brand-srm font-medium">Linked</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
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
      <AdminModal
        open={!!isModalOpen}
        onClose={handleCloseModal}
        title={isCreating ? "Create Event" : "Edit Event"}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Event Details</label>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
            <input
              type="text"
              placeholder="Sport"
              value={formData.sport || ""}
              onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Date & Time</label>
            <div className="grid grid-cols-2 gap-3">
              <CalendarPicker
                value={formData.date || ""}
                onChange={(iso) => setFormData({ ...formData, date: iso })}
              />
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Location</label>
            <input
              type="text"
              placeholder="Venue"
              value={formData.venue || ""}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Registration Link (optional)</label>
            <input
              type="url"
              placeholder="https://forms.google.com/..."
              value={formData.registrationLink || ""}
              onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
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
        title="Delete Event?"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
