from pathlib import Path
import joblib
import numpy as np

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "models" / "yield_risk_model.joblib"


def _fallback(data):
    heatwave = max(
        0,
        min(
            100,
            (data["temperature"] - 30) * 8
            + max(0, 60 - data["humidity"]) * 0.35
            - min(data["rainfall"], 100) * 0.08,
        ),
    )

    yield_loss = max(
        0,
        min(
            100,
            heatwave * 0.75
            + (12 if data["previousYield"] < 2 else 0)
            - (8 if data["irrigationType"].lower() == "irrigated" else 0),
        ),
    )

    level = "HIGH" if yield_loss >= 60 else "MEDIUM" if yield_loss >= 30 else "LOW"

    return {
        "heatwaveProbability": round(heatwave),
        "yieldLossRisk": round(yield_loss),
        "riskLevel": level,
        "recommendation": (
            "Increase irrigation, monitor the crop daily, and consider heat-protection measures."
            if level == "HIGH"
            else "Monitor weather conditions and maintain adequate irrigation."
            if level == "MEDIUM"
            else "Continue normal crop monitoring and irrigation practices."
        ),
        "model": "fallback-baseline",
    }


def predict(data):
    # If a trained model exists, use it.
    # Expected model output: yield-loss probability/value in percentage.
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        X = np.array([[
            float(data["temperature"]),
            float(data["rainfall"]),
            float(data["humidity"]),
            float(data["previousYield"]),
        ]])

        prediction = float(model.predict(X)[0])
        yield_loss = max(0, min(100, prediction))
        heatwave = max(0, min(100, (data["temperature"] - 30) * 10))
        level = "HIGH" if yield_loss >= 60 else "MEDIUM" if yield_loss >= 30 else "LOW"

        return {
            "heatwaveProbability": round(heatwave),
            "yieldLossRisk": round(yield_loss),
            "riskLevel": level,
            "recommendation": (
                "Increase irrigation and apply heat-protection measures."
                if level == "HIGH"
                else "Monitor weather and maintain adequate irrigation."
                if level == "MEDIUM"
                else "Continue normal crop monitoring."
            ),
            "model": "yield_risk_model.joblib",
        }

    return _fallback(data)
