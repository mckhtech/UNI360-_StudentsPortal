
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "260596696186-r7hdog31h2djl2e96rlfln1s8finltoi.apps.googleusercontent.com"

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);