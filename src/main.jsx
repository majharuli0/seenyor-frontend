import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ContextProvider from './Context/CustomContext';
import { HashRouter } from 'react-router-dom';
import { NotificationProvider } from './Context/useNotification';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './MonitoringService/Styles/base.css';
import QueryProvider from './MonitoringService/providers/QueryProvider.jsx';
import * as Sentry from '@sentry/react';
import './i18n';
import { LanguageProvider } from './Context/LanguageProvider';
Sentry.init({
  dsn: 'https://04163f3639feb9b9bfde187bf7ed91ae@o4508800437846017.ingest.de.sentry.io/4508889725272144',

  // 1. Add Network Info to every error
  beforeSend(event) {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      event.tags = {
        ...event.tags,
        'net.effectiveType': connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
        'net.rtt': connection.rtt, // Estimated Round Trip Time (latency in ms)
        'net.saveData': connection.saveData, // true/false (Data Saver mode)
        'net.downlink': connection.downlink, // Bandwidth estimate (Mb/s)
      };
    }
    return event;
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // ⚠️ WARNING: maskAllText: false is risky for passwords!
      maskAllText: false,
      blockAllMedia: false,
      // Ensure specific sensitive inputs are ALWAYS masked
      mask: ['input[type="password"]', '.private-data'],
      unblock: ['.sentry-unblock', '[data-sentry-unblock]'],
    }),
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      showBranding: false,
    }),
  ],

  // Tracing
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/api\.elderlycareplatform\.com\/api\/v1/],

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <ContextProvider>
      <LanguageProvider>
        <QueryProvider>
          <NotificationProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </NotificationProvider>
        </QueryProvider>
      </LanguageProvider>
    </ContextProvider>
  </HashRouter>
);
