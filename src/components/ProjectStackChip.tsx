/** Stack tag for project cards — text only; brand icons live on the Skills page only. */
export function ProjectStackChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      {label}
    </span>
  )
}
