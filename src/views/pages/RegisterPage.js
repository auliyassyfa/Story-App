// src/pages/RegisterPage.js

import AuthModel from '../../models/AuthModel.js';

const RegisterPage = {
  async render() {
    return `
      <section id="form">
        <h2>Register</h2>
        <form id="registerForm">
          <div>
            <label for="name">Nama:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
        <p id="registerMessage"></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    const message = document.getElementById('registerMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      const model = new AuthModel('https://story-api.dicoding.dev/v1');

      try {
        const result = await model.register(name, email, password);
        message.style.color = 'green';
        message.textContent = 'Registrasi berhasil! Silakan login.';

        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } catch (error) {
        message.style.color = 'red';
        message.textContent = 'Registrasi gagal: ' + error.message;
      }
    });
  }
};

export default RegisterPage;
