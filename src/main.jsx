import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteMotion } from './lib/ui'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteMotion>
      <App />
    </SiteMotion>
  </StrictMode>,
)