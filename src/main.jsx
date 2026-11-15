import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Flawsnap widget: loads only when a project key is set (see .env.example).
// Leave VITE_FLAWSNAP_KEY empty to run the shop without it (the "staging" copy
// used with the Chrome extension).
const key = import.meta.env.VITE_FLAWSNAP_KEY
if (key) {
  const script = document.createElement('script')
  script.src = import.meta.env.VITE_FLAWSNAP_SRC || 'https://backend.flawsnap.com/widget.js'
  script.async = true
  script.dataset.key = key
  if (import.meta.env.VITE_FLAWSNAP_API) script.dataset.api = import.meta.env.VITE_FLAWSNAP_API
  document.head.appendChild(script)
}

createRoot(document.getElementById('root')).render(<App />)
