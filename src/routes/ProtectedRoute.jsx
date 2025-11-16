import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


// usage: <ProtectedRoute><YourComponent/></ProtectedRoute>
// or to require role: <ProtectedRoute requireRole="doctor">...
export default function ProtectedRoute({ children, requireRole = null }) {
const { currentUser, profile, loading } = useAuth()


if (loading) return null // or a spinner


if (!currentUser) {
return <Navigate to="/auth/signin" replace />
}


if (requireRole && profile && profile.role !== requireRole) {
// unauthorized, redirect to dashboard or show message
return <Navigate to="/dashboard" replace />
}


return children
}