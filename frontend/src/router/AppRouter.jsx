import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'
import Navbar       from '../components/layout/Navbar'
import Sidebar      from '../components/layout/Sidebar'
import Login        from '../pages/Login'
import Dashboard    from '../pages/Dashboard'
import Transactions from '../pages/Transactions'
import Budget       from '../pages/Budget'

const PrivateLayout = () => {
  const { isAuth } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  return (
    <div className="app-shell">
      <Navbar />
      <Sidebar />
      <main className="main-content"><Outlet /></main>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateLayout />}>
          <Route path="/"             element={<Dashboard />}    />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget"       element={<Budget />}       />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}