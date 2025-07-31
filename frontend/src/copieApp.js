import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { apiService } from './apiService';

import Menu from './components/menu';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import AddVehicule from './components/addvehiculeform';
import AddProprietaire from './components/addproprietaireform';
import AddCentrevisite from './components/addcentrvisite';
import Addtrajet from './components/addtrajet';
import AddVidange from './components/addvidange';
import AddRavitaillement from './components/addravitailler';
import AddReparation from './components/addreparation';
import AddPiece from './components/addpieces';
import Assurance from './components/assurance';
import CarteGriseList from './components/ListeVehicule';

const AuthWrapper = ({
  isLogin,
  setIsLogin,
  loginForm,
  registerForm,
  loading,
  error,
  handleInputChange,
  handleLogin,
  handleRegister,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentPath === '/register' ? 'Inscription' : 'Connexion'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 px-4 ${currentPath === '/login' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            <a href="/login">Connexion</a>
          </button>
          <button
            className={`flex-1 py-2 px-4 ${currentPath === '/register' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            <a href="/register">Inscription</a>
          </button>
        </div>

        {currentPath === '/register' ? (
          <Register
            registerForm={registerForm}
            loading={loading}
            handleInputChange={handleInputChange}
            handleRegister={handleRegister}
          />
        ) : (
          <Login
            loginForm={loginForm}
            loading={loading}
            handleInputChange={handleInputChange}
            handleLogin={handleLogin}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'utilisateur',
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (token) verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await apiService.get('/hello/', { headers: { Authorization: `Bearer ${token}` } });
      setIsAuthenticated(true);
    } catch {
      setToken('');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }));
    } else if (form === 'register') {
      setRegisterForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/auth/login/', loginForm);
      const data = response.data || response;

      if (data && data.token) {
        setToken(data.token);
        setRefreshToken(data.refresh_token || '');
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      await apiService.post('/auth/register/', {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        role: registerForm.role,
      });
      alert('Inscription réussie! Vous pouvez maintenant vous connecter.');
      setIsLogin(true);
      setRegisterForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'utilisateur',
      });
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    setRefreshToken('');
    setLoginForm({ username: '', password: '' });
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route
            path="*"
            element={
              <AuthWrapper
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                loginForm={loginForm}
                registerForm={registerForm}
                loading={loading}
                error={error}
                handleInputChange={handleInputChange}
                handleLogin={handleLogin}
                handleRegister={handleRegister}
              />
            }
          />
        </Routes>
      ) : (
        <div style={{ padding: '20px' }}>
          <Menu user={user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<CarteGriseList />} />
            <Route path="/add" element={<AddVehicule />} />
            <Route path="/add-proprietaire" element={<AddProprietaire />} />
            <Route path="/add-centrevisite" element={<AddCentrevisite />} />
            <Route path="/add-trajet" element={<Addtrajet />} />
            <Route path="/add-vidange" element={<AddVidange />} />
            <Route path="/add-ravitaillement" element={<AddRavitaillement />} />
            <Route path="/add-reparation" element={<AddReparation />} />
            <Route path="/add-piece" element={<AddPiece />} />
            <Route path="/add-assurance" element={<Assurance />} />
            <Route path="/dashboard" element={<Dashboard user={user} handleLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
