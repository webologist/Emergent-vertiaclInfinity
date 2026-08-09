import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Inbox, LogOut, RefreshCcw, Trash2, Mail, Building2, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";

const api = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL, withCredentials: true });

async function withRefresh(fn) {
  try {
    return await fn();
  } catch (e) {
    if (e.response?.status === 401) {
      await api.post("/api/auth/refresh");
      return fn();
    }
    throw e;
  }
}

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

const LoginCard = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      onSuccess(data);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <div>
            <div className="font-display text-lg font-bold leading-none">Lead Inbox</div>
            <div className="mt-1 text-xs text-dim">Vertical Infinity — admin access</div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-surface p-7">
          <div>
            <label htmlFor="admin-email" className="text-xs uppercase tracking-widest text-dim">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-crimson"
              placeholder="admin@verticalinfinity.in"
              data-testid="admin-email-input"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-xs uppercase tracking-widest text-dim">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-crimson"
              placeholder="••••••••••"
              data-testid="admin-password-input"
            />
          </div>
          {error && (
            <p className="text-xs text-crimson" role="alert" data-testid="admin-login-error">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-crimson hover:text-cwhite disabled:opacity-60"
            data-testid="admin-login-submit"
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </form>
        <a href="/" className="mt-6 flex items-center gap-2 text-xs text-dim transition-colors duration-300 hover:text-white" data-testid="admin-back-link">
          <ArrowLeft size={13} /> Back to site
        </a>
      </div>
    </div>
  );
};

const STATUS_META = {
  new: { label: "New", cls: "border-crimson/40 bg-crimson/10 text-crimson" },
  contacted: { label: "Contacted", cls: "border-amber-500/40 bg-amber-500/10 text-amber-500" },
  closed: { label: "Closed", cls: "border-white/15 bg-white/5 text-dim" },
};

const LeadCard = ({ lead, onDelete, onStatus }) => (
  <article className="rounded-2xl border border-white/10 bg-surface p-6 transition-colors duration-300 hover:border-white/20" data-testid={`lead-card-${lead.id}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="font-display text-base font-bold">{lead.name}</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_META[lead.status || "new"].cls}`}
            data-testid={`lead-status-badge-${lead.id}`}
          >
            {STATUS_META[lead.status || "new"].label}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dim">
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 transition-colors duration-300 hover:text-crimson" data-testid={`lead-email-${lead.id}`}>
            <Mail size={12} /> {lead.email}
          </a>
          {lead.company && (
            <span className="flex items-center gap-1.5"><Building2 size={12} /> {lead.company}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-elevated px-3 py-1 text-xs font-semibold text-white">{lead.topic}</span>
        <button
          onClick={() => onDelete(lead.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-dim transition-colors duration-300 hover:border-crimson hover:text-crimson"
          aria-label="Delete enquiry"
          data-testid={`lead-delete-${lead.id}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
    <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/85">{lead.message}</p>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs text-dim">{new Date(lead.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
      <div className="flex overflow-hidden rounded-full border border-white/10" data-testid={`lead-status-control-${lead.id}`}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => onStatus(lead.id, key)}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
              (lead.status || "new") === key ? "bg-white text-ink" : "text-dim hover:text-white"
            }`}
            data-testid={`lead-status-${key}-${lead.id}`}
          >
            {meta.label}
          </button>
        ))}
      </div>
    </div>
  </article>
);

export default function Admin() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await withRefresh(() => api.get("/api/contact"));
      setLeads(data);
    } catch {
      toast.error("Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Lead Inbox — Vertical Infinity";
    (async () => {
      try {
        const { data } = await withRefresh(() => api.get("/api/auth/me"));
        setUser(data);
      } catch {
        setUser(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) loadLeads();
  }, [user, loadLeads]);

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(false);
    setLeads([]);
  };

  const deleteLead = async (id) => {
    try {
      await withRefresh(() => api.delete(`/api/contact/${id}`));
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success("Enquiry deleted.");
    } catch {
      toast.error("Could not delete enquiry.");
    }
  };

  const setStatus = async (id, status) => {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await withRefresh(() => api.patch(`/api/contact/${id}/status`, { status }));
      toast.success(`Marked as ${status}.`);
    } catch {
      setLeads(prev);
      toast.error("Could not update status.");
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => (l.status || "new") === filter);
  const countOf = (s) => leads.filter((l) => (l.status || "new") === s).length;

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" data-testid="admin-loading">
        <Loader2 size={22} className="animate-spin text-dim" />
      </div>
    );
  }

  if (user === false) return <LoginCard onSuccess={setUser} />;

  return (
    <div className="min-h-screen pb-24" data-testid="admin-inbox-page">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container-x flex h-[68px] items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" data-testid="admin-brand-link">
            <Logo size={28} />
            <span className="font-display text-[15px] font-bold tracking-tight">Lead Inbox</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-dim sm:block">{user.email}</span>
            <button
              onClick={loadLeads}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-dim transition-colors duration-300 hover:border-crimson hover:text-white"
              aria-label="Refresh"
              data-testid="admin-refresh-btn"
            >
              <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
              data-testid="admin-logout-btn"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-x pt-12">
        <span className="overline">We are always listening</span>
        <div className="mt-4 flex items-end justify-between">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Enquiries</h1>
          <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs text-dim" data-testid="admin-lead-count">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" data-testid="admin-status-filters">
          {[
            ["all", "All"],
            ["new", "New"],
            ["contacted", "Contacted"],
            ["closed", "Closed"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
                filter === key ? "border-crimson bg-crimson text-cwhite" : "border-white/15 text-dim hover:border-crimson hover:text-white"
              }`}
              data-testid={`admin-filter-${key}`}
            >
              {label} · {key === "all" ? leads.length : countOf(key)}
            </button>
          ))}
        </div>

        {loading && leads.length === 0 ? (
          <div className="mt-16 flex justify-center"><Loader2 size={22} className="animate-spin text-dim" /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 py-20 text-center" data-testid="admin-empty-state">
            <Inbox size={32} className="text-dim" strokeWidth={1.4} />
            <p className="text-sm text-dim">
              {leads.length === 0
                ? "No enquiries yet. They'll land here the moment someone reaches out."
                : `No ${filter} enquiries right now.`}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onDelete={deleteLead} onStatus={setStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
