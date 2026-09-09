import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pixel-assets.css'
import './themes.css'
import './project-artwork.css'
import { applyTheme, getInitialTheme } from './theme.js'
import App from './App.jsx'

applyTheme(getInitialTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
