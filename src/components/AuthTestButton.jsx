// src/components/AuthTestButton.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthTestButton() {
  const auth = useAuth();
  const tryBuiltin = async () => {
    console.log('[AuthTestButton] calling auth.login via context');
    if (!auth || typeof auth.login !== 'function') {
      console.warn('[AuthTestButton] auth/login not available', auth);
      return;
    }
    try {
      const res = await auth.login({ email: 'TEST_EMAIL', password: 'TEST_PASS' });
      console.log('[AuthTestButton] login result', res);
    } catch (err) {
      console.error('[AuthTestButton] login error', err);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Quick test (temporary):</div>
      <button onClick={tryBuiltin} style={{ marginTop: 6, padding: '6px 10px' }}>
        Test login via context (uses placeholder creds)
      </button>
      <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
        Also use <code>window.__authDebug.login(email, pass)</code> in console.
      </div>
    </div>
  );
}
