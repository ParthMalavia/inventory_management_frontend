import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Navigation = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Auto Parts Inventory</div>
        {user ? (
          <div className="flex space-x-4">
            <Link to="/categories" className="text-white hover:text-gray-300">
              Categories
            </Link>
            <Link to="/inventory" className="text-white hover:text-gray-300">
              Inventory
            </Link>
            <Link to="/orders" className="text-white hover:text-gray-300">
              Orders
            </Link>
            <Link to="/users" className="text-white hover:text-gray-300">
              Users
            </Link>
            <Link to="/suppliers" className="text-white hover:text-gray-300">
              Suppliers
            </Link>
            <Link to="/customers" className="text-white hover:text-gray-300">
              Customers
            </Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-300">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;