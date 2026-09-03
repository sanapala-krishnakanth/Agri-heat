import Prediction from "../models/Prediction.js";

function fallbackPrediction(input) {
  const heatwave = Math.max(
    0,
    Math.min(
      100,
      (input.temperature - 30) * 8 +
        Math.max(0, 60 - input.humidity) * 0.35 -
        Math.min(input.rainfall, 100) * 0.08
    )
  );

  const yieldLoss = Math.max(
    0,
    Math.min(
      100,
      heatwave * 0.75 +
        (input.previousYield < 2 ? 12 : 0) -
        (input.irrigationType === "Irrigated" ? 8 : 0)
    )
  );

  const riskLevel =
    yieldLoss >= 60 ? "HIGH" : yieldLoss >= 30 ? "MEDIUM" : "LOW";

  return {
    heatwaveProbability: Math.round(heatwave),
    yieldLossRisk: Math.round(yieldLoss),
    riskLevel,
    recommendation:
      riskLevel === "HIGH"
        ? "Increase irrigation, monitor the crop daily, and consider heat-protection measures."
        : riskLevel === "MEDIUM"
        ? "Monitor weather conditions and maintain adequate irrigation."
        : "Continue normal crop monitoring and irrigation practices.",
    model: "fallback-baseline"
  };
}

async function callMLService(input) {
  const url = `${
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8000"
  }/predict`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`ML service returned ${response.status}`);
  }

  return response.json();
}

export async function createPrediction(req, res) {
  try {
    const input = req.body;

    const required = [
      "state",
      "district",
      "crop",
      "soilType",
      "irrigationType",
      "date",
      "temperature",
      "rainfall",
      "humidity",
      "previousYield"
    ];

    for (const field of required) {
      if (input[field] === undefined || input[field] === "") {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    let prediction;

    try {
      prediction = await callMLService(input);
    } catch (error) {
      console.log("ML service unavailable. Using fallback prediction.");
      prediction = fallbackPrediction(input);
    }

    const saved = await Prediction.create({
      ...input,
      user: req.user.id,
      ...prediction
    });

    res.status(201).json({
      prediction: saved
    });
  } catch (error) {
    console.error("Prediction error:", error);

    res.status(500).json({
      message: error.message
    });
  }
}

export async function getPredictions(req, res) {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    const predictions = await Prediction.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      predictions
    });
  } catch (error) {
    console.error("Get predictions error:", error);

    res.status(500).json({
      message: error.message
    });
  }
}

export async function getStats(req, res) {
  try {
    const items = await Prediction.find({
      user: req.user.id
    }).select("riskLevel yieldLossRisk");

    const total = items.length;

    const highRisk = items.filter(
      item => item.riskLevel === "HIGH"
    ).length;

    const averageLoss = total
      ? Math.round(
          items.reduce(
            (sum, item) =>
              sum + (item.yieldLossRisk || 0),
            0
          ) / total
        )
      : 0;

    res.json({
      total,
      highRisk,
      averageLoss
    });
  } catch (error) {
    console.error("Get stats error:", error);

    res.status(500).json({
      message: error.message
    });
  }
}