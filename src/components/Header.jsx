// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

// Icons
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.5 14.5V11a6.5 6.5 0 10-13 0v3.5c0 .538-.214 1.055-.595 1.441L3 17h5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const unreadNotifications = 3; // demo badge

  const userDisplay =
    auth?.profile?.displayName ||
    auth?.currentUser?.displayName ||
    auth?.profile?.email ||
    auth?.currentUser?.email;

  async function handleSignOut() {
    try {
      await auth.logout();
      navigate("/");
    } catch (err) {
      alert("Sign out failed");
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-md bg-white/60 border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LEFT — Clickable Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow"
                style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)" }}
              >
                H
              </motion.div>

              <div className="hidden md:flex flex-col leading-tight">
                <span className="font-extrabold text-lg">HealHub</span>
                <span className="text-xs text-gray-600">Modern care, human touch</span>
              </div>
            </div>

            {/* CENTER — Search bar (desktop only) */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <div className="w-full max-w-xl flex items-center bg-white border shadow-sm rounded-full px-3 py-2">
                <IconSearch className="text-gray-400" />
                <input
                  className="flex-1 ml-2 outline-none text-sm"
                  placeholder="Search doctors, clinics, specialities…"
                />
                <button className="ml-3 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm">
                  Search
                </button>
              </div>
            </div>

            {/* RIGHT — Navigation + User */}
            <div className="flex items-center gap-3">

              {/* Notification */}
              <div className="relative hidden sm:block">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <IconBell className="text-gray-700" />
                </button>
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-2">
                <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100">Home</Link>
                <Link to="/book" className="px-3 py-2 rounded-md hover:bg-gray-100">Book</Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100">Dashboard</Link>
              </div>

              {/* Authenticated user menu */}
              {auth?.currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenUser(!openUser)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center text-sm font-semibold">
                      {userDisplay?.slice(0, 1)?.toUpperCase()}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openUser && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 6 }}
                        exit={{ opacity: 0, scale: 0.9, y: -6 }}
                        className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border w-48"
                      >
                        <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                        <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/auth/signup" className="px-3 py-1 rounded border">Sign up</Link>
                  <Link to="/auth/signin" className="px-3 py-1 rounded bg-white border">Sign in</Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button onClick={() => setOpenMenu(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMenu(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">Menu</div>
                <button className="p-2 hover:bg-gray-100 rounded" onClick={() => setOpenMenu(false)}>
                  <IconClose />
                </button>
              </div>

              <nav className="flex flex-col gap-1 text-sm">
                <Link to="/" onClick={() => setOpenMenu(false)} className="px-3 py-2 hover:bg-gray-50 rounded">Home</Link>
                <Link to="/book" onClick={() => setOpenMenu(false)} className="px-3 py-2 hover:bg-gray-50 rounded">Book</Link>
                <Link to="/dashboard" onClick={() => setOpenMenu(false)} className="px-3 py-2 hover:bg-gray-50 rounded">Dashboard</Link>
                {!auth?.currentUser && (
                  <>
                    <Link to="/auth/signup" onClick={() => setOpenMenu(false)} className="px-3 py-2 hover:bg-gray-50 rounded">Sign up</Link>
                    <Link to="/auth/signin" onClick={() => setOpenMenu(false)} className="px-3 py-2 hover:bg-gray-50 rounded">Sign in</Link>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
