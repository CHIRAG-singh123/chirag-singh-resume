/** Stack tag for project cards - text only; brand icons live on the Skills page only. */
export function ProjectStackChip({
  label,
  tone = 'default',
}: {
  label: string
  tone?: 'default' | 'compact' | 'accent'
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] text-foreground'
      : tone === 'compact'
        ? 'border-border/70 bg-background/50 px-2.5 py-1 text-[10px]'
        : 'border-border bg-card/70 px-3 py-1.5 text-[11px]'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border font-semibold uppercase tracking-[0.14em] text-muted-foreground ${toneClass}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          tone === 'accent' ? 'bg-foreground' : 'bg-accent'
        }`}
        aria-hidden
      />
      {label}
    </span>
  )
}
