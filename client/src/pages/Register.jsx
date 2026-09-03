import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Create account</h1>
        <label>Name<input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></label>
        <label>Password<input type="password" minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button">Register</button>
        <p className="muted">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
