// src/pages/Homepage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Homepage - shows welcome + booking CTA when signed in.
 * Paste into src/pages/Homepage.jsx (overwrite).
 */

const heroBg =
  "https://images.unsplash.com/photo-1580281657529-0b8b4f4f0a86?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b6fe03f4d0a9b6a1c9a3b6f0d0c4a7b";

export default function Homepage() {
  const auth = useAuth();
  const profile = auth?.profile;
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-xl"
        aria-hidden={false}
      >
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{
            backgroundImage:
              `linear-gradient(180deg, rgba(15,23,42,0.55), rgba(255,255,255,0.12)), url(${heroBg})`,
            filter: "saturate(0.95) contrast(1.02)",
          }}
        />

        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
                Care that fits your life — <span className="text-pink-300">book</span>,{" "}
                <span className="text-indigo-300">connect</span>, recover.
              </h1>
              <p className="mt-4 text-gray-100 max-w-xl">
                HealHub brings trusted doctors, easy scheduling and secure records together in one modern app.
              </p>

              {/* If signed in -> show welcome card only. If not -> show signup/signin CTAs */}
              <div className="mt-6">
                {profile ? (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="inline-flex items-center gap-4 bg-white/90 rounded-2xl p-4 shadow"
                  >
                    <div className="flex flex-col">
                      <div className="text-lg font-bold text-slate-800">
                        Welcome back, {profile.displayName || profile.email} 👋
                      </div>
                      <div className="text-sm text-slate-600">
                        {profile.role === "doctor"
                          ? "Manage your patients and appointments from your dashboard."
                          : "Book a new appointment or view upcoming visits in your dashboard."}
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => navigate("/book")}
                        className="px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow"
                      >
                        Book an appointment
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/auth/signup"
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg"
                    >
                      Get Started (Sign up)
                    </Link>
                    <Link
                      to="/auth/signin"
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-full border bg-white/90 text-slate-800"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right panel (visual/demo) */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/90 rounded-2xl p-6 shadow-xl max-w-md mx-auto">
                <div className="text-sm text-gray-600 mb-2">Quick demo — find a slot</div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="p-2 border rounded"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                    <select className="p-2 border rounded">
                      <option>Any doctor</option>
                      <option>General Physician</option>
                      <option>Dermatologist</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="p-2 border rounded">09:00</button>
                    <button className="p-2 border rounded">09:30</button>
                    <button className="p-2 border rounded">10:00</button>
                  </div>
                  <div className="text-xs text-gray-500">Sign up to make a real booking.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES (kept minimal for this update) */}
      <section className="container mx-auto px-4">
        <motion.h3 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold mb-6">
          Built for patients & doctors
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div whileHover={{ y: -6 }} className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">📅</div>
              <div>
                <div className="font-semibold">Fast bookings</div>
                <div className="text-sm text-gray-600 mt-1">Pick date & time and confirm in seconds.</div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div whileHover={{ y: -6 }} className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">🩺</div>
              <div>
                <div className="font-semibold">Verified doctors</div>
                <div className="text-sm text-gray-600 mt-1">Profiles with qualifications and clinic details.</div>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div whileHover={{ y: -6 }} className="p-6 bg-white rounded-2xl shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">🔒</div>
              <div>
                <div className="font-semibold">Secure records</div>
                <div className="text-sm text-gray-600 mt-1">Encrypted medical records, patient-controlled access.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
