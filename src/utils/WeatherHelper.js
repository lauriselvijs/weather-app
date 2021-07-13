export function weatherDate(dateString) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var d = new Date(dateString);
  var dayName = days[d.getDay()];
  var time = d.getHours();
  return dayName + " " + time + ":00";
}

export function fWeatherDate(dateString) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var d = new Date(dateString);
  var dayName = days[d.getDay()];
  return dayName;
}
