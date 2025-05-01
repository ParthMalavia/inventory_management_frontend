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
import Suppliers from './components/Suppliers';
import Customers from './components/Customers';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import Orders from './components/Orders';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>}/>
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
