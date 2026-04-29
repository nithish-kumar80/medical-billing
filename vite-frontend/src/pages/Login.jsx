import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register form
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient"
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/login", loginForm);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/redirect";
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/register", regForm);
      // Auto-switch to login after successful registration
      setMode("login");
      setLoginForm({ email: regForm.email, password: "" });
      setRegForm({ name: "", email: "", password: "", phone: "", role: "patient" });
      setError("");
      alert("Registration successful! Please login with your credentials.");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Med System</h1>
          <p className="text-gray-500 mt-1">Hospital Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                mode === "login"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                mode === "register"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* LOGIN FORM */}
              {mode === "login" && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Signing in...</>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => { setMode("register"); setError(""); }} className="text-blue-600 font-semibold hover:underline">
                      Create one
                    </button>
                  </p>
                </motion.form>
              )}

              {/* REGISTER FORM */}
              {mode === "register" && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegForm({ ...regForm, role: "patient" })}
                        className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                          regForm.role === "patient"
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        🧑 Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegForm({ ...regForm, role: "doctor" })}
                        className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                          regForm.role === "doctor"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        🩺 Doctor
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> Creating Account...</>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-blue-600 font-semibold hover:underline">
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© 2026 Med System — Hospital Management Portal</p>
      </motion.div>
    </div>
  );
}

export default Login;