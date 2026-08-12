import { useEffect, useRef, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'ulpan-install-dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

/**
 * Banner para instalar la PWA (Chrome/Android) o guía en iOS (Compartir → Agregar a inicio).
 */
export function InstallPrompt() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      /* ignore */
    }

    const onBip = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
      setIosHint(false)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBip)

    if (isIos()) {
      setIosHint(true)
      setVisible(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  if (!visible) return null

  async function install() {
    const ev = deferred.current
    if (!ev) return
    await ev.prompt()
    await ev.userChoice
    deferred.current = null
    dismiss()
  }

  function dismiss() {
    setVisible(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="install-banner" role="region" aria-label="Instalar aplicación">
      <div className="install-banner-text">
        <strong>Instalá Ulpan Maggie</strong>
        <span>
          {iosHint
            ? 'En Safari: Compartir → “Agregar a pantalla de inicio”.'
            : 'Usala como app en el celular, sin tienda.'}
        </span>
      </div>
      <div className="install-banner-actions">
        {!iosHint ? (
          <button type="button" className="btn btn-solid" onClick={() => void install()}>
            Instalar
          </button>
        ) : null}
        <button type="button" className="btn btn-outline" onClick={dismiss}>
          Ahora no
        </button>
      </div>
    </div>
  )
}
