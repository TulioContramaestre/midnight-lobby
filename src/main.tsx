import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/app.css'
import App from '@/app/App'
import { GameProvider } from '@/app/GameProvider'

const seed = Date.now()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider seed={seed}>
      <App />
    </GameProvider>
  </StrictMode>,
)
