/* AURA demo authentication.
 * GitHub Pages is static hosting: this is a browser-only demonstration, NOT production auth.
 * Do not use real passwords or sensitive personal data here.
 */
(() => {
  "use strict";

  const USERS_KEY = "auraUsers";
  const SESSION_KEY = "aura_user";

  function readUsers() {
    try {
      const value = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function getField(id) {
    return document.getElementById(id);
  }

  function showMessage(message) {
    window.alert(message);
  }

  const Auth = {
    register() {
      const nameEl = getField("registerName");
      const emailEl = getField("registerEmail");
      const passwordEl = getField("registerPassword");
      const termsEl = getField("termsCheck");

      if (!nameEl || !emailEl || !passwordEl) {
        showMessage("Registration form could not be loaded. Please refresh and try again.");
        return;
      }

      const name = nameEl.value.trim();
      const email = emailEl.value.trim().toLowerCase();
      const password = passwordEl.value;

      if (!name || !email || !password) {
        showMessage("Please complete all required fields.");
        return;
      }
      if (password.length < 8) {
        showMessage("Please use a password with at least 8 characters.");
        passwordEl.focus();
        return;
      }
      if (termsEl && !termsEl.checked) {
        showMessage("Please accept the Terms & Conditions and Privacy Policy.");
        return;
      }

      const users = readUsers();
      if (users.some(user => (user.email || "").toLowerCase() === email)) {
        showMessage("This email is already registered. Please log in.");
        return;
      }

      // Demo only: plaintext localStorage is not secure authentication.
      users.push({ name, email, password });
      try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      } catch {
        showMessage("Your browser could not save this demo account. Check storage settings.");
        return;
      }

      showMessage("Registration successful! Please log in using this same website address.");
      window.location.href = "login.html";
    },

    login() {
      const emailEl = getField("loginEmail");
      const passwordEl = getField("loginPassword");
      if (!emailEl || !passwordEl) {
        showMessage("Login form could not be loaded. Please refresh and try again.");
        return;
      }

      const email = emailEl.value.trim().toLowerCase();
      const password = passwordEl.value;
      if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
      }

      const user = readUsers().find(item =>
        (item.email || "").toLowerCase() === email && item.password === password
      );

      if (!user) {
        showMessage("Account not found or password is incorrect. If you registered on localhost, please register again on the GitHub Pages website.");
        return;
      }

      const session = { name: user.name, email: user.email };
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.setItem("auth_user", JSON.stringify(session));
      } catch {
        showMessage("Your browser could not save the login session. Check storage settings.");
        return;
      }

      showMessage("Login successful!");
      window.location.href = "index.html";
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("auth_user");
      window.location.href = "login.html";
    },

    getUser() {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      } catch {
        return null;
      }
    },

    isLoggedIn() {
      return Boolean(this.getUser());
    }
  };

  window.Auth = Auth;
})();
