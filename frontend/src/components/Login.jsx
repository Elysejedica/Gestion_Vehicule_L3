import React from 'react';
import { Link } from 'react-router-dom';
//import './login.css';

const Login = ({ loginForm, loading, handleInputChange, handleLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={loginForm.username}
            onChange={(e) => handleInputChange('login', 'username', e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={loginForm.password}
            onChange={(e) => handleInputChange('login', 'password', e.target.value)}
            className="login-input"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors">
            Pas encore inscrit ? Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
