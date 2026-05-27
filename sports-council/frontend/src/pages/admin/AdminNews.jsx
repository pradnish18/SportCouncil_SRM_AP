import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

export default function AdminNews() {
  const { data: news, mutate } = useSWR("/api/news", fetcher);
  const [editingNews, setEditingNews] = useState(null);
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
    setEditingNews(null);
    setIsCreating(false);
    setFormData({});
    setOriginalData({});
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData(newsItem);
    setOriginalData(newsItem);
    setIsCreating(false);
  };

  const handleAdd = () => {
    setEditingNews(null);
    const emptyFormData = { headline: "", description: "", imageUrl: "", order: 0 };
    setFormData(emptyFormData);
    setOriginalData(emptyFormData);
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const url = editingNews ? `/api/admin/news/${editingNews.id}` : "/api/admin/news";
      const method = editingNews ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        mutate();
        setEditingNews(null);
        setIsCreating(false);
        setFormData({});
        setOriginalData({});
      }
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async (newsId) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      try {
        await fetch(`/api/admin/news/${newsId}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-syne font-bold text-foreground">Manage News</h1>
          <p className="text-muted mt-2">Update and manage news headlines</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors">
          Add New News
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Headline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {news?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{item.headline}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-brand-srm hover:text-brand-srm/80 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
      {(editingNews || isCreating) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-muted hover:text-foreground text-2xl leading-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-syne font-bold mb-4">
              {isCreating ? "Create News" : "Edit News"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Headline"
                value={formData.headline || ""}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
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
                placeholder="Image URL"
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border border-border rounded"
              />
              <input
                type="number"
                placeholder="Order"
                value={formData.order || ""}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
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
