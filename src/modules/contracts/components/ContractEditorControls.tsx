export function Field({
  label,
  value,
  onChange,
  multiline = false,
  direction,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  direction?: "ltr";
}) {
  const classes =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";
  return (
    <label className="block text-[13px] font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          className={`${classes} resize-y leading-6`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          dir={direction}
          className={classes}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function Group({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
