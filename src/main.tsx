import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'katex/dist/katex.min.css';
import App from './App.tsx';
import './index.css';

// 1. Filter out harmless third-party library warnings & Firestore offline/iframe network logs
if (typeof window !== 'undefined') {
  const originalConsoleWarn = console.warn;
  console.warn = function (...args: any[]) {
    const fullMsg = args.map(a => typeof a === 'object' ? (a?.message || JSON.stringify(a)) : String(a)).join(' ');
    if (
      fullMsg.includes('support for defaultProps will be removed') ||
      fullMsg.includes('ResponsiveContainer') ||
      (fullMsg.includes('width(') && fullMsg.includes('height(')) ||
      fullMsg.includes('chart should be greater than 0') ||
      fullMsg.includes('UNSAFE_componentWill') ||
      fullMsg.includes('Firestore Permission Alert') ||
      fullMsg.includes('Firestore Operation Offline') ||
      fullMsg.includes('Firestore connection check') ||
      fullMsg.includes('@firebase/firestore') ||
      fullMsg.includes('unable to reach the Firebase backend') ||
      fullMsg.includes('performance.measure error')
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    const fullMsg = args.map(a => typeof a === 'object' ? (a?.message || JSON.stringify(a)) : String(a)).join(' ');
    if (
      fullMsg.includes('WebSocket') ||
      fullMsg.includes('websocket') ||
      fullMsg.includes('wss://') ||
      fullMsg.includes('ws://') ||
      fullMsg.includes('[vite]') ||
      fullMsg.includes('server connection lost') ||
      fullMsg.includes('WebChannel') ||
      fullMsg.includes('@firebase/firestore') ||
      fullMsg.includes('unable to reach the Firebase backend') ||
      fullMsg.includes('Could not reach Cloud Firestore') ||
      fullMsg.includes('ERR_CONNECTION')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Prevent uncaught WebSocket / socket error & unhandledrejection events in sandboxed preview iframe
  window.addEventListener('error', (event) => {
    const msg = String(event.message || '');
    if (
      msg.includes('WebSocket') ||
      msg.includes('websocket') ||
      msg.includes('wss://') ||
      msg.includes('ws://') ||
      msg.includes('[vite]') ||
      msg.includes('WebChannel') ||
      msg.includes('socket')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = typeof event.reason === 'object'
      ? String(event.reason?.message || event.reason?.stack || '')
      : String(event.reason || '');
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('websocket') ||
      reasonStr.includes('wss://') ||
      reasonStr.includes('ws://') ||
      reasonStr.includes('[vite]') ||
      reasonStr.includes('server connection lost') ||
      reasonStr.includes('WebChannel')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

// 2. Safely wrap performance.measure to prevent DataCloneError crashes in sandboxed iframe environments
if (typeof window !== 'undefined' && window.performance && typeof window.performance.measure === 'function') {
  const originalMeasure = window.performance.measure;
  window.performance.measure = function (name: string, startMarkOrOptions?: any, endMark?: string) {
    try {
      return originalMeasure.apply(this, arguments as any);
    } catch (e) {
      console.warn("performance.measure error intercepted safely:", e);
      return {
        name,
        entryType: 'measure',
        startTime: 0,
        duration: 0,
        detail: null,
        toJSON: () => ({})
      } as unknown as PerformanceMeasure;
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
