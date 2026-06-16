import { useTheme } from '../hooks/useTheme'

function calcH(index, total, minPct, maxPct) {
  const center = (total - 1) / 2
  const dist = Math.abs(index - center)
  const maxDist = center || 1
  // V shape: tallest at edges, shortest at center.
  // FLIP: change to (1 - dist / maxDist) for peak-at-center.
  const pct = dist / maxDist
  return `${Math.round(minPct + pct * (maxPct - minPct))}%`
}

export default function GradientBars({
  numBars = 13,
  minPct = 22,
  maxPct = 92,
  duration = 8,
}) {
  const { theme } = useTheme()
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const center = Math.floor(numBars / 2)

  // Explicit rgba stops (no 'transparent' keyword) = zero color banding on any bg.
  // Light mode: light vivid green on cream bg. Dark mode: dark green matching --border (#1e2a0a).
  const barBg = theme === 'light'
    ? 'linear-gradient(to top, rgba(130,185,50,0.72) 0%, rgba(130,185,50,0) 100%)'
    : 'linear-gradient(to top, rgba(30,42,10,0.95) 0%, rgba(30,42,10,0) 100%)'

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
          gap: '4px',
          padding: '0 4px',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: numBars }, (_, i) => {
          const h = calcH(i, numBars, minPct, maxPct)
          const delay = Math.abs(i - center) * (duration / numBars)
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                background: barBg,
                transformOrigin: 'bottom center',
                willChange: 'transform',
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
