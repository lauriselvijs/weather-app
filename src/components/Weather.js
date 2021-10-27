import React, { useState, useEffect } from "react";
import axios from "axios";

import "../css/RTWeather.css";
import "../css/FWeather.css";
import "../css/Weather.css";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import Alert from "react-bootstrap/Alert";

import { BsSearch } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";

import wind from "../weather-img/wind.svg";
import city from "../weather-img/city.svg";
import humidity from "../weather-img/humidity.svg";
import precipitation from "../weather-img/precipitation.svg";

import { weatherDate, fWeatherDate } from "../utils/WeatherHelper";

import Loader from "../loaders/loader";

/* 
Weather component used for displaying weather for current day
which includes information about real time temperature,
real feel temp, humidity, perception, wind speed and directions as
well location and time.
Also includes prediction of temperature, real feel, wind, chances of rain, 
for current day and next two days 
*/

function Weather() {
  // used for receiving data from API in data object
  const [data, setData] = useState([]);

  // used for disabling or enabling loading screen
  const [isLoading, setLoading] = useState(true);

  // used to enable city name
  const [cityName, setCityName] = useState("London");

  // used to set lang and lat for weather location
  const [location, setLocation] = useState();

  // allows disabling or enabling measurement systems
  const [metric, setMetric] = useState(false);

  // used to display error if user input incorrect (ERROR 400)
  const [error, setError] = useState(false);

  // used if user disable browser location
  const [locationError, setLocationError] = useState(false);

  // used to access Weather API key
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchData = async () => {
    try {
      const result = await axios({
        method: "GET",
        url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
        params: { q: cityName ? cityName : location, days: "3" },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      });
      setData(result.data);
      // Disable loading screen when data loaded
      setLoading(false);
      // Remove city name from input box
      setCityName("");
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        // If bad input displays error msg
        setError(true);
      }

      return error.response;
    }
  };

  useEffect(() => {
    // Renders screen only if location or cityName present
    if (location || cityName) fetchData();
  }, [location]);

  // On search button press fetch data for city
  const handleSearchSubmit = (evt) => {
    evt.preventDefault();

    fetchData();
  };

  // Now I can use the promise followed by .then()
  // to make use of the values anywhere in the program
  const handleLocationSubmit = (evt) => {
    evt.preventDefault();
    // Creating a promise out of the function
    let getLocationPromise = new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            // Resolving the values which I need
            resolve({ latitude: lat, longitude: long });
          },
          function () {
            setLocationError(true);
          }
        );
      } else {
        reject("your browser doesn't support geolocation API");
      }
    });

    // Using promise to async access location property's
    getLocationPromise
      .then((location) => {
        let loc =
          location.latitude.toFixed(2) + ", " + location.longitude.toFixed(2);
        setLocation("");
        setLocation(loc);

        console.log(cityName);
        console.log(loc);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // using to change from metric to imperial measurement system
  const handleLConversion = (evt) => {
    evt.preventDefault();
    metric ? setMetric(false) : setMetric(true);
  };

  // Remove any errors from screen and reset search input field
  const handleErrorSubmit = (evt) => {
    evt.preventDefault();
    setError(false);
    setLocationError(false);
    setCityName("");
  };

  // Shows loading screen
  if (isLoading) {
    return (
      <div className="loading">
        {" "}
        <Loader />
        Loading...
      </div>
    );
  }

  // Shows input error
  if (error) {
    return (
      <div className="error">
        <Alert variant="danger">Incorrect input</Alert>
        <Button
          onClick={handleErrorSubmit}
          variant="outline-primary"
          className="ml-2 "
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Shows location error
  if (locationError) {
    return (
      <div className="error">
        <Alert variant="danger">Please enable your location</Alert>
        <Button
          onClick={handleErrorSubmit}
          variant="outline-primary"
          className="ml-2 "
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/*Form and buttons needed so user can search and input location,
      search by geo location and convert from imperial to metric units*/}
      <Form className="mt-2 ml-2">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Location"
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />

          <InputGroup.Append>
            <Button onClick={handleSearchSubmit} variant="outline-secondary">
              <BsSearch />
            </Button>
          </InputGroup.Append>

          <Button
            onClick={handleLocationSubmit}
            variant="outline-primary"
            className="ml-2"
          >
            <BiCurrentLocation />
          </Button>
          <Button
            onClick={handleLConversion}
            variant="outline-primary"
            className="ml-2 mr-2"
          >
            {metric ? <>Imperial</> : <>Metric</>}
          </Button>
        </InputGroup>
      </Form>

      <div className="weather">
        <Jumbotron fluid>
          {/*  show info about real time weather*/}
          <div className="rt-weather">
            <div className="rt-weather-info">
              <img
                src={data.current.condition.icon}
                alt="clouds"
                width="40%"
                height="40%"
              />
              <h3 className="rt-weather-info-text">
                {data.current.condition.text}
              </h3>

              <h1 className="rt-temperature">
                {metric ? (
                  <> {data.current.temp_c} &#176;C </>
                ) : (
                  <> {Math.round(data.current.temp_f)} &#176;F </>
                )}
              </h1>
              <h3 className="rt-real-feel">
                Real feel:
                {metric ? (
                  <> {Math.round(data.current.feelslike_c)} &#176;C </>
                ) : (
                  <> {Math.round(data.current.feelslike_f)} &#176;F </>
                )}
              </h3>
            </div>

            <div className="rt-add-weather-info">
              <img
                src={precipitation}
                alt="precipitation"
                width="20%"
                height="20%"
              />
              <h3 className="rt-precipitation">
                Precipitation:{" "}
                {metric ? (
                  <> {data.current.precip_mm} mm </>
                ) : (
                  <> {Math.round(data.current.precip_mm)} in </>
                )}
              </h3>

              <img src={humidity} alt="humidity" width="20%" height="20%" />
              <h3 className="rt-humidity">
                Humidity: {data.current.humidity} %
              </h3>

              <img src={wind} alt="wind" width="20%" height="20%" />
              <h3 className="rt-wind">
                Wind:{" "}
                {metric ? (
                  <> {Math.round(data.current.wind_kph)} kph </>
                ) : (
                  <> {Math.round(data.current.wind_mph)} mph</>
                )}{" "}
                , {data.current.wind_dir}
              </h3>
            </div>
            <div className="rt-date-location">
              <img src={city} alt="city" width="30%" height="30%" />
              <h3 className="rt-location">
                {data.location.name + ", " + data.location.country}
              </h3>
              <h3 className="rt-date">
                {weatherDate(data.location.localtime)}
              </h3>
            </div>
          </div>
        </Jumbotron>

        <Jumbotron>
          {/*  show info about forecasted time weather*/}
          <div className="f-weather">
            <div className="weather-info-day-1">
              <img
                src={data.forecast.forecastday[0].day.condition.icon}
                alt="clouds"
                width="30%"
                height="30%"
              />
              <h3 className="f-weather-info-text">
                {data.forecast.forecastday[0].day.condition.text}
              </h3>

              <h1 className="f-temperature">
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[0].day.avgtemp_c
                    )}{" "}
                    &#176;C{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[0].day.avgtemp_f
                    )}{" "}
                    &#176;F{" "}
                  </>
                )}
              </h1>

              <h3 className="f-precipitation">
                Precipitation:{" "}
                {data.forecast.forecastday[0].day.daily_chance_of_rain} %
              </h3>

              <h3 className="f-humidity">
                Humidity: {data.forecast.forecastday[0].day.avghumidity} %
              </h3>

              <h3 className="f-wind">
                Wind:{" "}
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[0].day.avgvis_km
                    )} kph{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[0].day.avgvis_miles
                    )}{" "}
                    mph{" "}
                  </>
                )}
              </h3>

              <h3 className="f-date">
                {fWeatherDate(data.forecast.forecastday[0].date)}
              </h3>
            </div>

            <div className="weather-info-day-2">
              <img
                src={data.forecast.forecastday[1].day.condition.icon}
                alt="clouds"
                width="30%"
                height="30%"
              />
              <h3 className="f-weather-info-text">
                {data.forecast.forecastday[1].day.condition.text}
              </h3>

              <h1 className="f-temperature">
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[1].day.avgtemp_c
                    )}{" "}
                    &#176;C{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[1].day.avgtemp_f
                    )}{" "}
                    &#176;F{" "}
                  </>
                )}
              </h1>

              <h3 className="f-precipitation">
                Precipitation:{" "}
                {data.forecast.forecastday[1].day.daily_chance_of_rain} %
              </h3>

              <h3 className="f-humidity">
                Humidity: {data.forecast.forecastday[1].day.avghumidity} %
              </h3>

              <h3 className="f-wind">
                Wind:{" "}
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[1].day.avgvis_km
                    )} kph{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[1].day.avgvis_miles
                    )}{" "}
                    mph{" "}
                  </>
                )}
              </h3>

              <h3 className="f-date">
                {fWeatherDate(data.forecast.forecastday[1].date)}
              </h3>
            </div>

            <div className="weather-info-day-3">
              <img
                src={data.forecast.forecastday[2].day.condition.icon}
                alt="clouds"
                width="30%"
                height="30%"
              />
              <h3 className="f-weather-info-text">
                {data.forecast.forecastday[2].day.condition.text}
              </h3>

              <h1 className="f-temperature">
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[2].day.avgtemp_c
                    )}{" "}
                    &#176;C{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[2].day.avgtemp_f
                    )}{" "}
                    &#176;F{" "}
                  </>
                )}
              </h1>

              <h3 className="f-precipitation">
                Precipitation:{" "}
                {data.forecast.forecastday[2].day.daily_chance_of_rain} %
              </h3>

              <h3 className="f-humidity">
                Humidity: {data.forecast.forecastday[2].day.avghumidity} %
              </h3>

              <h3 className="f-wind">
                Wind:{" "}
                {metric ? (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[2].day.avgvis_km
                    )} kph{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {Math.round(
                      data.forecast.forecastday[2].day.avgvis_miles
                    )}{" "}
                    mph{" "}
                  </>
                )}
              </h3>

              <h3 className="f-date">
                {fWeatherDate(data.forecast.forecastday[2].date)}
              </h3>
            </div>
          </div>
        </Jumbotron>
      </div>
    </div>
  );
}

export default Weather;
