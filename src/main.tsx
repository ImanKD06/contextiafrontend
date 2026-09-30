import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'
if (localStorage.getItem('ctx_theme') === 'dark') document.documentElement.classList.add('dark')
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><ErrorBoundary><App /></ErrorBoundary></BrowserRouter></React.StrictMode>)