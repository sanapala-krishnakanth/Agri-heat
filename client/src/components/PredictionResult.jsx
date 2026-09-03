import React from "react";

export default function PredictionResult({ result }) {
  if (!result) return null;

  const risk = result.riskLevel || "UNKNOWN";
  const riskClass = risk.toLowerCase();

  return (
    <div className="card result-card">
      <div className="result-header">
        <h2>Prediction Result</h2>
        <span className={`risk-badge ${riskClass}`}>{risk}</span>
      </div>

      <div className="result-grid">
        <div>
          <span className="muted">Heatwave probability</span>
          <strong>{result.heatwaveProbability}%</strong>
        </div>
        <div>
          <span className="muted">Yield loss risk</span>
          <strong>{result.yieldLossRisk}%</strong>
        </div>
      </div>

      <h3>Recommendation</h3>
      <p>{result.recommendation}</p>

      <p className="muted">
        Model: {result.model || "demo-model"} · Generated: {new Date(result.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
