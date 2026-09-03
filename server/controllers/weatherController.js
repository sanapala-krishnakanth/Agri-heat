import { getWeatherData } from "../services/weatherService.js";

export async function getWeather(req, res) {
  try {
    const { state, district, date } = req.query;

    if (!state || !district || !date) {
      return res.status(400).json({
        success: false,
        message: "state, district and date are required"
      });
    }

    const result = await getWeatherData(
      state,
      district,
      date
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(
      "Weather controller error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}