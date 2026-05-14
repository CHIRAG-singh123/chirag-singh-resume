interface GradientBlobsProps {
  animated?: boolean
  variant?: 'default' | 'soft' | 'intense'
  /** Lighter blur / fewer layers for low-end devices */
  density?: 'normal' | 'light'
}

export function GradientBlobs({
  animated = true,
  variant = 'default',
  density = 'normal',
}: GradientBlobsProps) {
  const opacityClass =
    variant === 'soft' ? 'opacity-30' : variant === 'intense' ? 'opacity-70' : 'opacity-50'
  const blurLg = density === 'light' ? 'blur-[72px]' : 'blur-[120px]'
  const blurXl = density === 'light' ? 'blur-[80px]' : 'blur-[140px]'
  const floatSlow = animated ? 'animate-float-slow' : ''
  const floatSlower = animated ? 'animate-float-slower' : ''
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${opacityClass}`}
    >
      <div
        className={`absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent ${blurLg} ${floatSlow}`}
      />
      {density === 'normal' ? (
        <div
          className={`absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-accent-secondary ${blurXl} ${floatSlower}`}
        />
      ) : null}
      <div
        className={`absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-chart-tertiary ${blurLg} ${floatSlow}`}
      />
    </div>
  )
}
