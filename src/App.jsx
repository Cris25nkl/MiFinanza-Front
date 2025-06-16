import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import StatisticsPage from './components/StatisticsPage'
import NavigationBar from './components/Navbar'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [transactions, setTransactions] = useState([])

  const handleLogin = (userData) => {
    // Aquí normalmente harías una llamada a la API para verificar las credenciales
    setUser(userData)
  }

  const handleRegister = (userData) => {
    // Aquí normalmente harías una llamada a la API para registrar al usuario
    setUser(userData)
  }

  const handleShowRegister = () => {
    setShowRegister(true)
  }

  const handleShowLogin = () => {
    setShowRegister(false)
  }

  const handleShowStatistics = () => {
    setShowStatistics(true)
  }

  const handleBackToDashboard = () => {
    setShowStatistics(false)
  }

  const handleNewTransaction = (transaction) => {
    setTransactions([...transactions, transaction])
  }

  const handleLogout = () => {
    setUser(null)
    setShowStatistics(false)
    setTransactions([])
  }

  return (
    <div className="App">
      {!user ? (
        showRegister ? (
          <Register onRegister={handleRegister} onShowLogin={handleShowLogin} />
        ) : (
          <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />
        )
      ) : (
        <>
          <NavigationBar user={user} onLogout={handleLogout} />
          {showStatistics ? (
            <StatisticsPage 
              transactions={transactions} 
              onBack={handleBackToDashboard} 
            />
          ) : (
            <Dashboard 
              user={user} 
              onShowStatistics={handleShowStatistics}
              onNewTransaction={handleNewTransaction}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
