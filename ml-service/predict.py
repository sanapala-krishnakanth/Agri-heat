
from pathlib import Path

import joblib
import numpy as np


BASE = Path(__file__).resolve().parent

MODEL_PATH = BASE / "models" / "yield_risk_ensemble.joblib"


def _fallback(data):
    heatwave = max(
        0,
        min(
            100,
            (float(data["temperature"]) - 30) * 8
            + max(0, 60 - float(data["humidity"])) * 0.35
            - min(float(data["rainfall"]), 100) * 0.08,
        ),
    )

    yield_loss = max(
        0,
        min(
            100,
            heatwave * 0.75
            + (12 if float(data["previousYield"]) < 2 else 0)
            - (
                8
                if str(data["irrigationType"]).lower() == "irrigated"
                else 0
            ),
        ),
    )

    level = (
        "HIGH" if yield_loss >= 60
        else "MEDIUM" if yield_loss >= 30
        else "LOW"
    )

    return {
        "heatwaveProbability": round(heatwave),
        "yieldLossRisk": round(yield_loss),
        "riskLevel": level,
        "recommendation": (
            "Increase irrigation, monitor the crop daily, "
            "and consider heat-protection measures."
            if level == "HIGH"
            else "Monitor weather conditions and maintain adequate irrigation."
            if level == "MEDIUM"
            else "Continue normal crop monitoring and irrigation practices."
        ),
        "model": "fallback-baseline",
    }


def predict(data):
    """
    Predict yield-loss risk using Random Forest,
    Gradient Boosting, and a Neural Network (MLP).
    """

    if not MODEL_PATH.exists():
        return _fallback(data)

    try:
        package = joblib.load(MODEL_PATH)

        # Prepare features in the same order used during training.
        features = package.get(
            "features",
            ["temperature", "rainfall", "humidity", "previousYield"],
        )

        X = np.array(
            [[float(data[feature]) for feature in features]],
            dtype=float,
        )

        # Random Forest prediction
        rf_prediction = float(
            package["rf_model"].predict(X)[0]
        )

        # Gradient Boosting prediction
        gb_prediction = float(
            package["gb_model"].predict(X)[0]
        )

        # Neural Network prediction
        nn_model = package.get("nn_model")

        if nn_model is not None:
            nn_prediction = float(nn_model.predict(X)[0])
        else:
            # Backward compatibility with an older two-model package.
            nn_prediction = None

        # Load the trained ensemble weights.
        rf_weight = float(package.get("rf_weight", 0.5))
        gb_weight = float(package.get("gb_weight", 0.5))

        if nn_prediction is not None:
            nn_weight = float(package.get("nn_weight", 1 / 3))

            prediction = (
                rf_weight * rf_prediction
                + gb_weight * gb_prediction
                + nn_weight * nn_prediction
            )

            model_name = "RF+GB+NN-Ensemble"

        else:
            prediction = (
                rf_weight * rf_prediction
                + gb_weight * gb_prediction
            )

            model_name = "RF+GB-Ensemble"

        # Keep the risk in the expected 0–100 range.
        yield_loss = max(0.0, min(100.0, prediction))

        # Existing temperature-based heatwave estimate.
        temperature = float(data["temperature"])
        heatwave = max(
            0.0,
            min(100.0, (temperature - 30) * 10),
        )

        # Classify yield-loss risk.
        level = (
            "HIGH" if yield_loss >= 60
            else "MEDIUM" if yield_loss >= 30
            else "LOW"
        )

        recommendation = (
            "Increase irrigation and apply appropriate heat-protection measures."
            if level == "HIGH"
            else "Monitor weather conditions and maintain adequate irrigation."
            if level == "MEDIUM"
            else "Continue normal crop monitoring."
        )

        return {
            "heatwaveProbability": round(heatwave),
            "yieldLossRisk": round(yield_loss),
            "riskLevel": level,
            "recommendation": recommendation,
            "model": model_name,
        }

    except (KeyError, TypeError, ValueError, OSError) as error:
        # Do not silently hide unexpected model or prediction problems.
        print(f"Ensemble prediction failed: {error}")
        return _fallback(data)
