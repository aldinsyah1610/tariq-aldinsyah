function calcH(index, total, min, max) {
  const center = (total - 1) / 2
  const dist = Math.abs(index - center)
  const maxDist = center || 1
  // Peak at center (tallest), taper to edges.
  // FLIP shape: change to (dist / maxDist) for tall-at-edges instead.
  const pct = 1 - dist / maxDist
  return min + pct * (max - min)
}

export default function GradientBars({
  numBars = 13,
  minH = 60,
  maxH = 400,
  duration = 3,
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
          bottom: 0,
          left: 0,
          right: 0,
          height: maxH,
          display: 'flex',
          // FLIP anchor: 'flex-end' = bars at floor. Change to 'flex-start' for top anchor.
          alignItems: 'flex-end',
          gap: '4px',
          padding: '0 4px',
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
                // Solid lime — mask controls the fade, avoiding color-interpolation issues.
                background: 'var(--lime-text)',
                // Lime SOLID at bottom (black = fully visible), fades to TRANSPARENT at top.
                // FLIP direction: swap 'to top' → 'to bottom' in both mask lines below.
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                // Animation squishes from the floor up — lime stays at floor.
                // FLIP origin: 'bottom center' → 'top center' if you change alignItems.
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
