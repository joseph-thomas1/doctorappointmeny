// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import PatientDashboard from "../widgets/PatientDashboard";
import DoctorDashboard from "../widgets/DoctorDashboard";
import ProfileCard from "../widgets/ProfileCard";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function DashboardPage() {
  const auth = useAuth();
  const { currentUser, profile } = auth || {};
  const [myAppointments, setMyAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setMyAppointments([]);
      setDoctorAppointments([]);
      return;
    }

    // Patient's appointments
    const qPatient = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));
    const unsubP = onSnapshot(qPatient, (snap) => {
      setMyAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Doctor's appointments - ensure we match doctorId to the current user's uid
    let unsubD = () => {};
    if (profile && profile.role === "doctor") {
      const qDoctor = query(collection(db, "appointments"), where("doctorId", "==", currentUser.uid));
      unsubD = onSnapshot(qDoctor, (snap) => {
        setDoctorAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    }

    return () => {
      unsubP();
      unsubD();
    };
  }, [currentUser, profile]);

  async function handleCancel(appt) {
    try {
      const apptRef = doc(db, "appointments", appt.id);
      const apptISO = new Date(`${appt.date}T${appt.slot}:00`).getTime();
      const now = Date.now();
      if (now >= apptISO - 60 * 60 * 1000) {
        alert("Cannot cancel less than 1 hour before appointment.");
        return;
      }
      await updateDoc(apptRef, { status: "cancelled", cancelledAt: new Date().toISOString() });
      alert("Appointment cancelled.");
    } catch (err) {
      console.error("[DashboardPage] cancel failed", err);
      alert("Failed to cancel. Try again.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {/* Profile card + edit UI */}
      <ProfileCard />

      {/* Appointments */}
      {profile && profile.role === "doctor" ? (
        <DoctorDashboard appointments={doctorAppointments} />
      ) : (
        <PatientDashboard appointments={myAppointments} onCancel={handleCancel} />
      )}
    </div>
  );
}
