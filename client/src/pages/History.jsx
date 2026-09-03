import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    api.get("/predictions?limit=50")
      .then(res => setPredictions(res.data.predictions || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">HISTORY</p>
        <h1>Prediction History</h1>
      </div>

      <div className="card table-wrapper">
        {predictions.length === 0 ? (
          <p className="muted">No prediction history available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Crop</th>
                <th>Risk</th>
                <th>Yield loss</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.district}, {p.state}</td>
                  <td>{p.crop}</td>
                  <td><span className={`risk-badge ${p.riskLevel.toLowerCase()}`}>{p.riskLevel}</span></td>
                  <td>{p.yieldLossRisk}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
