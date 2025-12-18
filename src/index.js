import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize Capacitor if available (for iOS/Android)
if (typeof window !== 'undefined' && window.Capacitor) {
  import('@capacitor/core').then(({ Capacitor }) => {
    // Capacitor is already initialized, but we can add any setup here if needed
    console.log('Capacitor platform:', Capacitor.getPlatform());
  }).catch(() => {
    // Capacitor not available, running in web/Electron mode
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
