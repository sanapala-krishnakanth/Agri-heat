import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    state: { type: String, required: true },
    district: { type: String, required: true },
    crop: { type: String, required: true },
    soilType: { type: String, required: true },
    irrigationType: { type: String, required: true },
    date: { type: String, required: true },

    temperature: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    humidity: { type: Number, required: true },
    previousYield: { type: Number, required: true },

    heatwaveProbability: Number,
    yieldLossRisk: Number,
    riskLevel: String,
    recommendation: String,
    model: String
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);