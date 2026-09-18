import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function getAgricultureAdvice(data) {
  const prompt = `
You are an AI agriculture advisor.

Give practical, simple and safe advice to a farmer based on the following crop-risk information.

Location:
State: ${data.state}
District: ${data.district}

Crop information:
Crop: ${data.crop}
Soil type: ${data.soilType}
Irrigation: ${data.irrigationType}

Weather:
Temperature: ${data.temperature}°C
Humidity: ${data.humidity}%
Rainfall: ${data.rainfall} mm

Prediction:
Heatwave probability: ${data.heatwaveProbability}%
Yield loss risk: ${data.yieldLossRisk}%
Risk level: ${data.riskLevel}

Return ONLY valid JSON in this exact format:

{
  "summary": "short explanation of the current crop situation",
  "actions": [
    "action 1",
    "action 2",
    "action 3"
  ],
  "priority": "LOW"
}

The priority must be exactly one of:
LOW
MEDIUM
HIGH

Give 3 to 5 practical recommendations.

Keep the language simple and easy for a farmer to understand.

Do not invent specific pesticide, fertilizer, or chemical doses.

Do not claim certainty about crop loss.

Base your advice on the supplied weather and prediction information.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}