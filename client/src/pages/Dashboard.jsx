import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, highRisk: 0, averageLoss: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/predictions/stats"),
      api.get("/predictions?limit=10")
    ]).then(([statsRes, historyRes]) => {
      setStats(statsRes.data);
      setHistory(historyRes.data.predictions || []);
    }).catch(() => {});
  }, []);

  const chartData = [...history].reverse().map((p, i) => ({
    name: i + 1,
    loss: p.yieldLossRisk
  }));

  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">AI-POWERED AGRICULTURE</p>
          <h1>Predict crop risk before heat becomes a crisis.</h1>
          <p className="hero-text">
            Analyze crop, soil, weather and location information to estimate heatwave
            and yield-loss risk.
          </p>
          <Link className="primary-button" to="/predict">Make a Prediction</Link>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard title="Predictions" value={stats.total} subtitle="Saved predictions" />
        <StatCard title="High-risk cases" value={stats.highRisk} subtitle="Risk level HIGH" />
        <StatCard title="Average yield loss" value={`${stats.averageLoss}%`} subtitle="Across predictions" />
      </div>

      <div className="card">
        <h2>Yield-loss trend</h2>
        {chartData.length === 0 ? (
          <p className="muted">No predictions yet. Create your first prediction.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#2f855a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
