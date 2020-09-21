/* global SW_BASE_URL, SW_ENABLED, GA_ID, ga, SW_UPDATE_POPUP, SW_POPUP_COMPONENT */

import { useEffect } from 'react';
import { LazyLoadComponent } from '@app/LazyLoader';
import event from '@app/store';
import SWUpdateEvent from './SWUpdateEvent';

function usePwa() {
  // Info:Register service worker
  useEffect(()=>{
    const { register } = require('register-service-worker');

    register(`${SW_BASE_URL}service-worker.js`, {
      registrationOptions: {},
      ready () {
        console.log('[mdpress:sw] Service worker is active.');
        event.$emit('sw-ready');
      },

      cached (registration) {
        console.log('[mdpress:sw] Content has been cached for offline use.');
        event.$emit('sw-cached', new SWUpdateEvent(registration));
      },

      updated (registration) {
        console.log('[mdpress:sw] Content updated.');
        event.$emit('sw-updated', new SWUpdateEvent(registration));
      },

      offline () {
        console.log('[mdpress:sw] No internet connection found. App is running in offline mode.');
        event.$emit('sw-offline');
      },

      error (err) {
        console.error('[mdpress:sw] Error during service worker registration:', err);
        event.$emit('sw-error', err);
        if (GA_ID) {
          ga('send', 'exception', {
            exDescription: err.message,
            exFatal: false
          });
        }
      }
    });

  },[]);
}
export default async ({ isServer,sandbox,hooks }) => {
  if (SW_UPDATE_POPUP && SW_POPUP_COMPONENT === 'SWUpdatePopup') {
    sandbox.SWUpdatePopup = LazyLoadComponent(() => import('./SWUpdatePopup.js'));
  }
  if (process.env.NODE_ENV === 'production' && !isServer && SW_ENABLED) {
    // register-service-worker@1.7.0 references `window` in outer scope, so we have to import it dynamically in client
    hooks.push(usePwa);
  }
};
