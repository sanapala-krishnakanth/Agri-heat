import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Login</h1>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button">Login</button>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
