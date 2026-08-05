import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// El splash de la tienda solo aplica a la tienda; en /admin se quita al instante.
if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
  document.getElementById('boot-splash')?.remove()
  try {
    sessionStorage.setItem('vm_boot_done', '1')
  } catch {
    /* ignore */
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
