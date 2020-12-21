// Rule of thumb for better organization.  Order 
// 1) Global variable declarations
// 2a) Function definitions
// 2b) Good to define a function for initializing things/setup
// 2c) Put code that initializes things or setup things inside the initialize function
// 3) Last should be functional invocations or if using $(document).ready(function() { ... }), 
// put the function that kicks off the app inside it


//Declare Variables for City Search
var savedCities = [];

var $searchInput = $("#search_input"); // document.querySelector('#search_iniput)
var $citySearchBtn = $('#citySearch');
var $latitudeInput = $('#latitude_input');
var $prevCityList = $('#prevCityList');
var longData = "";
var latData = "";
var cityName = "";
var weatherResponse;
var $prevCityBtn = $('.prevCityBtn');;


function initGoogleMaps() {
  var autocomplete;
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search_input'),
    { types: ["geocode"] }
  );
  google.maps.event.addListener(autocomplete, "place_changed", function () {
    var near_place = autocomplete.getPlace();
    $latitudeInput.value = near_place.geometry.location.lat();
      document.getElementById(
      "longitude_input"
    ).value = near_place.geometry.location.lng();

    document.getElementById(
      "latitude-view"
    ).innerHTML = near_place.geometry.location.lat();
    document.getElementById(
      "longitutde-view"
    ).innerHTML = near_place.geometry.location.lng();
       cityName = near_place.address_components[0].short_name;
  });
}

function buildPastCitySearches() {
  var city, $div;
  
  $prevCityList.empty();
  // console.log('we are in buildPastCitySearches');
  for(var i = 0; i < savedCities.length; i++) {
    console.log(savedCities.length);
    city = savedCities[i];
    $div = $('<button><div></div></button>')
    .addClass('prevCityBtn alert-primary border border-dark ')
    .attr("id", [i]);
    $div.text(city.city);
    $prevCityList.append($div);
    $div.on('click', function(e) {
     var id = $(this).attr('id');
      console.log(id);
      city = savedCities[id];
      e.preventDefault();
      getWeather(city.city, city.lat, city.long, false)
    });
  }
}

function initialize() {
  // Initialize everything
  initGoogleMaps();
  getFromLocalStorage();
  buildPastCitySearches();

  $searchInput.on('change', function() {
    $latitudeInput.value = '';
    document.getElementById("longitude_input").value = "";
    document.getElementById("latitude-view").innerHTML = "";
    document.getElementById("longitutde-view").innerHtml = "";
    longData = document.getElementById("longitude_input").value;
    latData = document.getElementById("latitude_input").value;
  });

  $citySearchBtn.on('click', function() {
    latData = $latitudeInput.value;
    longData = document.getElementById("longitude_input").value;
    getWeather(cityName, latData, longData);
  })
}

function getWeather(cityName, latData, longData){
  var forecastDate = "";
  var APIKey = "bc5f98e2e0cea0c6e28a5a426c201efa";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latData +
    "&lon=" +
    longData +
    "&exclude=&units=imperial&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var date = new Date(response.daily[0].dt * 1000);
    document.getElementById("cityNameLabel").innerHTML = cityName;
    document.getElementById("currentDate").innerHTML = date;
    document.getElementById("temp").innerHTML = response.current.temp + " °F";
    document.getElementById("humidity").innerHTML = response.current.humidity + " %";
    document.getElementById("wind").innerHTML = response.current.wind_speed;
    document.getElementById("uvi").innerHTML = response.current.uvi;

    saveCityArr(response.lat, response.lon);  
    
    // Render 5 Day Forecast Weather Details
    $(".fBox").empty();
    for (var i = 0; i < 6; i++) {
      $(".fBox").css("visibility", "visible");
      //logging the forecast Information
      var date = new Date(response.daily[i].dt * 1000);
      
      //Converts Unix date to Formatted Date
      var UNIX_timestamp = response.daily[i].dt;
      var a = new Date(UNIX_timestamp * 1000);
      var months = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = month + "/" + date + "/" + year;
      var forecastDate = time;

      //Creating the Forecast Boxes
      var newBox = $("<div>");
      var newCol = $("<col>");
      var newDate = $("<div>");
      newDate.text(time);
      $("#fBox" + i)
        .append(newDate)
        .css("font-weight", "bolder");

      $("#fBox" + i)
        .append(
          "<img id='theImg' src='http://openweathermap.org/img/w/" +
            response.daily[i].weather[0].icon +
            ".png'/>"
        )
        .css("align-content", "center");

      var newTemp = $("<div>");
      newTemp.text("Temp: " + response.daily[i].temp.day + " F");
      $("#fBox" + i).append(newTemp);
      var newHumidity = $("<div>");
      newHumidity.text("Humidity: " + response.daily[i].humidity + "%");
      $("#fBox" + i).append(newHumidity);
    }
  });
}

function saveCityArr(lat,lon) {
  var doesCityExist = false;
  var savedCity;

  if ("localStorage" in window && window["localStorage"] !== null) {
    for(var i = 0; i < savedCities.length; i++) {
      if (savedCities[i].city === cityName) {
        doesCityExist = true;
        break;
      }
    }
    if (!doesCityExist) {
      savedCity = {
        city: cityName,
        lat: lat,
        long: lon,
      };
      savedCities.push(savedCity);
      localStorage.setItem("savedCity", JSON.stringify(savedCities));
    }
    buildPastCitySearches();
  }
}

function getFromLocalStorage() {
  // Check if local storage (LS) key exists
  if (localStorage.getItem("savedCity")) {
    // Then retrieve the associated value from LS
    savedCities = JSON.parse(localStorage.getItem("savedCity"));
  }
}

$(document).ready(function () {
  initialize();
});
 