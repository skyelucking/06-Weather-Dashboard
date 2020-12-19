// <!-- My Google Places API  Key = AIzaSyA5iZSuKAK0n-F7XktBgeLMAeY69bLd2Ls -->
// <!-- Google Maps Javascript Library -->
var searchInput = "search_input";
var longData = "";
var latData = "";
var cityName = "";

$(document).ready(function () {
  // preventDefault();
  var autocomplete;
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById(searchInput),
    { types: ["geocode"] }
  );
  google.maps.event.addListener(autocomplete, "place_changed", function () {
    var near_place = autocomplete.getPlace();
    document.getElementById(
      "latitude_input"
    ).value = near_place.geometry.location.lat();
    document.getElementById(
      "longitude_input"
    ).value = near_place.geometry.location.lng();

    document.getElementById(
      "latitude-view"
    ).innerHTML = near_place.geometry.location.lat();
    document.getElementById(
      "longitutde-view"
    ).innerHTML = near_place.geometry.location.lng();
    // console.log(near_place);
    // console.log(document.getElementById("latitude_input").value);
    // console.log(near_place.address_components[0].short_name);
    cityName = near_place.address_components[0].short_name;
  });
});

$(document).on("change", "#" + searchInput, function () {
  // var near_place = autocomplete.getPlace();
  document.getElementById("latitude_input").value = "";
  document.getElementById("longitude_input").value = "";
  document.getElementById("latitude-view").innerHTML = "";
  document.getElementById("longitutde-view").innerHtml = "";
  longData = document.getElementById("longitude_input").value;
  latData = document.getElementById("latitude_input").value;
});

$(document).on("click", "#citySearch", function () {
        latData = document.getElementById("latitude_input").value;
  longData = document.getElementById("longitude_input").value;
  var forecastDate = '';
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
        
  console.log(response);
  console.log(response.daily);
  console.log(response.daily[0]);
  var date = new Date(response.daily[0].dt * 1000);
  console.log(date);
        document.getElementById("cityNameLabel").innerHTML = cityName;
        document.getElementById("currentDate").innerHTML = date;
        document.getElementById("temp").innerHTML = response.current.temp;
        document.getElementById("humidity").innerHTML = response.current.humidity;
        document.getElementById("wind").innerHTML = response.current.wind_speed;
        document.getElementById("uvi").innerHTML = response.current.uvi;
    
   // Render 5 Day Forecast Weather Details
   
    for (var i = 0; i < 6;){
        
       //logging the forecast Information
        var date = new Date(response.daily[i].dt * 1000);
        console.log(date);
        console.log("Clouds: " + response.daily[i].clouds);
        console.log("http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png");
        console.log("Temp: " + response.daily[i].temp.day + " F");
        console.log("Humidity: " + response.daily[i].humidity);
        
          //Converts Unix date to Formatted Date
        function timeConverter(UNIX_timestamp){
            var UNIX_timestamp = response.daily[i].dt;
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time =  month + '/' + date+ '/' + year; 
            var forecastDate = time;
         }
    //Creating the Forecast Boxes
    var newBox= $("<div>");     
    var newCol= $("<col>")
        //  $("newCol").attr('id', "forecast-" + i)
        var newDate= $("<div>");
        newDate.text(date);
        $("#fBox" + i).append(newDate);

        $("#fBox" + i).append("<img id='theImg' src='http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png'/>");

        var newTemp= $("<div>");
        newTemp.text("Temp: " + response.daily[i].temp.day + " F");
        $("#fBox" + i).append(newTemp);
        var newHumidity= $("<div>");
        newHumidity.text("Humidity: " + response.daily[i].humidity);
        $("#fBox" + i).append(newHumidity);
        
        i++;
                
   }
    
  });
});
