import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plus, Trash2, Loader2, Lock } from "lucide-react";

export function TeamAccess({ api, withRefresh, currentEmail }) {
  const [items, setItems] = useState(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState("");

  const load = async () => {
    try {
      const { data } = await withRefresh(() => api.get("/api/admin/access"));
      setItems(data);
    } catch {
      toast.error("Could not load team access list.");
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const add = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data } = await withRefresh(() => api.post("/api/admin/access", { email: email.trim() }));
      setItems((prev) => [...(prev || []), data]);
      setEmail("");
      toast.success(`${data.email} can now sign in with Google.`);
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Please enter a valid email address.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (target) => {
    if (!window.confirm(`Remove Google sign-in access for ${target}?`)) return;
    setRemoving(target);
    try {
      await withRefresh(() => api.delete(`/api/admin/access/${encodeURIComponent(target)}`));
      setItems((prev) => prev.filter((i) => i.email !== target));
      toast.success(`Access removed for ${target}.`);
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Could not remove access.");
    } finally {
      setRemoving("");
    }
  };

  return (
    <section className="mt-16" data-testid="admin-team-access">
      <span className="overline">Who can sign in</span>
      <h2 className="mt-4 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight">
        <ShieldCheck size={26} className="text-crimson" /> Team access
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-dim">
        Google accounts listed here can open the Lead Inbox with “Sign in with Google”. Accounts marked <em>Environment</em> come from server configuration and can't be removed here.
      </p>

      <form onSubmit={add} className="mt-6 flex flex-col gap-3 sm:flex-row" data-testid="admin-access-form">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@gmail.com"
          className="flex-1 rounded-full border border-white/10 bg-surface px-5 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-crimson"
          data-testid="admin-access-email-input"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink disabled:opacity-60"
          data-testid="admin-access-add-btn"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Grant access
        </button>
      </form>

      <ul className="mt-6 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-surface" data-testid="admin-access-list">
        {items === null ? (
          <li className="flex items-center gap-2 px-6 py-5 text-sm text-dim"><Loader2 size={14} className="animate-spin" /> Loading…</li>
        ) : items.map((i) => (
          <li key={i.email} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4" data-testid={`admin-access-row-${i.email}`}>
            <div className="min-w-0">
              <div className="truncate text-sm text-white">
                {i.email}
                {i.email === currentEmail && <span className="ml-2 text-xs text-dim">(you)</span>}
              </div>
              <div className="mt-0.5 text-xs text-dim">
                {i.source === "env" ? "Environment" : `Added by ${i.added_by || "admin"}${i.created_at ? ` · ${new Date(i.created_at).toLocaleDateString()}` : ""}`}
              </div>
            </div>
            {i.source === "env" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-dim" data-testid={`admin-access-locked-${i.email}`}>
                <Lock size={12} /> Locked
              </span>
            ) : (
              <button
                type="button"
                onClick={() => remove(i.email)}
                disabled={removing === i.email}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-dim transition-colors duration-300 hover:border-crimson hover:text-crimson disabled:opacity-60"
                data-testid={`admin-access-remove-${i.email}`}
              >
                {removing === i.email ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
