import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/vazirmatn'
import '@fontsource-variable/space-grotesk'
import './styles/base.css'
import './styles/layout.css'
import './styles/pages.css'
import App from './App.jsx'
import { applySavedPanther } from './utils/panther.js'

applySavedPanther()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
