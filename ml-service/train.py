
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
)
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


# ---------------------------------------------------------
# PATHS AND CONFIGURATION
# ---------------------------------------------------------
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


# ---------------------------------------------------------
# EVALUATION HELPER
# ---------------------------------------------------------
def evaluate_model(name, y_true, predictions):
    mae = mean_absolute_error(y_true, predictions)
    rmse = np.sqrt(mean_squared_error(y_true, predictions))
    r2 = r2_score(y_true, predictions)

    print(f"\n========== {name} ==========")
    print(f"MAE:  {mae:.6f}")
    print(f"RMSE: {rmse:.6f}")
    print(f"R2:   {r2:.6f}")

    return {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "R2": float(r2),
    }


# ---------------------------------------------------------
# TRAIN ALL MODELS
# ---------------------------------------------------------
def train():

    # 1. Check dataset
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"{DATA_PATH} not found. "
            "Place agriculture.csv in ml-service/data/"
        )

    # 2. Load dataset
    df = pd.read_csv(DATA_PATH)

    missing = [
        column
        for column in FEATURES + [TARGET]
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing columns in agriculture.csv: {missing}"
        )

    # Convert required columns to numeric and remove invalid rows
    df = df[FEATURES + [TARGET]].copy()

    for column in FEATURES + [TARGET]:
        df[column] = pd.to_numeric(
            df[column], errors="coerce"
        )

    df = df.replace([np.inf, -np.inf], np.nan).dropna()

    if len(df) < 10:
        raise ValueError(
            "Dataset has too few valid rows. "
            "At least 10 valid rows are required."
        )

    X = df[FEATURES]
    y = df[TARGET]

    print("\n====================================")
    print("AGRIHEAT MODEL TRAINING")
    print("====================================")
    print(f"Valid dataset rows: {len(df)}")
    print(f"Training rows: {int(len(df) * 0.8)}")
    print(f"Testing rows: {len(df) - int(len(df) * 0.8)}")
    print("Training percentage: 80%")
    print("Testing percentage: 20%")

    # 3. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    # -----------------------------------------------------
    # MODEL 1: RANDOM FOREST
    # -----------------------------------------------------
    print("\nTraining Random Forest...")

    rf_model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        max_depth=12,
        n_jobs=-1,
    )

    rf_model.fit(X_train, y_train)
    rf_predictions = rf_model.predict(X_test)

    # -----------------------------------------------------
    # MODEL 2: GRADIENT BOOSTING
    # -----------------------------------------------------
    print("Training Gradient Boosting...")

    gb_model = GradientBoostingRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=3,
        random_state=42,
    )

    gb_model.fit(X_train, y_train)
    gb_predictions = gb_model.predict(X_test)

    # -----------------------------------------------------
    # MODEL 3: NEURAL NETWORK
    # -----------------------------------------------------
    print("Training Neural Network (MLP)...")

    nn_model = make_pipeline(
        StandardScaler(),
        MLPRegressor(
            hidden_layer_sizes=(32, 16),
            activation="relu",
            solver="adam",
            learning_rate_init=0.001,
            max_iter=1000,
            early_stopping=True,
            random_state=42,
        ),
    )

    nn_model.fit(X_train, y_train)
    nn_predictions = nn_model.predict(X_test)

    # -----------------------------------------------------
    # EVALUATE EACH MODEL
    # -----------------------------------------------------
    results = {}

    results["Random Forest"] = evaluate_model(
        "RANDOM FOREST",
        y_test,
        rf_predictions,
    )

    results["Gradient Boosting"] = evaluate_model(
        "GRADIENT BOOSTING",
        y_test,
        gb_predictions,
    )

    results["Neural Network"] = evaluate_model(
        "NEURAL NETWORK (MLP)",
        y_test,
        nn_predictions,
    )

    # -----------------------------------------------------
    # THREE-MODEL ENSEMBLE
    # -----------------------------------------------------
    # Initial equal weights: 1/3 for each model.
    # Compare against individual models before relying on it.
    rf_weight = 1 / 3
    gb_weight = 1 / 3
    nn_weight = 1 / 3

    ensemble_predictions = (
        rf_weight * rf_predictions
        + gb_weight * gb_predictions
        + nn_weight * nn_predictions
    )

    results["Three-Model Ensemble"] = evaluate_model(
        "RF + GB + NEURAL NETWORK ENSEMBLE",
        y_test,
        ensemble_predictions,
    )

    # -----------------------------------------------------
    # SAVE MODEL PACKAGE
    # -----------------------------------------------------
    model_package = {
        "rf_model": rf_model,
        "gb_model": gb_model,
        "nn_model": nn_model,
        "rf_weight": rf_weight,
        "gb_weight": gb_weight,
        "nn_weight": nn_weight,
        "features": FEATURES,
        "target": TARGET,
        "metrics": results,
    }

    output = MODEL_DIR / "yield_risk_ensemble.joblib"

    joblib.dump(model_package, output)

    print("\n====================================")
    print("ALL MODELS TRAINED SUCCESSFULLY")
    print(f"Saved model package: {output}")
    print("====================================")

    print(
        "\nNote: R2 is not a percentage accuracy score. "
        "Evaluate against independently measured crop-loss "
        "outcomes before making real-world accuracy claims."
    )


if __name__ == "__main__":
    train()
