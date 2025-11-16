// src/pages/Auth/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // patient-specific
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // doctor-specific
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [clinic, setClinic] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!displayName || !email || !password) {
      setError("Please fill name, email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email,
        password,
        displayName,
        role,
        // patient
        gender,
        age,
        phone,
        address,
        // doctor
        specialization,
        qualification,
        yearsExperience,
        clinic,
        doctorPhone,
      };

      await auth.signup(payload);
      // navigate to dashboard after signup
      navigate("/dashboard");
    } catch (err) {
      console.error("SignUp failed", err);
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create account</h2>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm block mb-1">Full name</label>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm">Register as:</label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="patient" checked={role === "patient"} onChange={() => setRole("patient")} /> Patient
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="doctor" checked={role === "doctor"} onChange={() => setRole("doctor")} /> Doctor
          </label>
        </div>

        {/* Patient fields */}
        {role === "patient" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm block mb-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-2 py-1">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="text-sm block mb-1">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        )}

        {/* Doctor fields */}
        {role === "doctor" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm block mb-1">Specialization</label>
              <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm block mb-1">Qualification</label>
                <input value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">Years exp.</label>
                <input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="text-sm block mb-1">Phone</label>
                <input value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="text-sm block mb-1">Clinic / Hospital</label>
              <input value={clinic} onChange={(e) => setClinic(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        )}

        <div>
          <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-indigo-600 text-white rounded">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}
