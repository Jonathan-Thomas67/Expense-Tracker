import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Button, Input, Select, Modal, Spinner, EmptyState, Banner } from "../components/ui";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../services/categories";
import { getErrorMessage } from "../services/api";

const EMPTY_FORM = { name: "", type: "expense" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listCategories({ page_size: 100 });
      setCategories(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", type: tab });
    setError("");
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, type: cat.type });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await createCategory(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(cat) {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  const filtered = categories.filter((c) => c.type === tab);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-moss-900">Categories</h1>
        <Button onClick={openCreate}>+ Add category</Button>
      </div>

      <div className="flex gap-2 mb-5">
        {["expense", "income"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              tab === t ? "bg-moss-600 text-paper" : "bg-moss-50 text-moss-900/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="p-2">
        {loading ? (
          <Spinner />
        ) : filtered.length ? (
          <div className="divide-y divide-moss-100">
            {filtered.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-moss-900">{cat.name}</span>
                  {cat.user === null && (
                    <span className="text-[10px] uppercase tracking-wide bg-moss-50 text-moss-600 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                {cat.user !== null && (
                  <div className="flex gap-3 text-xs font-semibold">
                    <button onClick={() => openEdit(cat)} className="text-moss-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat)} className="text-clay hover:underline">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No categories yet" hint="Add your first category above." />
        )}
      </Card>

      {modalOpen && (
        <Modal title={editing ? "Edit category" : "New category"} onClose={() => setModalOpen(false)}>
          {error && <Banner>{error}</Banner>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Groceries"
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add category"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
