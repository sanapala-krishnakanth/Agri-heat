import React, { useEffect, useState } from "react";
import api from "../services/api";
import PredictionResult from "../components/PredictionResult";
import IndiaWeatherMap from "../components/IndiaWeatherMap";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const districtsByState = {
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ],

  "Andhra Pradesh": [
    "Anakapalli",
    "Anantapur",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Konaseema",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "Nellore",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari"
  ],

  "Karnataka": [
    "Bagalkot",
    "Ballari",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Belagavi",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir"
  ],

  "Kerala": [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad"
  ],

  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri"
  ]
};

const crops = [
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Groundnut",
  "Soybean",
  "Millets",
  "Pulses",
  "Potato",
  "Tomato",
  "Onion"
];

const soilTypes = [
  "Loamy",
  "Clay",
  "Sandy",
  "Silty",
  "Black Soil",
  "Red Soil",
  "Alluvial Soil"
];

const irrigationTypes = [
  "Irrigated",
  "Rainfed",
  "Drip Irrigation",
  "Sprinkler Irrigation"
];

const initialForm = {
  state: "Tamil Nadu",
  district: "Chennai",
  crop: "Rice",
  soilType: "Loamy",
  irrigationType: "Irrigated",
  date: new Date().toISOString().slice(0, 10),
  previousYield: 3.5
};

export default function Prediction() {
  const [form, setForm] = useState(initialForm);

  const [weather, setWeather] = useState(null);

  const [result, setResult] = useState(null);

  const [loadingWeather, setLoadingWeather] = useState(false);

  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const [error, setError] = useState("");

  const districts = districtsByState[form.state] || [];

  const update = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    if (name === "state") {
      const newDistricts = districtsByState[value] || [];

      setForm((previous) => ({
        ...previous,
        state: value,
        district: newDistricts.length > 0 ? newDistricts[0] : ""
      }));

      setWeather(null);
    }

    if (
      name === "district" ||
      name === "date"
    ) {
      setWeather(null);
    }
  };

  const fetchWeather = async () => {
    if (!form.state || !form.district || !form.date) {
      return;
    }

    setLoadingWeather(true);
    setError("");
    setWeather(null);
    setResult(null);

    try {
      const response = await api.get("/weather", {
        params: {
          state: form.state,
          district: form.district,
          date: form.date
        }
      });

      setWeather(response.data.data.weather);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to fetch weather data."
      );

    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [
    form.state,
    form.district,
    form.date
  ]);

  const submit = async (e) => {
    e.preventDefault();

    if (!weather) {
      setError(
        "Weather data is not available yet."
      );
      return;
    }

    setLoadingPrediction(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post(
        "/predictions",
        {
          state: form.state,
          district: form.district,
          crop: form.crop,

          soilType: form.soilType,

          irrigationType:
            form.irrigationType,

          date: form.date,

          temperature:
            Number(weather.temperature_max),

          rainfall:
            Number(weather.rainfall_total),

          humidity:
            Number(weather.humidity_avg),

          previousYield:
            Number(form.previousYield)
        }
      );

      setResult(response.data.prediction);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Prediction failed. Check that the server and ML service are running."
      );

    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div>

      <div className="page-heading">

        <p className="eyebrow">
          PREDICTION ENGINE
        </p>

        <h1>
          Crop Yield Risk Prediction
        </h1>

        <p className="muted">
          Select the location and date.
          Weather conditions are automatically
          obtained from the online weather service.
        </p>

      </div>

      {/* INDIA WEATHER MAP */}
      <IndiaWeatherMap
        selectedState={form.state}
        weatherData={{}}
      />

      <form
        className="card form-grid"
        onSubmit={submit}
      >

        {/* STATE */}

        <label>
          <span>State</span>

          <select
            name="state"
            value={form.state}
            onChange={update}
            required
          >
            {states.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </label>


        {/* DISTRICT */}

        <label>
          <span>District</span>

          <select
            name="district"
            value={form.district}
            onChange={update}
            required
            disabled={districts.length === 0}
          >

            {districts.length > 0 ? (
              districts.map((district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              ))
            ) : (
              <option value="">
                District data coming soon
              </option>
            )}

          </select>

        </label>


        {/* CROP */}

        <label>
          <span>Crop</span>

          <select
            name="crop"
            value={form.crop}
            onChange={update}
            required
          >
            {crops.map((crop) => (
              <option
                key={crop}
                value={crop}
              >
                {crop}
              </option>
            ))}
          </select>
        </label>


        {/* DATE */}

        <label>
          <span>Prediction Date</span>

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={update}
            required
          />
        </label>


        {/* SOIL */}

        <label>
          <span>Soil Type</span>

          <select
            name="soilType"
            value={form.soilType}
            onChange={update}
            required
          >
            {soilTypes.map((soil) => (
              <option
                key={soil}
                value={soil}
              >
                {soil}
              </option>
            ))}
          </select>
        </label>


        {/* IRRIGATION */}

        <label>
          <span>Irrigation Type</span>

          <select
            name="irrigationType"
            value={form.irrigationType}
            onChange={update}
            required
          >
            {irrigationTypes.map(
              (irrigation) => (
                <option
                  key={irrigation}
                  value={irrigation}
                >
                  {irrigation}
                </option>
              )
            )}
          </select>
        </label>


        {/* PREVIOUS YIELD */}

        <label>
          <span>
            Previous Yield (tonnes/ha)
          </span>

          <input
            name="previousYield"
            type="number"
            step="0.1"
            min="0"
            value={form.previousYield}
            onChange={update}
            required
          />
        </label>


        {/* WEATHER CARD */}

        <div className="full-width">

          <div className="card">

            <h3>
              🌦 Weather Information
            </h3>

            {loadingWeather && (
              <p className="muted">
                Fetching live weather data...
              </p>
            )}

            {!loadingWeather && weather && (
              <div className="weather-grid">

                <div>
                  <strong>
                    🌡 Temperature
                  </strong>

                  <p>
                    {weather.temperature_max} °C
                  </p>
                </div>


                <div>
                  <strong>
                    💧 Humidity
                  </strong>

                  <p>
                    {weather.humidity_avg} %
                  </p>
                </div>


                <div>
                  <strong>
                    🌧 Rainfall
                  </strong>

                  <p>
                    {weather.rainfall_total} mm
                  </p>
                </div>


                <div>
                  <strong>
                    💨 Wind Speed
                  </strong>

                  <p>
                    {weather.wind_speed_max} km/h
                  </p>
                </div>


                <div>
                  <strong>
                    🧭 Pressure
                  </strong>

                  <p>
                    {weather.pressure_avg} hPa
                  </p>
                </div>

              </div>
            )}

            {!loadingWeather && !weather && !error && (
              <p className="muted">
                Select a location and date
                to load weather.
              </p>
            )}

          </div>

        </div>


        {/* BUTTON */}

        <div className="full-width">

          <button
            className="primary-button"
            disabled={
              loadingPrediction ||
              loadingWeather ||
              !weather
            }
          >

            {loadingPrediction
              ? "Predicting..."
              : loadingWeather
              ? "Getting Weather..."
              : "Predict Risk"}

          </button>

        </div>


        {/* ERROR */}

        {error && (
          <p className="error full-width">
            {error}
          </p>
        )}

      </form>


      {/* RESULT */}

      <PredictionResult result={result} />

    </div>
  );
}