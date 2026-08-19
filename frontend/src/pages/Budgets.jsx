import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Button, Input, Select, Modal, Spinner, EmptyState, Banner } from "../components/ui";
import { listBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgets";
import { listCategories } from "../services/categories";
import { getErrorMessage } from "../services/api";
import { formatINR } from "../utils/format";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const now = new Date();

function emptyForm() {
  return { category_id: "", month: now.getMonth() + 1, year: now.getFullYear(), amount: "" };
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([
        listBudgets({ page_size: 100 }),
        listCategories({ type: "expense", page_size: 100 }),
      ]);
      setBudgets(b.results || b);
      setCategories(c.results || c);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setError("");
    setModalOpen(true);
  }

  function openEdit(budget) {
    setEditing(budget);
    setForm({ category_id: budget.category_id, month: budget.month, year: budget.year, amount: budget.amount });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateBudget(editing.id, form);
      } else {
        await createBudget(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(budget) {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await deleteBudget(budget.id);
      load();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-moss-900">Budgets</h1>
        <Button onClick={openCreate}>+ Add budget</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : budgets.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = Math.min(b.usage_percentage, 100);
            const over = b.usage_percentage > 100;
            return (
              <Card key={b.id} className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display font-semibold text-moss-900">{b.category_name}</p>
                  <span className="text-xs text-moss-900/50">{MONTHS[b.month - 1]} {b.year}</span>
                </div>
                <p className="text-xs text-moss-900/50 mb-3">
                  {formatINR(b.spent)} / {formatINR(b.amount)}
                </p>
                <div className="h-2 rounded-full bg-moss-50 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${over ? "bg-clay" : "bg-moss-600"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${over ? "text-clay" : "text-moss-700"}`}>
                    {b.usage_percentage}% used
                  </span>
                  <div className="flex gap-3 text-xs font-semibold">
                    <button onClick={() => openEdit(b)} className="text-moss-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(b)} className="text-clay hover:underline">Delete</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-2">
          <EmptyState title="No budgets yet" hint="Set a monthly budget per category above." />
        </Card>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit budget" : "New budget"} onClose={() => setModalOpen(false)}>
          {error && <Banner>{error}</Banner>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Category"
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Month"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </Select>
              <Input
                label="Year"
                type="number"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              />
            </div>
            <Input
              label="Budget amount (₹)"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save changes" : "Add budget"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
