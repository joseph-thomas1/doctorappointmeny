// src/pages/BookingPage.jsx
import React, { useEffect, useState } from "react";
import BookingPanel from "../widgets/BookingPanel";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  doc,
  runTransaction,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export default function BookingPage({ date, setDate }) {
  const auth = useAuth();
  const { currentUser, profile } = auth || {};
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // load doctors and patients lists
  useEffect(() => {
    async function loadLists() {
      try {
        const qDoctors = query(collection(db, "users"), where("role", "==", "doctor"));
        const qPatients = query(collection(db, "users"), where("role", "==", "patient"));

        const [docsSnap, patsSnap] = await Promise.all([getDocs(qDoctors), getDocs(qPatients)]);
        const doctorList = docsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const patientList = patsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDoctors(doctorList);
        setPatients(patientList);

        // default selections:
        if (profile && profile.role === "doctor") {
          setSelectedDoctorId(currentUser?.uid || null); // doctor books under their uid
          if (patientList.length > 0) setSelectedPatientId(patientList[0].id);
        } else {
          if (doctorList.length > 0) setSelectedDoctorId(doctorList[0].id);
          setSelectedPatientId(currentUser?.uid || null); // patient books for self
        }
      } catch (err) {
        console.error("[BookingPage] load lists failed", err);
      }
    }
    loadLists();
  }, [currentUser, profile]);

  // listen to appointments for the selected doctor & date
  useEffect(() => {
    if (!selectedDoctorId || !date) {
      setExistingAppointments([]);
      return;
    }
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", selectedDoctorId),
      where("date", "==", date),
      where("status", "==", "booked")
    );
    const unsub = onSnapshot(q, (snap) => {
      setExistingAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selectedDoctorId, date]);

  async function handleBook(slot) {
    // determine patient and doctor
    const doctorId = selectedDoctorId;
    const patientId = selectedPatientId;

    if (!doctorId || !patientId) {
      alert("Select both doctor and patient (doctors must choose a patient).");
      return;
    }

    // If the current user is a patient, ensure they are booking for themselves
    if (profile?.role !== "doctor" && patientId !== currentUser?.uid) {
      alert("You can only book for your own account.");
      return;
    }

    setLoading(true);
    try {
      const safeSlot = slot.replace(":", "-");
      const apptId = `${doctorId}_${date}_${safeSlot}`;
      const apptRef = doc(db, "appointments", apptId);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(apptRef);
        if (snap.exists()) throw new Error("Slot already booked");

        const appointmentDate = new Date(`${date}T${slot}:00`);
        // get doctor and patient names from lists
        const doctorName = (doctors.find((d) => d.id === doctorId)?.displayName) || "";
        const patientName = (patients.find((p) => p.id === patientId)?.displayName) || "";

        const payload = {
          doctorId,
          doctorName,
          patientId,
          patientName,
          date,
          slot,
          status: "booked",
          createdAt: serverTimestamp(),
          appointmentTs: Timestamp.fromMillis(appointmentDate.getTime()),
        };

        tx.set(apptRef, payload);
      });

      alert(`Booked ${slot} on ${date}`);
    } catch (err) {
      console.error("[BookingPage] booking failed", err);
      alert(err.message || "Failed to book slot. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDoctor = profile?.role === "doctor";

  return (
    <div>
      <h2 className="text-2xl font-bold">Book an appointment</h2>

      <div className="mt-4 grid md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-sm block">Date</label>
          <input className="border rounded px-3 py-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm block">{isDoctor ? "Doctor (you)" : "Choose doctor"}</label>
          {isDoctor ? (
            <div className="py-2 text-sm">{profile.displayName || currentUser?.email}</div>
          ) : (
            <select value={selectedDoctorId || ""} onChange={(e) => setSelectedDoctorId(e.target.value)} className="border rounded px-3 py-2">
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.displayName || d.email || d.id}</option>)}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm block">{isDoctor ? "Select patient" : "Patient"}</label>
          {isDoctor ? (
            <select value={selectedPatientId || ""} onChange={(e) => setSelectedPatientId(e.target.value)} className="border rounded px-3 py-2">
              {patients.map((p) => <option key={p.id} value={p.id}>{p.displayName || p.email || p.id}</option>)}
            </select>
          ) : (
            <div className="py-2 text-sm">{profile?.displayName || currentUser?.email}</div>
          )}
        </div>
      </div>

      <BookingPanel date={date} existingAppointments={existingAppointments} onBook={handleBook} loading={loading} />
    </div>
  );
}
