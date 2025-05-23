import './styles.css';
import Router from './utils/router.js';
import { subscribePushNotification } from './utils/notification-helper.js';

document.addEventListener('DOMContentLoaded', () => {
  Router.init();

    window.addEventListener('hashchange', () => {
    if (window.currentAddStoryPresenter) {
      console.log('[GLOBAL] hashchange: Mematikan kamera');
      window.currentAddStoryPresenter.destroy();
      window.currentAddStoryPresenter = null;
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered', reg);

      const token = localStorage.getItem('token');
      if (token) {
        await subscribePushNotification(reg, token);
      } else {
        console.warn('Token tidak ditemukan, tidak dapat subscribe notifikasi.');
      }
    } catch (err) {
      console.error('SW registration failed', err);
    }
  });
}
