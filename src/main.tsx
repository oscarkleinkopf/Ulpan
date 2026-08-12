import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { warmSpeech } from './lib/speak'

registerSW({ immediate: true })

function Root() {
  useEffect(() => {
    warmSpeech()
  }, [])

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
