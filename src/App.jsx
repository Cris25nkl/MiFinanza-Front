import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'

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
    localStorage.setItem('token', userData.stringify.token) // Assuming userData has a token property;

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
