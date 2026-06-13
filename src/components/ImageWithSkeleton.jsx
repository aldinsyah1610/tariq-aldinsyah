import { useState } from 'react'

export default function ImageWithSkeleton({ src, alt, imgClassName = '', style = {} }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div className="skeleton-shimmer absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  )
}
