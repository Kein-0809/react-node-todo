import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header: React.FC = () => {
  // AuthContextからisAuthenticatedとlogout関数を取得します
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Todo App</Link>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="mr-4">Tasks</Link>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;