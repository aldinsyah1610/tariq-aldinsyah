function calcH(index, total, min, max) {
  const center = (total - 1) / 2
  const dist = Math.abs(index - center)
  const maxDist = center || 1
  // Peak at center, taper to edges. Swap numerator to (dist/maxDist) to invert.
  const pct = 1 - dist / maxDist
  return min + pct * (max - min)
}

export default function GradientBars({
  numBars = 11,
  minH = 40,
  maxH = 280,
  duration = 3,
  opacity = 0.35,
}) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const center = Math.floor(numBars / 2)

  return (
    <>
      <style>{`
        @keyframes gbPulse {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.35); }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '3px',
          padding: '0 2px',
          opacity,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: numBars }, (_, i) => {
          const h = calcH(i, numBars, minH, maxH)
          const delay = Math.abs(i - center) * (duration / numBars)
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                background: 'linear-gradient(to bottom, var(--lime-text), transparent)',
                borderRadius: '4px 4px 0 0',
                transformOrigin: 'bottom center',
                willChange: reduced ? 'auto' : 'transform',
                animation: reduced
                  ? 'none'
                  : `gbPulse ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          )
        })}
      </div>
    </>
  )
}
