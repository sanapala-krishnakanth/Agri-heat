import React from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.css";

function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link className="brand" to="/">🌾 Agri Heat</Link>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/predict">Predict</NavLink>
          <NavLink to="/history">History</NavLink>
          {token ? (
            <button className="link-button" onClick={logout}>Logout</button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
