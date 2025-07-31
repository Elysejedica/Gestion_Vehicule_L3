import React from 'react';

const Dashboard = ({ user, handleLogout }) => {
  /**
   * Render the user dashboard displaying username, email, role and logout button
   * @param {object} user - current logged-in user info
   * @param {function} handleLogout - logout handler function
   */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tableau de Bord</h2>

        <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rôle:</strong> {user.role}</p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Dashboard;