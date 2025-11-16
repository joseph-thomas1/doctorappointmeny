// src/widgets/BookingPanel.jsx
import React from "react";
import { motion } from "framer-motion";

const sampleSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
];

export default function BookingPanel({
  date,
  existingAppointments = [],
  onBook,
  loading = false,
}) {
  return (
    <div className="mt-6">
      <h4 className="font-semibold">Available slots for {date}</h4>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {sampleSlots.map((slot) => {
          const taken = existingAppointments.some(
            (a) => a.slot === slot && a.status === "booked"
          );
          return (
            <motion.button
              key={slot}
              whileTap={{ scale: 0.96 }}
              onClick={() => onBook(slot)}
              disabled={taken || loading}
              className={`px-3 py-2 rounded-lg border text-sm ${
                taken ? "opacity-50 cursor-not-allowed line-through" : "hover:bg-gray-100"
              }`}
            >
              {slot} {taken ? " — Booked" : ""}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
