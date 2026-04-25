interface GradientBlobsProps {
  variant?: 'default' | 'soft' | 'intense'
}

export function GradientBlobs({ variant = 'default' }: GradientBlobsProps) {
  const opacityClass =
    variant === 'soft' ? 'opacity-30' : variant === 'intense' ? 'opacity-70' : 'opacity-50'
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${opacityClass}`}
    >
      <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-accent-secondary blur-[140px] animate-float-slower" />
      <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-chart-tertiary blur-[120px] animate-float-slow" />
    </div>
  )
}
