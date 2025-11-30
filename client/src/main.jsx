import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
    
    <GoogleOAuthProvider clientId='365627034966-vl18kan00c9vnrhn3b489fdt2972qjg4.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
)
