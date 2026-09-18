import { sendPredictionReport } from "../services/emailService.js";

export async function sendPredictionEmail(
  req,
  res
) {
  try {
    const {
      prediction,
      aiAdvice
    } = req.body;

    if (!prediction) {
      return res.status(400).json({
        success: false,
        message: "Prediction data is required"
      });
    }

    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "User email not available"
      });
    }

    await sendPredictionReport({
      user: {
        name: req.user.name,
        email: req.user.email
      },
      prediction,
      aiAdvice
    });

    res.json({
      success: true,
      message: "Prediction report sent successfully"
    });

  } catch (error) {
    console.error(
      "Email error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to send prediction report"
    });
  }
}