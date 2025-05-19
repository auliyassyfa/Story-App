// src/models/AuthModel.js

class AuthModel {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    async login(email, password) {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Login gagal');
      }
  
      return result;
    }

    async register(name, email, password) {
        const response = await fetch(`${this.baseUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.message || 'Registrasi gagal');
        }
    
        return result;
      }
  }
  
  export default AuthModel;
  