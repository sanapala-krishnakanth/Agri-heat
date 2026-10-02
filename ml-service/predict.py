from pathlib import Path

import joblib
import numpy as np


BASE = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE
    / "models"
    / "yield_risk_ensemble.joblib"
)


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
            - (
                8
                if data["irrigationType"].lower() == "irrigated"
                else 0
            ),
        ),
    )

    level = (
        "HIGH"
        if yield_loss >= 60
        else "MEDIUM"
        if yield_loss >= 30
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
    Predict agricultural yield-loss risk using the
    Random Forest + Gradient Boosting ensemble.
    """

    # ---------------------------------------------------------
    # LOAD TRAINED ENSEMBLE
    # ---------------------------------------------------------
    if MODEL_PATH.exists():

        package = joblib.load(MODEL_PATH)

        rf_model = package["rf_model"]
        gb_model = package["gb_model"]

        rf_weight = package["rf_weight"]
        gb_weight = package["gb_weight"]

        # -----------------------------------------------------
        # PREPARE INPUT FEATURES
        # -----------------------------------------------------
        X = np.array(
            [[
                float(data["temperature"]),
                float(data["rainfall"]),
                float(data["humidity"]),
                float(data["previousYield"]),
            ]]
        )

        # -----------------------------------------------------
        # RANDOM FOREST PREDICTION
        # -----------------------------------------------------
        rf_prediction = float(
            rf_model.predict(X)[0]
        )

        # -----------------------------------------------------
        # GRADIENT BOOSTING PREDICTION
        # -----------------------------------------------------
        gb_prediction = float(
            gb_model.predict(X)[0]
        )

        # -----------------------------------------------------
        # ENSEMBLE PREDICTION
        # -----------------------------------------------------
        prediction = (
            rf_weight * rf_prediction
            + gb_weight * gb_prediction
        )

        yield_loss = max(
            0,
            min(100, prediction)
        )

        # -----------------------------------------------------
        # HEATWAVE ESTIMATION
        # -----------------------------------------------------
        heatwave = max(
            0,
            min(
                100,
                (float(data["temperature"]) - 30) * 10
            )
        )

        # -----------------------------------------------------
        # RISK LEVEL
        # -----------------------------------------------------
        level = (
            "HIGH"
            if yield_loss >= 60
            else "MEDIUM"
            if yield_loss >= 30
            else "LOW"
        )

        # -----------------------------------------------------
        # RECOMMENDATION
        # -----------------------------------------------------
        recommendation = (
            "Increase irrigation and apply heat-protection measures."
            if level == "HIGH"
            else "Monitor weather and maintain adequate irrigation."
            if level == "MEDIUM"
            else "Continue normal crop monitoring."
        )

        return {
            "heatwaveProbability": round(heatwave),
            "yieldLossRisk": round(yield_loss),
            "riskLevel": level,
            "recommendation": recommendation,
            "model": "RF+GB-Ensemble",
        }

    # ---------------------------------------------------------
    # FALLBACK
    # ---------------------------------------------------------
    return _fallback(data)