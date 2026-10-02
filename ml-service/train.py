from pathlib import Path
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "data" / "agriculture.csv"
MODEL_DIR = BASE / "models"
MODEL_DIR.mkdir(exist_ok=True)

FEATURES = [
    "temperature",
    "rainfall",
    "humidity",
    "previousYield",
]

TARGET = "yieldLossRisk"
def train():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"{DATA_PATH} not found. "
            "Put your training CSV in ml-service/data/agriculture.csv"
        )

    # Load dataset
    df = pd.read_csv(DATA_PATH)

    # Check required columns
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]

    if missing:
        raise ValueError(f"Missing columns: {missing}")

    # Keep required columns and remove missing rows
    df = df[FEATURES + [TARGET]].dropna()

    X = df[FEATURES]
    y = df[TARGET]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    # ---------------------------------------------------------
    # MODEL 1: RANDOM FOREST
    # ---------------------------------------------------------
    rf_model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        max_depth=12,
        n_jobs=-1
    )

    rf_model.fit(X_train, y_train)

    rf_predictions = rf_model.predict(X_test)

    # ---------------------------------------------------------
    # MODEL 2: GRADIENT BOOSTING
    # ---------------------------------------------------------
    gb_model = GradientBoostingRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=3,
        random_state=42
    )

    gb_model.fit(X_train, y_train)

    gb_predictions = gb_model.predict(X_test)

    # ---------------------------------------------------------
    # ENSEMBLE
    # ---------------------------------------------------------
    # Equal-weight ensemble for the initial version.
    # We can optimize these weights later using validation results.
    rf_weight = 0.5
    gb_weight = 0.5

    ensemble_predictions = (
        rf_weight * rf_predictions
        + gb_weight * gb_predictions
    )

    # ---------------------------------------------------------
    # EVALUATION
    # ---------------------------------------------------------
    print("\n========== RANDOM FOREST ==========")
    print(
        "MAE:",
        mean_absolute_error(y_test, rf_predictions)
    )
    print(
        "RMSE:",
        np.sqrt(mean_squared_error(y_test, rf_predictions))
    )
    print(
        "R2:",
        r2_score(y_test, rf_predictions)
    )

    print("\n========== GRADIENT BOOSTING ==========")
    print(
        "MAE:",
        mean_absolute_error(y_test, gb_predictions)
    )
    print(
        "RMSE:",
        np.sqrt(mean_squared_error(y_test, gb_predictions))
    )
    print(
        "R2:",
        r2_score(y_test, gb_predictions)
    )

    print("\n========== ENSEMBLE ==========")
    print(
        "MAE:",
        mean_absolute_error(y_test, ensemble_predictions)
    )
    print(
        "RMSE:",
        np.sqrt(mean_squared_error(y_test, ensemble_predictions))
    )
    print(
        "R2:",
        r2_score(y_test, ensemble_predictions)
    )

    # ---------------------------------------------------------
    # SAVE BOTH MODELS + ENSEMBLE WEIGHTS
    # ---------------------------------------------------------
    model_package = {
        "rf_model": rf_model,
        "gb_model": gb_model,
        "rf_weight": rf_weight,
        "gb_weight": gb_weight,
        "features": FEATURES,
    }

    output = MODEL_DIR / "yield_risk_ensemble.joblib"

    joblib.dump(model_package, output)

    print("\n====================================")
    print(f"Saved ensemble model to: {output}")
    print("====================================")


if __name__ == "__main__":
    train()