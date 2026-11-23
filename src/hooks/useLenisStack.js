import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

const HEADER_HEIGHT = 60

export function useLenisStack({ enabled }) {
  const lenisRef = useRef(null)
  const [mainEl, setMainEl] = useState(null)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event) => setReducedMotion(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const active = enabled && !reducedMotion

  useEffect(() => {
    if (!active || !mainEl) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    })
    lenisRef.current = lenis

    const html = document.documentElement
    html.classList.add('lenis-active')

    const getSections = () => Array.from(mainEl.querySelectorAll(':scope > section'))

    const updateStickyOffsets = () => {
      const sections = getSections()
      const viewportHeight = window.innerHeight
      sections.forEach((section, index) => {
        if (index === sections.length - 1) {
          section.style.removeProperty('--stack-top')
          return
        }
        const stickyTop = Math.min(HEADER_HEIGHT, viewportHeight - section.offsetHeight)
        section.style.setProperty('--stack-top', `${Math.round(stickyTop)}px`)
      })
    }

    const updateDepth = () => {
      const sections = getSections()
      const viewportHeight = window.innerHeight
      const travel = Math.max(1, viewportHeight - HEADER_HEIGHT)

      sections.forEach((section, index) => {
        const next = sections[index + 1]
        if (!next) {
          section.style.setProperty('--stack-progress', '0')
          return
        }
        const nextTop = next.getBoundingClientRect().top
        const progress = Math.min(1, Math.max(0, (viewportHeight - nextTop) / travel))
        section.style.setProperty('--stack-progress', progress.toFixed(4))
      })
    }

    const syncLayout = () => {
      updateStickyOffsets()
      updateDepth()
      lenis.resize()
    }

    lenis.on('scroll', updateDepth)

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }
    rafId = window.requestAnimationFrame(raf)

    const resizeObserver = new ResizeObserver(syncLayout)
    const mutationObserver = new MutationObserver(() => {
      getSections().forEach((section) => resizeObserver.observe(section))
      syncLayout()
    })

    resizeObserver.observe(mainEl)
    getSections().forEach((section) => resizeObserver.observe(section))
    mutationObserver.observe(mainEl, { childList: true })

    const bodyObserver = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop()
      } else {
        lenis.start()
      }
    })
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    window.addEventListener('resize', syncLayout)
    window.addEventListener('scroll', updateDepth, { passive: true })
    window.visualViewport?.addEventListener('resize', syncLayout)
    syncLayout()

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', syncLayout)
      window.removeEventListener('scroll', updateDepth)
      window.visualViewport?.removeEventListener('resize', syncLayout)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      bodyObserver.disconnect()
      lenis.destroy()
      lenisRef.current = null
      html.classList.remove('lenis-active')
      getSections().forEach((section) => {
        section.style.removeProperty('--stack-top')
        section.style.removeProperty('--stack-progress')
      })
    }
  }, [active, mainEl])

  const scrollToSection = useCallback((targetId) => {
    const lenis = lenisRef.current
    if (!lenis) return false

    if (targetId === 'inicio') {
      lenis.scrollTo(0)
      return true
    }

    if (!mainEl) return false

    const sections = Array.from(mainEl.querySelectorAll(':scope > section'))
    const targetIndex = sections.findIndex((section) => section.id === targetId)
    if (targetIndex === -1) return false

    // Compute the section's natural flow position so sticky offsets never distort navigation.
    const mainTop = mainEl.getBoundingClientRect().top + window.scrollY
    let offset = 0
    for (let i = 0; i < targetIndex; i += 1) {
      offset += sections[i].offsetHeight
    }

    lenis.scrollTo(Math.max(0, mainTop + offset - HEADER_HEIGHT))
    return true
  }, [mainEl])

  return { mainRef: setMainEl, stackActive: active, scrollToSection }
}
