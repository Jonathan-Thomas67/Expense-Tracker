import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import Layout from "../components/Layout";
import { Card, Spinner, EmptyState } from "../components/ui";
import { getDashboard } from "../services/dashboard";
import { formatINR, formatDate } from "../utils/format";

const PIE_COLORS = ["#2f6244", "#c96a4e", "#c79a3e", "#95bfa2", "#7a5c3e", "#4a7c9e"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><Spinner /></Layout>;
  if (!data) return <Layout><EmptyState title="Couldn't load dashboard" /></Layout>;

  const kpis = [
    { label: "Total Income", value: data.total_income, tone: "bg-moss-50 text-moss-700" },
    { label: "Total Expense", value: data.total_expense, tone: "bg-clay/10 text-clay" },
    { label: "Balance", value: data.balance, tone: "bg-gold/10 text-gold" },
    { label: "This Month's Expense", value: data.monthly_expense, tone: "bg-moss-100 text-moss-700" },
  ];

  return (
    <Layout>
      <h1 className="font-display font-bold text-2xl text-moss-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <p className="text-xs font-semibold text-moss-900/50 mb-2">{kpi.label}</p>
            <p className={`font-display font-bold text-xl px-2 py-1 -mx-2 rounded-lg inline-block ${kpi.tone}`}>
              {formatINR(kpi.value)}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <h2 className="font-display font-semibold text-moss-900 mb-4">Monthly Income vs Expense</h2>
          {data.monthly_summary?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthly_summary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef4ef" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend />
                <Bar dataKey="income" fill="#2f6244" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#c96a4e" radius={[6, 6, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No data yet" />
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-semibold text-moss-900 mb-4">Expense by Category</h2>
          {data.category_expenses?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.category_expenses}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.category_expenses.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No expenses yet" hint="Add an expense to see the breakdown." />
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display font-semibold text-moss-900 mb-4">Recent Transactions</h2>
        {data.recent_transactions?.length ? (
          <div className="divide-y divide-moss-100">
            {data.recent_transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-moss-900">{t.category}</p>
                  <p className="text-xs text-moss-900/50">{t.description || "—"} · {formatDate(t.date)}</p>
                </div>
                <p className={`font-semibold text-sm ${t.type === "income" ? "text-moss-600" : "text-clay"}`}>
                  {t.type === "income" ? "+" : "-"} {formatINR(t.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No transactions yet" hint="Add income or an expense to get started." />
        )}
      </Card>
    </Layout>
  );
}
