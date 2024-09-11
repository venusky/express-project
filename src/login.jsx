import React, { useState } from 'react';
import './login.css'; // Assuming you'll move the CSS to this file

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await fetch('https://api.express.ci/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { token } = data;
      localStorage.setItem('token', token);
      window.location.href = '/dashboard'; // Redirect user

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="login-container">
      <img
        className="logo"
        src="https://placehold.co/720/000000/FFF?text=XP&font=Inter"
        alt="Logo Express"
      />
      <h2>Connexion à Express</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <img
            src="https://flagcdn.com/w20/ci.png"
            alt="Drapeau de la Côte d'Ivoire"
            className="flag-icon"
          />
          <input
            type="text"
            className="login-input"
            placeholder="Numéro de téléphone"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <input
          type="password"
          className="login-input"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se Connecter'}
        </button>
        {error && <p className="error-message text-red">Le mot de passe ou le numéro de téléphone n'est pas correct</p>}
        <a href="#" className="forgot-password">Mot de passe oublié ?</a>
      </form>
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      <div className="login-footer">
        <p>© 2024 Express Technologie. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Login;
