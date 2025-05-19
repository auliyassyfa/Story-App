import HomePage from '../views/pages/HomePage.js';
import AddStoryPage from '../views/pages/AddStoryPage.js';
import LoginPage from '../views/pages/LoginPage.js';
import RegisterPage from '../views/pages/RegisterPage.js';


const routes = {
  '/': HomePage,
  '/add-story': AddStoryPage,
  '/login': LoginPage,
  '/register': RegisterPage,
};

const Router = {
  init() {
    this.loadPage = this.loadPage.bind(this);
    window.addEventListener('hashchange', this.loadPage);

    const logoutLink = document.getElementById('nav-logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.hash = '/login';
        this.updateNavbarAuthLinks();
      });
    }

    this.loadPage();
    this.updateNavbarAuthLinks();
  },

  async loadPage() {
    const path = window.location.hash.slice(1) || '/';
    const token = localStorage.getItem('token');
  
    if (token && (path === '/login' || path === '/register')) {
      window.location.hash = '/';
      return;
    }
  
    if (!token && (path !== '/login' && path !== '/register')) {
      window.location.hash = '/login';
      return;
    }
  
    const page = routes[path];
    if (page) {
      const main = document.getElementById('main-content');
  
      // Tambahan: View Transition
      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          main.innerHTML = await page.render();
          await page.afterRender();
          this.updateNavbarAuthLinks();
        });
      } else {
        // Fallback biasa tanpa animasi
        main.innerHTML = await page.render();
        await page.afterRender();
        this.updateNavbarAuthLinks();
      }
    }
  },
  

  updateNavbarAuthLinks() {
    const token = localStorage.getItem('token');

    const homeLink = document.getElementById('nav-home');
    const loginLink = document.getElementById('nav-login');
    const addLink = document.getElementById('nav-add');
    const registerLink = document.getElementById('nav-register');
    const logoutLink = document.getElementById('nav-logout');

    if (loginLink) loginLink.style.display = token ? 'none' : 'inline-block';
    if (registerLink) registerLink.style.display = token ? 'none' : 'inline-block';
    if (addLink) addLink.style.display = token ?  'inline-block' : 'none';
    if (homeLink) homeLink.style.display = token ?  'inline-block' : 'none';
    if (logoutLink) logoutLink.style.display = token ? 'inline-block' : 'none';
  },
};


export default Router;
