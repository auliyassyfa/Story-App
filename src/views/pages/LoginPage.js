// src/pages/LoginPage.js
import AuthModel from '../../models/AuthModel.js';

const LoginPage = {
  async render() {
    return `
      <section id="form">
        <h2>Login</h2>
        <form id="loginForm">
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <p id="loginMessage"></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;

      const model = new AuthModel('https://story-api.dicoding.dev/v1');

      try {
        const response = await model.login(email, password);

        const { token, userId, name } = response.loginResult;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);

        message.style.color = 'green';
        message.textContent = 'Login berhasil!';

        window.location.hash = '/';
      } catch (error) {
        message.style.color = 'red';
        message.textContent = 'Login gagal: ' + error.message;
      }
    });
  }
};

export default LoginPage;
