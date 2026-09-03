from fastapi import FastAPI
from pydantic import BaseModel, Field
from predict import predict

app = FastAPI(title="Smart Agriculture ML Service", version="1.0.0")


class PredictionInput(BaseModel):
    state: str
    district: str
    crop: str
    soilType: str
    irrigationType: str
    date: str
    temperature: float = Field(..., ge=-50, le=70)
    rainfall: float = Field(..., ge=0)
    humidity: float = Field(..., ge=0, le=100)
    previousYield: float = Field(..., ge=0)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.post("/predict")
def predict_route(data: PredictionInput):
    return predict(data.model_dump())
