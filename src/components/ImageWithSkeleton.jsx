import { useState } from 'react'

const base = import.meta.env.BASE_URL

function resolvePublicSrc(src) {
  if (!src || !src.startsWith('/')) return src
  return base.replace(/\/$/, '') + src
}

export default function ImageWithSkeleton({ src, alt, imgClassName = '', style = {} }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div className="skeleton-shimmer absolute inset-0" />
      )}
      <img
        src={resolvePublicSrc(src)}
        alt={alt}
        className={imgClassName}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  )
}
