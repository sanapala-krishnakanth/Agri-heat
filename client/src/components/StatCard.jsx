import React from "react";

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="card stat-card">
      <p className="muted">{title}</p>
      <h2>{value}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </div>
  );
}
