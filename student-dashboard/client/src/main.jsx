import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1C1B27',
          color: '#FFFCE8',
          border: '1px solid #2E2D3D',
          fontFamily: 'DM Sans, sans-serif',
        },
      }}
    />
  </React.StrictMode>
)
