import { useEffect, useState } from "react";
import { Card, Button, Input, Select, Modal, Spinner, EmptyState, Banner } from "./ui";
import { listCategories } from "../services/categories";
import { getErrorMessage } from "../services/api";
import { formatINR, formatDate } from "../utils/format";

const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Bank"];

export default function TransactionPage({
  title,
  categoryType,
  dateField,
  listFn,
  createFn,
  updateFn,
  deleteFn,
}) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", from_date: "", to_date: "", search: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  function emptyForm() {
    return { category_id: "", amount: "", [dateField]: "", payment_method: "Cash", description: "" };
  }

  async function loadCategories() {
    const data = await listCategories({ type: categoryType, page_size: 100 });
    setCategories(data.results || data);
  }

  async function loadItems() {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.from_date) params.from_date = filters.from_date;
      if (filters.to_date) params.to_date = filters.to_date;
      if (filters.search) params.search = filters.search;
      const data = await listFn(params);
      setItems(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.from_date, filters.to_date, filters.search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      category_id: item.category_id,
      amount: item.amount,
      [dateField]: item[dateField],
      payment_method: item.payment_method,
      description: item.description || "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateFn(editing.id, form);
      } else {
        await createFn(form);
      }
      setModalOpen(false);
      loadItems();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(item) {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteFn(item.id);
      loadItems();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-moss-900">{title}</h1>
        <Button onClick={openCreate}>+ Add {categoryType === "expense" ? "expense" : "income"}</Button>
      </div>

      <Card className="p-4 mb-5">
        <div className="grid sm:grid-cols-4 gap-3">
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input type="date" value={filters.from_date} onChange={(e) => setFilters({ ...filters, from_date: e.target.value })} />
          <Input type="date" value={filters.to_date} onChange={(e) => setFilters({ ...filters, to_date: e.target.value })} />
          <Input
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </Card>

      <Card className="p-2">
        {loading ? (
          <Spinner />
        ) : items.length ? (
          <div className="divide-y divide-moss-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-moss-900">{item.category_name}</p>
                  <p className="text-xs text-moss-900/50">
                    {formatDate(item[dateField])} · {item.payment_method}
                    {item.description ? ` · ${item.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold text-sm ${categoryType === "income" ? "text-moss-600" : "text-clay"}`}>
                    {formatINR(item.amount)}
                  </span>
                  <div className="flex gap-3 text-xs font-semibold">
                    <button onClick={() => openEdit(item)} className="text-moss-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item)} className="text-clay hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={`No ${categoryType === "income" ? "income" : "expenses"} yet`} hint="Add your first entry above." />
        )}
      </Card>

      {modalOpen && (
        <Modal title={editing ? "Edit entry" : "New entry"} onClose={() => setModalOpen(false)}>
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
            <Input
              label="Amount (₹)"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              required
              value={form[dateField]}
              onChange={(e) => setForm({ ...form, [dateField]: e.target.value })}
            />
            <Select
              label="Payment method"
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional note"
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save changes" : "Add entry"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
