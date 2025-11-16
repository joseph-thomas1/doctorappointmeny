// src/pages/Auth/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthTestButton from '../../components/AuthTestButton'

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!auth) throw new Error("Auth context not available");
      await auth.login({ email, password });
      console.log("[SignIn] login success", email);
      navigate("/dashboard");
    } catch (err) {
      console.error("[SignIn] login failed", err);
      const msg = mapFirebaseError(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function mapFirebaseError(err) {
    const code = err?.code || "";
    switch (code) {
      case "auth/user-not-found":
        return "No account found with that email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/network-request-failed":
        return "Network error — check your internet connection.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        return err?.message || "Sign in failed";
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Sign in</h2>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
    </div>
  );
}
