# 🌾 AgriHeat – AI-Based Agricultural Heatwave Risk Prediction

## 📌 Overview

AgriHeat is an AI-powered agricultural risk assessment platform designed to estimate potential heatwave impacts and crop yield-loss risk at the district level across India.

The platform integrates weather data, agricultural inputs, machine learning, and AI-powered advisory features to help users understand potential risks and make informed farming decisions.

It uses a three-model machine learning ensemble consisting of **Random Forest, Gradient Boosting, and a Neural Network (MLP)** to estimate yield-loss risk and classify it into:

- 🟢 **LOW**
- 🟡 **MEDIUM**
- 🔴 **HIGH**

## 🎯 Problem Statement

Extreme heatwaves, high temperatures, and insufficient rainfall can negatively affect crop growth and agricultural productivity.

Traditional weather applications primarily report weather conditions without directly translating them into agricultural risk insights.

AgriHeat aims to bridge this gap by combining local weather information and agricultural inputs to provide district-level heatwave risk estimates, yield-loss risk assessments, and practical agricultural guidance.

## 💡 Solution

AgriHeat provides a user-friendly platform where users can select:

- State and district
- Crop
- Soil type
- Irrigation type
- Prediction date

The application retrieves weather information through its weather integration and combines it with agricultural inputs, including previous yield, to generate a risk assessment.

The machine learning service evaluates the input data using three trained models and combines their predictions into a yield-loss risk estimate. The application then classifies the risk and provides recommendations.

## ✨ Key Features

- 🌡️ Weather-based heatwave risk estimation
- 🌾 Crop and agricultural input-based risk assessment
- 📍 District-level agricultural risk analysis
- 🗺️ India agricultural risk visualization
- 🤖 Three-model machine learning ensemble
- 🌳 Random Forest regression
- 📈 Gradient Boosting regression
- 🧠 Neural Network (MLP) regression
- 🔴🟡🟢 LOW, MEDIUM, and HIGH risk classification
- 🌦️ Automatic weather data integration
- 💬 AI-powered agricultural advisory
- 👤 User registration and authentication
- 🔐 JWT-based authentication
- 📧 Email functionality using Resend
- 📊 Prediction history and statistics
- ☁️ Cloud deployment using Vercel
- 🗄️ MongoDB Atlas database integration

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

### Machine Learning
- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Joblib
- Random Forest Regressor
- Gradient Boosting Regressor
- Multi-Layer Perceptron (MLP) Neural Network
- StandardScaler

### AI and External Services
- Gemini API for AI-powered advisory
- Open-Meteo weather integration
- Resend Email API

### Deployment and Development
- Vercel
- Git and GitHub
- VS Code
- Python virtual environment

## 🧠 Machine Learning Approach

AgriHeat uses three regression models to estimate yield-loss risk.

### 1. Random Forest Regressor
Trains multiple decision trees and combines their predictions to model relationships between weather conditions and yield-loss risk.

### 2. Gradient Boosting Regressor
Builds trees sequentially, with later trees learning to correct errors made by earlier trees.

### 3. Neural Network (MLP)
Uses a feed-forward neural network with two hidden layers containing 32 and 16 neurons. The model uses feature standardization and learns nonlinear relationships between the input features and the target.

### 4. Three-Model Ensemble
The current implementation combines the three model predictions using equal weights:

**Final Risk = (Random Forest + Gradient Boosting + Neural Network) / 3**

The ensemble output is bounded to the 0–100 range and classified as:

- **LOW:** below 30
- **MEDIUM:** 30 to below 60
- **HIGH:** 60 or above

The current heatwave estimate is calculated separately using a temperature-based formula; it is not the output of the three-model ensemble.

## 📊 Model Training and Evaluation

The training dataset contains 10,000 valid rows and is divided into:

- **80% training data:** 8,000 rows
- **20% testing data:** 2,000 rows

The models are evaluated using:

- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- R² score

The trained models, ensemble weights, and evaluation metrics are saved in a Joblib model package for use by the FastAPI prediction service.

**Evaluation note:** The current yield-loss-risk target was generated from a formula using input-related variables. Therefore, the reported metrics measure how well the models reproduce that constructed target; they do not establish real-world crop-loss prediction accuracy.

## 🏗️ System Architecture

```text
User
  ↓
React Frontend (Vite)
  ↓
Express.js Backend
  ├── User Authentication (JWT)
  ├── MongoDB Atlas
  ├── Weather Integration
  ├── Gemini AI Advisory
  └── Resend Email Service
  ↓
FastAPI ML Service
  ↓
Input Feature Preparation
  ↓
  ├── Random Forest
  ├── Gradient Boosting
  └── Neural Network (MLP)
  ↓
Three-Model Ensemble
  ↓
Yield-Loss Risk Estimate
  ↓
LOW / MEDIUM / HIGH
  ↓
Recommendation and Frontend Display
```

## 🔄 Prediction Workflow

1. The user selects a state, district, crop, soil type, irrigation type, and date.
2. The application retrieves available weather information.
3. The backend prepares the required prediction inputs.
4. Express.js sends the prediction request to FastAPI.
5. The three trained regression models estimate yield-loss risk.
6. The model predictions are combined using the saved ensemble weights.
7. The application calculates a separate heatwave estimate and classifies the yield-loss risk.
8. The AI advisory service can provide additional farming guidance.
9. The backend stores prediction information in MongoDB when the request and authentication flow support it.
10. The frontend displays the prediction, risk level, and recommendation.

## 🌍 Expected Benefits

- Helps users identify potentially risky heat and weather conditions.
- Translates weather information into understandable agricultural risk estimates.
- Supports early planning and crop monitoring.
- Provides a foundation for district-level agricultural decision support.
- Combines machine learning, weather data, and AI advisory capabilities in one platform.

AgriHeat is intended to support agricultural decisions, not replace official weather alerts, agronomists, or locally validated agricultural guidance.

## 🚀 Future Improvements

- Validate predictions against independently measured crop yields and real crop-loss records.
- Compare the three-model ensemble against individual models on independent datasets.
- Add crop growth stages and historical weather patterns.
- Improve heatwave probability calibration using validated weather observations.
- Add explainable AI to show which factors contribute most to each risk prediction.
- Improve district-level weather coverage and missing-data handling.
- Evaluate the model across different crops, seasons, and regions of India.

## 👨‍💻 Project Goal

AgriHeat aims to demonstrate how full-stack development, weather integration, machine learning, and AI-powered advisory can work together to provide accessible agricultural risk information and support more informed farming decisions.
