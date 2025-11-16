// src/widgets/ProfileCard.jsx
import React, { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileCard() {
  const auth = useAuth()
  const { currentUser, profile } = auth || {}
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gender: profile.gender || '',
        age: profile.age || '',
        specialization: profile.specialization || '',
        qualification: profile.qualification || '',
        yearsExperience: profile.yearsExperience || '',
        clinic: profile.clinic || '',
      })
    }
  }, [profile])

  if (!profile) return null

  const role = profile.role || 'patient'

  async function handleSave(e) {
    e && e.preventDefault()
    if (!currentUser) return
    setSaving(true)
    try {
      const updates = {
        displayName: form.displayName,
        phone: form.phone,
        address: form.address,
      }
      if (role === 'patient') {
        updates.gender = form.gender
        updates.age = form.age
      } else if (role === 'doctor') {
        updates.specialization = form.specialization
        updates.qualification = form.qualification
        updates.yearsExperience = form.yearsExperience
        updates.clinic = form.clinic
      }

      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, updates)

      setEditing(false)
      alert('Profile updated.')
    } catch (err) {
      console.error('Profile update failed', err)
      alert('Failed to update profile. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 rounded-lg border bg-white mb-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-semibold">
          {profile.displayName ? profile.displayName.split(' ').map(s=>s[0]).slice(0,2).join('') : (profile.email || '').charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{profile.displayName || profile.email}</h3>
              <div className="text-sm text-gray-600">Role: {profile.role}</div>
            </div>

            {!editing ? (
              <div className="flex gap-2">
                <button onClick={() => setEditing(true)} className="px-3 py-1 rounded border">Edit</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} disabled={saving} className="px-3 py-1 rounded border">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-3 py-1 rounded bg-indigo-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div><strong>Email</strong><div className="text-gray-700">{profile.email || '—'}</div></div>
              <div><strong>Phone</strong><div className="text-gray-700">{profile.phone || '—'}</div></div>

              {role === 'patient' && (
                <>
                  <div><strong>Gender</strong><div className="text-gray-700">{profile.gender || '—'}</div></div>
                  <div><strong>Age</strong><div className="text-gray-700">{profile.age || '—'}</div></div>
                  <div className="col-span-2"><strong>Address</strong><div className="text-gray-700">{profile.address || '—'}</div></div>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <div><strong>Specialization</strong><div className="text-gray-700">{profile.specialization || '—'}</div></div>
                  <div><strong>Clinic</strong><div className="text-gray-700">{profile.clinic || '—'}</div></div>
                  <div><strong>Qualification</strong><div className="text-gray-700">{profile.qualification || '—'}</div></div>
                  <div><strong>Experience (yrs)</strong><div className="text-gray-700">{profile.yearsExperience || '—'}</div></div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="mt-3 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1">Full name</label>
                  <input value={form.displayName || ''} onChange={(e)=>setForm({...form, displayName: e.target.value})} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-xs block mb-1">Phone</label>
                  <input value={form.phone || ''} onChange={(e)=>setForm({...form, phone: e.target.value})} className="w-full border rounded px-2 py-1" />
                </div>
              </div>

              {role === 'patient' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs block mb-1">Gender</label>
                      <select value={form.gender || ''} onChange={(e)=>setForm({...form, gender: e.target.value})} className="w-full border rounded px-2 py-1">
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Age</label>
                      <input type="number" value={form.age || ''} onChange={(e)=>setForm({...form, age: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Phone (alt)</label>
                      <input value={form.phone || ''} onChange={(e)=>setForm({...form, phone: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs block mb-1">Address</label>
                    <input value={form.address || ''} onChange={(e)=>setForm({...form, address: e.target.value})} className="w-full border rounded px-2 py-1" />
                  </div>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <div>
                    <label className="text-xs block mb-1">Specialization</label>
                    <input value={form.specialization || ''} onChange={(e)=>setForm({...form, specialization: e.target.value})} className="w-full border rounded px-2 py-1" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs block mb-1">Qualification</label>
                      <input value={form.qualification || ''} onChange={(e)=>setForm({...form, qualification: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Years exp.</label>
                      <input type="number" value={form.yearsExperience || ''} onChange={(e)=>setForm({...form, yearsExperience: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Clinic</label>
                      <input value={form.clinic || ''} onChange={(e)=>setForm({...form, clinic: e.target.value})} className="w-full border rounded px-2 py-1" />
                    </div>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
