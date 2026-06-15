// DOM-split helpers for GSAP text animation
// splitWords: wraps each word in overflow:hidden clip-parent + animatable inner span
// splitChars: wraps each char in an animatable inline-block span

export function splitWords(el) {
  if (!el) return []
  const text = el.textContent.trim()
  el.innerHTML = text
    .split(/\s+/)
    .map(w =>
      `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.2">` +
      `<span class="st-word" style="display:inline-block">${w}</span></span>`
    )
    .join(' ')
  return [...el.querySelectorAll('.st-word')]
}

export function splitChars(el) {
  if (!el) return []
  el.innerHTML = [...el.textContent]
    .map(c =>
      c === ' '
        ? `<span style="display:inline-block;width:0.28em"> </span>`
        : `<span class="st-char" style="display:inline-block">${c}</span>`
    )
    .join('')
  return [...el.querySelectorAll('.st-char')]
}
