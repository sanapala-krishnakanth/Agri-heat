import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const INDIA_GEOJSON =
  "https://raw.githubusercontent.com/karthikcs/india-states-geojson/master/india-states.geojson";

const DEFAULT_WEATHER = {
  temperature: 32,
  humidity: 60,
  rainfall: 20,
  risk: "LOW"
};

function getRiskColor(risk) {
  if (risk === "HIGH") {
    return "#dc2626";
  }

  if (risk === "MEDIUM") {
    return "#f59e0b";
  }

  return "#16a34a";
}

function getStateName(feature) {
  return (
    feature?.properties?.ST_NM ||
    feature?.properties?.st_nm ||
    feature?.properties?.STATE_NAME ||
    feature?.properties?.name ||
    feature?.properties?.NAME_1 ||
    "Unknown State"
  );
}

export default function IndiaWeatherMap({
  selectedState,
  weatherData = {}
}) {
  const [geoData, setGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(INDIA_GEOJSON)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load India map");
        }

        return response.json();
      })
      .then((data) => {
        setGeoData(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load India map.");
      });
  }, []);

  const getWeatherForState = (stateName) => {
    const data = weatherData?.[stateName];

    if (!data) {
      return DEFAULT_WEATHER;
    }

    return {
      temperature:
        data.temperature ??
        data.temperature_max ??
        32,

      humidity:
        data.humidity ??
        data.humidity_avg ??
        60,

      rainfall:
        data.rainfall ??
        data.rainfall_total ??
        20,

      risk:
        data.risk ??
        data.riskLevel ??
        "LOW"
    };
  };

  const getStyle = (feature) => {
    const stateName = getStateName(feature);

    const weather = getWeatherForState(stateName);

    const isSelected =
      stateName.toLowerCase() ===
      String(selectedState).toLowerCase();

    return {
      fillColor: isSelected
        ? "#2563eb"
        : getRiskColor(weather.risk),

      fillOpacity: isSelected
        ? 0.85
        : 0.65,

      color: "#ffffff",

      weight: isSelected
        ? 3
        : 1,

      opacity: 1
    };
  };

  const onEachState = (feature, layer) => {
    const stateName = getStateName(feature);

    const weather =
      getWeatherForState(stateName);

    layer.on({
      mouseover: (event) => {
        const currentLayer = event.target;

        currentLayer.setStyle({
          weight: 3,
          color: "#111827",
          fillOpacity: 0.9
        });

        currentLayer.bringToFront();
      },

      mouseout: (event) => {
        event.target.setStyle(
          getStyle(feature)
        );
      },

      click: () => {
        setSelectedFeature({
          stateName,
          weather
        });
      }
    });
  };

  if (error) {
    return (
      <div
        className="card"
        style={{
          margin: "20px 0",
          padding: "25px"
        }}
      >
        <h2>🇮🇳 India Weather Map</h2>

        <p className="error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        margin: "20px 0",
        padding: "20px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
          <p className="eyebrow">
            LIVE WEATHER
          </p>

          <h2
            style={{
              margin: "5px 0"
            }}
          >
            🇮🇳 India Weather Map
          </h2>

          <p className="muted">
            Weather and crop-risk conditions
            across Indian states
          </p>
        </div>

        <div
          style={{
            padding: "10px 15px",
            borderRadius: "10px",
            background: "#eef6ff",
            border: "1px solid #bfdbfe"
          }}
        >
          <strong>
            Selected:
          </strong>{" "}
          {selectedState || "None"}
        </div>
      </div>

      {!geoData && (
        <div
          style={{
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            borderRadius: "12px"
          }}
        >
          <p className="muted">
            Loading India map...
          </p>
        </div>
      )}

      {geoData && (
        <MapContainer
          center={[22.5, 79]}
          zoom={4.5}
          minZoom={4}
          maxZoom={7}
          scrollWheelZoom={true}
          style={{
            height: "520px",
            width: "100%",
            borderRadius: "12px"
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            key={selectedState}
            data={geoData}
            style={getStyle}
            onEachFeature={onEachState}
          />

          {selectedFeature && (
            <Popup
              position={[
                22.5,
                79
              ]}
            >
              <div
                style={{
                  minWidth: "200px"
                }}
              >
                <h3>
                  {selectedFeature.stateName}
                </h3>

                <p>
                  🌡 Temperature:{" "}
                  <strong>
                    {selectedFeature.weather.temperature}
                    °C
                  </strong>
                </p>

                <p>
                  💧 Humidity:{" "}
                  <strong>
                    {selectedFeature.weather.humidity}
                    %
                  </strong>
                </p>

                <p>
                  🌧 Rainfall:{" "}
                  <strong>
                    {selectedFeature.weather.rainfall}
                    mm
                  </strong>
                </p>

                <p>
                  ⚠️ Risk:{" "}
                  <strong>
                    {selectedFeature.weather.risk}
                  </strong>
                </p>
              </div>
            </Popup>
          )}
        </MapContainer>
      )}

      {/* LEGEND */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          marginTop: "15px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              background: "#16a34a",
              borderRadius: "3px",
              marginRight: "6px"
            }}
          />

          Low Risk
        </div>

        <div>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              background: "#f59e0b",
              borderRadius: "3px",
              marginRight: "6px"
            }}
          />

          Medium Risk
        </div>

        <div>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              background: "#dc2626",
              borderRadius: "3px",
              marginRight: "6px"
            }}
          />

          High Risk
        </div>

        <div>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              background: "#2563eb",
              borderRadius: "3px",
              marginRight: "6px"
            }}
          />

          Selected State
        </div>
      </div>
    </div>
  );
}