const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCoordinates(state, district) {
  const searches = [
    `${district}, ${state}`,
    district,
    `${district} district, ${state}`
  ];

  let results = [];

  for (const search of searches) {
    const params = new URLSearchParams({
      name: search,
      count: "10",
      language: "en",
      format: "json",
      countryCode: "IN"
    });

    const response = await fetch(
      `${GEOCODING_URL}?${params.toString()}`
    );

    if (!response.ok) {
      continue;
    }

    const data = await response.json();

    if (!data.results?.length) {
      continue;
    }

    results = data.results;

    const exactMatch = results.find(
      location =>
        location.name?.toLowerCase() === district.toLowerCase() &&
        location.admin1?.toLowerCase() === state.toLowerCase()
    );

    if (exactMatch) {
      return {
        latitude: exactMatch.latitude,
        longitude: exactMatch.longitude,
        locationName: exactMatch.name,
        state: exactMatch.admin1,
        country: locationCountry(exactMatch)
      };
    }
  }

  if (results.length > 0) {
    const stateMatch = results.find(
      location =>
        location.admin1?.toLowerCase() === state.toLowerCase()
    );

    const location = stateMatch || results[0];

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      locationName: location.name,
      state: location.admin1 || state,
      country: locationCountry(location)
    };
  }

  throw new Error(
    `Could not find coordinates for ${district}, ${state}`
  );
}

function locationCountry(location) {
  return location.country || "India";
}

export async function getWeatherForDate(
  latitude,
  longitude,
  date
) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),

    start_date: date,
    end_date: date,

    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "rain",
      "pressure_msl",
      "wind_speed_10m"
    ].join(","),

    timezone: "auto",

    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm"
  });

  const response = await fetch(
    `${WEATHER_URL}?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Weather API error: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.hourly) {
    throw new Error("Weather data was not returned");
  }

  const hourly = data.hourly;

  const temperatures =
    hourly.temperature_2m?.filter(value => value !== null) || [];

  const humidities =
    hourly.relative_humidity_2m?.filter(value => value !== null) || [];

  const precipitation =
    hourly.precipitation?.filter(value => value !== null) || [];

  const rainfall =
    hourly.rain?.filter(value => value !== null) || [];

  const pressures =
    hourly.pressure_msl?.filter(value => value !== null) || [];

  const windSpeeds =
    hourly.wind_speed_10m?.filter(value => value !== null) || [];

  const average = values => {
    if (values.length === 0) return null;

    return (
      values.reduce(
        (sum, value) => sum + value,
        0
      ) / values.length
    );
  };

  const maximum = values => {
    if (values.length === 0) return null;

    return Math.max(...values);
  };

  const total = values => {
    if (values.length === 0) return null;

    return values.reduce(
      (sum, value) => sum + value,
      0
    );
  };

  return {
    date,

    temperature_max: maximum(temperatures),
    temperature_avg: average(temperatures),

    humidity_avg: average(humidities),

    precipitation_total: total(precipitation),
    rainfall_total: total(rainfall),

    pressure_avg: average(pressures),

    wind_speed_max: maximum(windSpeeds),
    wind_speed_avg: average(windSpeeds),

    timezone: data.timezone
  };
}

export async function getWeatherData(
  state,
  district,
  date
) {
  const coordinates = await getCoordinates(
    state,
    district
  );

  const weather = await getWeatherForDate(
    coordinates.latitude,
    coordinates.longitude,
    date
  );

  return {
    location: {
      state: coordinates.state,
      district: coordinates.locationName,
      country: coordinates.country,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    },

    weather
  };
}