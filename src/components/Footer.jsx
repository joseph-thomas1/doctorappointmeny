// src/components/Footer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ---------- Simple SVG social icons ---------- */
function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 2a4.48 4.48 0 00-4.49 4.48c0 .35.04.7.12 1.03A12.72 12.72 0 013 4.1s-4 9 5 13a13 13 0 01-8 2c12 7 27 0 27-16.5v-.75A9.34 9.34 0 0023 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 6.5h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Footer component ---------- */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    setMessage("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: wire to your backend / Mailchimp / Firebase function
      await new Promise((r) => setTimeout(r, 900)); // fake delay
      setMessage("Thanks — you're subscribed!");
      setEmail("");
    } catch (err) {
      console.error("subscribe failed", err);
      setMessage("Failed to subscribe. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">

          {/* ABOUT */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow">H</div>
              <div>
                <div className="text-lg font-extrabold">HealHub</div>
                <div className="text-sm text-slate-300">Care that moves with you</div>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              HealHub connects patients and doctors for fast, secure appointments and easy follow-ups. Built with privacy and speed in mind.
            </p>

            <div className="flex gap-3 mt-2">
              <motion.a whileHover={{ y: -3 }} href="#" aria-label="Twitter" className="p-2 rounded-md hover:bg-white/5">
                <IconTwitter />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" aria-label="Facebook" className="p-2 rounded-md hover:bg-white/5">
                <IconFacebook />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" aria-label="Instagram" className="p-2 rounded-md hover:bg-white/5">
                <IconInstagram />
              </motion.a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/book" className="hover:text-white">Book appointment</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/auth/signin" className="hover:text-white">Sign in</Link></li>
              <li><Link to="/auth/signup" className="hover:text-white">Create account</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a className="hover:text-white" href="#">Help center</a></li>
              <li><a className="hover:text-white" href="#">Privacy policy</a></li>
              <li><a className="hover:text-white" href="#">Terms of service</a></li>
              <li><a className="hover:text-white" href="#">Developer API</a></li>
            </ul>

            <div className="mt-6">
              <h5 className="text-xs text-slate-400 mb-2">Clinic partners</h5>
              <div className="flex items-center gap-2">
                <img src="https://cdn.vectorstock.com/i/1000v/10/71/hospital-building-icon-vector-13881071.jpg" alt="medco" className="h-6 grayscale opacity-80" />
                <img src="https://media.istockphoto.com/id/1396260353/vector/map-pointer-with-hospital-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=mkJwUNAVAI92GVxz_23gr23p6gmrocN9GnZhg_mBIr8=" alt="care" className="h-6 grayscale opacity-80" />
              </div>
            </div>
          </div>

          {/* CONTACT / NEWSLETTER */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Stay in touch</h4>

            <p className="text-sm text-slate-300 mb-3">
              Subscribe for appointment tips and occasional updates — we never spam.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={submitting} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {message && <div className="mt-2 text-xs text-slate-300">{message}</div>}

            <div className="mt-6 text-sm text-slate-400">
              <div><strong>Email:</strong> support@healhub.example</div>
              <div className="mt-1"><strong>Phone:</strong> +1 (555) 123-4567</div>
              <div className="mt-1"><strong>Address:</strong> 123 Health St, Wellness City</div>
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} HealHub. All rights reserved.
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <span className="mx-2">•</span>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>

          <div className="text-sm text-slate-400 flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white">Contact</a>
              <a href="#" className="text-slate-400 hover:text-white">Support</a>
            </div>

            <div className="flex items-center gap-3">
              <a className="text-slate-400 hover:text-white" href="#" aria-label="Twitter"><IconTwitter /></a>
              <a className="text-slate-400 hover:text-white" href="#" aria-label="Facebook"><IconFacebook /></a>
              <a className="text-slate-400 hover:text-white" href="#" aria-label="Instagram"><IconInstagram /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
