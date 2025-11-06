import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Product Management</Link>
        </div>
        {isAuthenticated && (
          <div className="nav-links">
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/products/new" className="nav-link">
              Add Product
            </Link>
          </div>
        )}
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 