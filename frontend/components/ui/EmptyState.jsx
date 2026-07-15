export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
          <Icon size={28} className="text-muted" />
        </div>
      )}
      {title && <p className="font-syne text-lg font-bold text-navy-900">{title}</p>}
      {description && <p className="max-w-sm font-inter text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
