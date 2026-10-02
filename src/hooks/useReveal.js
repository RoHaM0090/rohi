import { useEffect, useRef, useState } from 'react'

// One shared IntersectionObserver for every <Reveal>.
let observer = null
const callbacks = new WeakMap()
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            callbacks.get(e.target)?.()
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
  }
  return observer
}

export function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) { setShown(true); return undefined }
    const obs = getObserver()
    callbacks.set(el, () => setShown(true))
    obs.observe(el)
    return () => obs.unobserve(el)
  }, [])
  return [ref, shown]
}
