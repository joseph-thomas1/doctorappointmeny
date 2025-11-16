import React from 'react'
import { motion } from 'framer-motion'


export default function DoctorDashboard({ appointments }) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h3 className="font-bold text-xl mb-4">Today's Appointments</h3>
            <div className="space-y-3">
                {(!appointments || appointments.length === 0) && <p className="text-gray-600">No appointments scheduled today.</p>}
                {appointments && appointments.map((ap) => (
                    <motion.div key={ap.id} whileHover={{ scale: 1.01 }} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold">{ap.patientName} — {ap.date} @ {ap.slot}</div>
                                <div className="text-sm text-gray-600">Contact: {ap.patientPhone || '—'}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}