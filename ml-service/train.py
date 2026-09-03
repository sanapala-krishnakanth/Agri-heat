from pathlib import Path
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "data" / "agriculture.csv"
MODEL_DIR = BASE / "models"
MODEL_DIR.mkdir(exist_ok=True)

FEATURES = ["temperature", "rainfall", "humidity", "previousYield"]
TARGET = "yieldLossRisk"


def train():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"{DATA_PATH} not found. Put your training CSV in ml-service/data/agriculture.csv"
        )

    df = pd.read_csv(DATA_PATH)
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")

    df = df[FEATURES + [TARGET]].dropna()

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=250,
        random_state=42,
        max_depth=12
    )

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    print("MAE:", mean_absolute_error(y_test, predictions))
    print("R2 :", r2_score(y_test, predictions))

    output = MODEL_DIR / "yield_risk_model.joblib"
    joblib.dump(model, output)
    print(f"Saved model to {output}")


if __name__ == "__main__":
    train()
