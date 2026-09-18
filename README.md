# 🌾 AgriHeat – AI-Based Agricultural Heatwave Risk Prediction

## 📌 Overview

AgriHeat is an AI-powered agricultural risk prediction platform designed to estimate the potential impact of extreme heat conditions on crop yield at the district level in India.

The platform combines weather data, crop information, soil characteristics, and machine learning to classify agricultural yield-loss risk into:

- 🟢 LOW
- 🟡 MEDIUM
- 🔴 HIGH

## 🎯 Problem Statement

Extreme heatwaves can significantly affect agricultural productivity, especially during critical crop growth stages.

Existing weather applications primarily provide temperature and rainfall information but do not directly explain how these conditions may affect agricultural yield.

AgriHeat aims to bridge this gap by providing crop-specific agricultural heat-risk insights at the district level.

## 💡 Solution

AgriHeat allows users to select:

- State
- District
- Crop
- Soil Type
- Irrigation Type
- Date

The system uses weather and agricultural inputs to estimate the potential yield-loss risk.

## ✨ Key Features

- 🌡️ Weather-based agricultural risk prediction
- 🌾 Crop-specific analysis
- 📍 District-level prediction
- 🗺️ India agricultural risk visualization
- 🤖 Machine learning-based prediction
- 🔴🟡🟢 Risk classification
- 👤 User authentication
- 📧 Email functionality
- 🤖 AI-powered features
- 📊 Prediction history
- 🌦️ Weather data integration

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Machine Learning
- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Joblib
- Random Forest

### AI / Services
- AI APIs
- Resend Email API
- Weather API

## 🏗️ System Architecture

```text
User
  ↓
React Frontend
  ↓
Express.js Backend
  ├── Authentication
  ├── MongoDB
  ├── AI Services
  └── Email Services
  ↓
FastAPI ML Service
  ↓
Machine Learning Model
  ↓
Yield-Loss Risk
  ↓
LOW / MEDIUM / HIGH
