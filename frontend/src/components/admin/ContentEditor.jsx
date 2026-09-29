import { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { PenLine, RotateCcw, Save, Loader2, Search } from "lucide-react";
import { useCms } from "@/cms/CmsContext";
import { CONTENT_GROUPS, fieldsForGroup } from "@/cms/registry";

const QUILL_MODULES = {
  toolbar: [["bold", "italic", "underline", "strike"], [{ header: [2, 3, false] }], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
};
const isEmptyHtml = (v) => !v || /^(<p>(<br>|\s)*<\/p>\s*)*$/.test(v);

function Field({ field, api, withRefresh }) {
  const { overrides, setOverride } = useCms();
  const saved = overrides[field.key];
  const [draft, setDraft] = useState(saved ?? field.defaultValue);
  const [busy, setBusy] = useState(false);
  const dirty = draft !== (saved ?? field.defaultValue);

  const save = async () => {
    if (field.rich && isEmptyHtml(draft)) return toast.error("Content can't be empty.");
    if (!field.rich && !draft.trim()) return toast.error("Content can't be empty.");
    setBusy(true);
    try {
      const { data } = await withRefresh(() => api.put(`/api/content/${encodeURIComponent(field.key)}`, { value: draft }));
      setOverride(field.key, data.value);
      setDraft(data.value);
      toast.success("Saved — live on the site.");
    } catch {
      toast.error("Could not save.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!window.confirm("Reset this text to the original default?")) return;
    setBusy(true);
    try {
      await withRefresh(() => api.delete(`/api/content/${encodeURIComponent(field.key)}`));
      setOverride(field.key, null);
      setDraft(field.defaultValue);
      toast.success("Reset to default.");
    } catch {
      toast.error("Could not reset.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-5" data-testid={`cms-field-${field.key}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-dim">{field.label}</div>
        <div className="flex items-center gap-2">
          {saved !== undefined && <span className="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[11px] font-semibold text-crimson" data-testid={`cms-modified-${field.key}`}>Edited</span>}
          {saved !== undefined && (
            <button type="button" onClick={reset} disabled={busy} className="inline-flex items-center gap-1 text-xs text-dim transition-colors hover:text-crimson" data-testid={`cms-reset-${field.key}`}>
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={busy || !dirty}
            className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3.5 py-1.5 text-xs font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink disabled:opacity-40"
            data-testid={`cms-save-${field.key}`}
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
          </button>
        </div>
      </div>
      <div className="mt-3">
        {field.rich ? (
          <div className="cms-quill" data-testid={`cms-editor-${field.key}`}>
            <ReactQuill theme="snow" value={draft} onChange={setDraft} modules={QUILL_MODULES} />
          </div>
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-ink px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-crimson"
            data-testid={`cms-input-${field.key}`}
          />
        )}
      </div>
    </div>
  );
}

export function ContentEditor({ api, withRefresh }) {
  const [groupId, setGroupId] = useState(CONTENT_GROUPS[0].id);
  const [query, setQuery] = useState("");
  const { overrides } = useCms();
  const group = CONTENT_GROUPS.find((g) => g.id === groupId);
  const fields = useMemo(() => fieldsForGroup(group), [group]);
  const q = query.trim().toLowerCase();
  const visible = q ? fields.filter((f) => f.label.toLowerCase().includes(q) || f.defaultValue.toLowerCase().includes(q)) : fields;
  const editedCount = Object.keys(overrides).length;

  return (
    <section className="mt-16" data-testid="admin-content-editor">
      <span className="overline">Edit site text</span>
      <h2 className="mt-4 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight">
        <PenLine size={26} className="text-crimson" /> Content
        {editedCount > 0 && <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-dim" data-testid="cms-edited-count">{editedCount} edited</span>}
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-dim">Changes go live immediately on the website. Design and layout stay fixed — only the words change. Use Reset to restore any original text.</p>

      <div className="mt-6 flex flex-wrap gap-2" data-testid="cms-groups">
        {CONTENT_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroupId(g.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${groupId === g.id ? "border-crimson bg-crimson text-cwhite" : "border-white/15 text-dim hover:border-crimson hover:text-white"}`}
            data-testid={`cms-group-${g.id}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <label className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2.5 text-sm">
        <Search size={14} className="text-dim" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search text in this section…" className="w-full bg-transparent text-white outline-none" data-testid="cms-search-input" />
      </label>

      <div className="mt-5 grid gap-4" data-testid="cms-fields">
        {visible.map((f) => <Field key={`${groupId}:${f.key}`} field={f} api={api} withRefresh={withRefresh} />)}
        {visible.length === 0 && <p className="text-sm text-dim">No text matches your search.</p>}
      </div>
    </section>
  );
}
