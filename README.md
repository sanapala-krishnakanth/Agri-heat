# Smart Agriculture Management & Yield Risk Prediction

A full-stack starter application using React, Node.js, Express, MongoDB and a Python/FastAPI ML service.

## Architecture

React → Express/Node → MongoDB
                  ↘
                   FastAPI → ML model

## Features

- React dashboard
- JWT authentication
- MongoDB prediction history
- Crop/soil/weather prediction form
- Python FastAPI ML service
- Random Forest training script
- Fallback prediction when no trained model exists
- Recharts dashboard
- Responsive UI

## Prerequisites

Install:

- Node.js 18+
- Python 3.10+
- MongoDB local or MongoDB Atlas

## 1. Start MongoDB

For local MongoDB, make sure MongoDB is running.

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-agriculture
JWT_SECRET=change_this_to_a_long_random_secret
ML_SERVICE_URL=http://127.0.0.1:8000
```

## 2. Start the ML service

```bash
cd ml-service
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

Open:

http://127.0.0.1:8000/docs

## 3. Train the model

The included CSV is only a tiny demonstration dataset.

```bash
cd ml-service
python train.py
```

For a real project, replace `data/agriculture.csv` with a properly prepared dataset containing enough historical observations.

## 4. Start the Node.js backend

```bash
cd server
npm install
npm run dev
```

Backend:

http://localhost:5000

Health endpoint:

http://localhost:5000/api/health

## 5. Start React

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will show the frontend URL, normally:

http://localhost:5173

## API endpoints

### Auth

POST `/api/auth/register`

```json
{
  "name": "Krishna",
  "email": "krishna@example.com",
  "password": "password123"
}
```

POST `/api/auth/login`

```json
{
  "email": "krishna@example.com",
  "password": "password123"
}
```

### Prediction

POST `/api/predictions`

```json
{
  "state": "Tamil Nadu",
  "district": "Chennai",
  "crop": "Rice",
  "soilType": "Loamy",
  "irrigationType": "Irrigated",
  "date": "2026-08-25",
  "temperature": 38,
  "rainfall": 20,
  "humidity": 55,
  "previousYield": 3.5
}
```

GET `/api/predictions`

GET `/api/predictions/stats`

## Important ML note

The included training CSV is a toy dataset so that the project can run immediately.

For an academic/portfolio-quality model, collect and validate historical:

- temperature
- rainfall
- humidity
- soil properties
- crop
- district
- season
- irrigation
- historical yield
- heatwave indicators

Then perform proper preprocessing, feature engineering, cross-validation and evaluation.

Do not present the demo model's accuracy as real-world agricultural accuracy.

## Next upgrades

1. Add real weather API integration.
2. Add India district GeoJSON and a Leaflet risk map.
3. Add crop-specific models/features.
4. Add weather forecast ingestion.
5. Add admin dashboard.
6. Add email/SMS alerts.
7. Add model versioning and experiment tracking.
8. Deploy MongoDB Atlas + backend + ML API + frontend.
