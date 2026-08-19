import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Card, Input, Button, Banner, Spinner } from "../components/ui";
import { getProfile, updateProfile } from "../services/auth";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(setForm);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateProfile({ name: form.name, mobile: form.mobile });
      setForm(updated);
      setUser(updated);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h1 className="font-display font-bold text-2xl text-moss-900 mb-6">Profile</h1>
      <Card className="p-6 max-w-md">
        {error && <Banner>{error}</Banner>}
        {success && <Banner tone="success">{success}</Banner>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" value={form.email} disabled className="opacity-60 cursor-not-allowed" />
          <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
        </form>
      </Card>
    </Layout>
  );
}
