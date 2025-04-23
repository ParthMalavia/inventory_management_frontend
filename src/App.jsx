import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Inventory from './components/Inventory';
import Categories from './components/Categories';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>

      </div>
    </AuthProvider>
  )
}

export default App
