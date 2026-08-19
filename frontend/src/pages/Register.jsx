import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { Card, Input, Button, Banner } from "../components/ui";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="inline-flex w-12 h-12 rounded-full bg-moss-600 text-paper items-center justify-center font-display font-bold text-xl mb-3">
            ₹
          </span>
          <h1 className="font-display font-bold text-2xl text-moss-900">Create your account</h1>
          <p className="text-sm text-moss-900/60 mt-1">Start tracking income &amp; expenses</p>
        </div>

        {error && <Banner>{error}</Banner>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          <Input
            label="Mobile"
            required
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="9876543210"
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-moss-900/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-moss-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
