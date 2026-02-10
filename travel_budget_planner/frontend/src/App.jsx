import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { LandingPage } from "@/pages/LandingPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ChatPage } from "@/pages/ChatPage"
import { AuthPage } from "@/pages/AuthPage"
import { DashboardLayout } from "@/layouts/DashboardLayout"

// Redirects authenticated users to dashboard if they try to access login pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null // or loading spinner

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route — Landing Page */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

          {/* Authentication Route */}
          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
