import { useEffect, useState } from "react";
import { Compass, RefreshCw } from "lucide-react";
import { SITUATIONS, PRIORITIES } from "@/data/serviceHelper";
import { SERVICE_INDEX } from "@/data/services";

const label = (kind, key) => {
  if (kind === "service") return SERVICE_INDEX[key]?.name || key;
  const list = kind === "situation" ? SITUATIONS : PRIORITIES;
  return list.find((x) => x.id === key)?.label || key;
};

function Bars({ title, rows, kind, testId }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6" data-testid={testId}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-dim">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-dim">No responses yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((r) => (
            <li key={r.key} data-testid={`${testId}-row-${r.key}`}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-white">{label(kind, r.key)}</span>
                <span className="shrink-0 font-semibold text-crimson">{r.count}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-crimson transition-[width] duration-700" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FinderInsights({ api, withRefresh }) {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: d } = await withRefresh(() => api.get(`/api/finder/insights?days=${days}`));
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="mt-16" data-testid="admin-finder-insights">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="overline">What visitors are looking for</span>
          <h2 className="mt-4 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight">
            <Compass size={26} className="text-crimson" /> Finder insights
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${days === d ? "border-crimson bg-crimson text-cwhite" : "border-white/15 text-dim hover:border-crimson hover:text-white"}`}
              data-testid={`admin-finder-range-${d}`}
            >
              {d}d
            </button>
          ))}
          <button type="button" onClick={load} className="ml-1 rounded-full border border-white/15 p-2 text-dim transition-colors hover:border-crimson hover:text-white" aria-label="Refresh insights" data-testid="admin-finder-refresh-btn">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-dim" data-testid="admin-finder-total-window">
          <strong className="text-white">{data?.total_window ?? "—"}</strong> in last {days} days
        </span>
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-dim" data-testid="admin-finder-total-all">
          <strong className="text-white">{data?.total_all_time ?? "—"}</strong> all time
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Bars title="Recommended service" rows={data?.by_service || []} kind="service" testId="admin-finder-by-service" />
        <Bars title="Visitor situation" rows={data?.by_situation || []} kind="situation" testId="admin-finder-by-situation" />
        <Bars title="Top priority" rows={data?.by_priority || []} kind="priority" testId="admin-finder-by-priority" />
      </div>

      {data?.recent?.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-surface" data-testid="admin-finder-recent">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-dim">
              <tr className="border-b border-white/10">
                <th className="px-5 py-3 font-semibold">When</th>
                <th className="px-5 py-3 font-semibold">Situation</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0" data-testid={`admin-finder-recent-${r.id}`}>
                  <td className="whitespace-nowrap px-5 py-3 text-dim">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3">{label("situation", r.situation)}</td>
                  <td className="px-5 py-3">{label("priority", r.priority)}</td>
                  <td className="px-5 py-3 font-semibold text-crimson">{label("service", r.service)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
