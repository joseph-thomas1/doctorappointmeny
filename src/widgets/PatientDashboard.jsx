import React from 'react'
import { motion } from 'framer-motion'


function combineDateSlotToISO(dateISO, slot) {
    return new Date(dateISO + 'T' + slot + ':00').toISOString()
}


function isCancellable(appointmentISO) {
    const ap = new Date(appointmentISO).getTime()
    const now = Date.now()
    return now < ap - 60 * 60 * 1000
}


export default function PatientDashboard({ appointments, onCancel }) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h3 className="font-bold text-xl mb-4">Your Appointments</h3>
            <div className="space-y-3">
                {(!appointments || appointments.length === 0) && <p className="text-gray-600">No appointments yet — book one from the homepage.</p>}
                {appointments && appointments.map((ap) => (
                    <motion.div key={ap.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <div className="font-semibold">{ap.doctorName} — {ap.date} @ {ap.slot}</div>
                            <div className="text-sm text-gray-600">Status: {ap.status}</div>
                        </div>
                        <div>
                            <button onClick={() => onCancel(ap)} disabled={!isCancellable(combineDateSlotToISO(ap.date, ap.slot))} className={`px-3 py-1 rounded ${isCancellable(combineDateSlotToISO(ap.date, ap.slot)) ? 'border' : 'opacity-50 cursor-not-allowed'}`}>
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}