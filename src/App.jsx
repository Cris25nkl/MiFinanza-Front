import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import NavigationBar from './components/Navbar'
import './App.css'

function AppRoutes({ user, handleLogin, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      {user && <NavigationBar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route 
          path="/login" 
          element={
            user 
              ? <Navigate to="/dashboard" /> 
              : <Login onLogin={handleLogin} onShowRegister={() => navigate('/register')} /> 
          }
        />
        <Route 
          path="/register" 
          element={
            user 
              ? <Navigate to="/dashboard" /> 
              : <Register onRegister={handleLogin} onShowLogin={() => navigate('/login')} />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
        <Route 
          path="*" 
          element={<div style={{textAlign: 'center', marginTop: '3rem'}}><h2>404 - Página no encontrada</h2></div>} 
        />
      </Routes>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <Router>
      <AppRoutes user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  )
}

export default App
