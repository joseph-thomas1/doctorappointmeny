// src/App.jsx
import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import BookingPage from './pages/BookingPage'
import DashboardPage from './pages/DashboardPage'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import ProtectedRoute from './routes/ProtectedRoute'

const MOCK_DOCTOR = { id: 'doc_1', name: 'Dr. Maya Nair', specialization: 'General Physician' }

export default function App() {
    const navigate = useNavigate()
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

    return (
        <div className="min-h-screen flex flex-col">
            <Header onNav={(p) => navigate(p)} />

            <main className="flex-1 container py-8">
                <Routes>
                    <Route path="/" element={<Homepage onNav={(p) => navigate(p)} />} />

                    {/* Auth pages */}
                    <Route path="/auth/signin" element={<SignIn />} />
                    <Route path="/auth/signup" element={<SignUp />} />
                    

                    {/* Protected routes */}
                    <Route
                        path="/book"
                        element={
                            <ProtectedRoute>
                                <BookingPage doctor={MOCK_DOCTOR} date={date} setDate={setDate} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback to home */}
                    <Route path="*" element={<Homepage onNav={(p) => navigate(p)} />} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}
