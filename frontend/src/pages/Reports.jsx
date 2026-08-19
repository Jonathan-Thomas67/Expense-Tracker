import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Button, Select, Input, Spinner, EmptyState } from "../components/ui";
import { getReports, exportCSV, exportExcel } from "../services/dashboard";
import { listCategories } from "../services/categories";
import { formatINR, formatDate } from "../utils/format";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Reports() {
  const [filters, setFilters] = useState({ month: "", year: "", category: "", type: "" });
  const [categories, setCategories] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    listCategories({ page_size: 100 }).then((data) => setCategories(data.results || data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    getReports(params).then(setReport).finally(() => setLoading(false));
  }, [filters]);

  async function handleExport(fn, label) {
    setExporting(label);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      await fn(params);
    } finally {
      setExporting("");
    }
  }

  return (
    <Layout>
      <h1 className="font-display font-bold text-2xl text-moss-900 mb-6">Reports</h1>

      <Card className="p-4 mb-5">
        <div className="grid sm:grid-cols-5 gap-3">
          <Select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
            <option value="">All months</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
          <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">Income &amp; expense</option>
            <option value="income">Income only</option>
            <option value="expense">Expense only</option>
          </Select>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => handleExport(exportCSV, "csv")} disabled={exporting === "csv"}>
              {exporting === "csv" ? "..." : "CSV"}
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => handleExport(exportExcel, "excel")} disabled={exporting === "excel"}>
              {exporting === "excel" ? "..." : "Excel"}
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : report ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Card className="p-4">
              <p className="text-xs font-semibold text-moss-900/50 mb-1">Total Income</p>
              <p className="font-display font-bold text-moss-700">{formatINR(report.total_income)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold text-moss-900/50 mb-1">Total Expense</p>
              <p className="font-display font-bold text-clay">{formatINR(report.total_expense)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold text-moss-900/50 mb-1">Balance</p>
              <p className="font-display font-bold text-gold">{formatINR(report.balance)}</p>
            </Card>
          </div>

          <Card className="p-2">
            {report.results?.length ? (
              <div className="divide-y divide-moss-100">
                {report.results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-moss-900">{r.category}</p>
                      <p className="text-xs text-moss-900/50">
                        {formatDate(r.date)} · {r.payment_method}
                        {r.description ? ` · ${r.description}` : ""}
                      </p>
                    </div>
                    <span className={`font-semibold text-sm ${r.type === "income" ? "text-moss-600" : "text-clay"}`}>
                      {r.type === "income" ? "+" : "-"} {formatINR(r.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No transactions match these filters" />
            )}
          </Card>
        </>
      ) : null}
    </Layout>
  );
}
