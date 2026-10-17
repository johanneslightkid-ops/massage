import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { loadLanguage } from './lib/translations'
import { initialLanguage } from './lib/translations/LanguageProvider'

// English ships in the bundle; any other language's UI words are fetched
// before the first render, so nobody sees the page flip language.
void loadLanguage(initialLanguage()).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
