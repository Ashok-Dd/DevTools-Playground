function ToolCard({ title, desc, gradient, usage }) {
  return (
    <div
      className="p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer 
      border border-[var(--border)] bg-[var(--card-bg)] group relative"
    >
      {/* Icon with gradient */}
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient}
        flex items-center justify-center text-white text-xl font-bold shadow-xl 
        group-hover:scale-110 transition-transform`}
      >
        {title.charAt(0)}
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-semibold mt-4 text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-[var(--text-light)]">{desc}</p>

      {/* Usage Count Badge */}
      {usage !== undefined && (
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold bg-[var(--primary)] text-white rounded-full shadow-md">
          {usage} {usage === 1 ? "use" : "uses"}
        </span>
      )}
    </div>
  );
}

export default ToolCard;
