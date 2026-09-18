import { getAgricultureAdvice } from "../services/aiService.js";
import { sendPredictionReport } from "../services/emailService.js";

export async function getAdvice(req, res) {
  try {
    const data = req.body;

    const required = [
      "state",
      "district",
      "crop",
      "soilType",
      "irrigationType",
      "temperature",
      "humidity",
      "rainfall",
      "heatwaveProbability",
      "yieldLossRisk",
      "riskLevel"
    ];

    for (const field of required) {
      if (data[field] === undefined || data[field] === "") {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    const advice = await getAgricultureAdvice(data);

    try {
      await sendPredictionReport({
        user: {
          name: req.user.name,
          email: req.user.email
        },
        prediction: data,
        aiAdvice: advice
      });

      console.log("Prediction report email sent successfully");

    } catch (emailError) {
      console.error(
        "Prediction email failed:",
        emailError.message
      );
    }

    res.json({
      success: true,
      advice
    });

  } catch (error) {
    console.error("AI advice error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate AI advice"
    });
  }
}