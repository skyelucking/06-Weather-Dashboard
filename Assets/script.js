      
    // <!-- My Google Places API  Key = AIzaSyA5iZSuKAK0n-F7XktBgeLMAeY69bLd2Ls -->
    // <!-- Google Maps Javascript Library -->
    var searchInput= "search_input";
    var longData = '';
    var latData = '';
    var cityName = '';
  
    $(document).ready(function () {
              // preventDefault();
        var autocomplete;
        autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), { types:['geocode']
        
    });
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
            var near_place = autocomplete.getPlace();
            document.getElementById('latitude_input').value = near_place.geometry.location.lat();
            document.getElementById('longitude_input').value = near_place.geometry.location.lng();

            document.getElementById('latitude-view').innerHTML = near_place.geometry.location.lat();
            document.getElementById('longitutde-view').innerHTML = near_place.geometry.location.lng();
            console.log(near_place);
            console.log(document.getElementById('latitude_input').value );
            console.log(near_place.address_components[0].short_name);
            cityName = near_place.address_components[0].short_name
            
        });

    });

    $(document).on('change', '#'+searchInput, function(){
        // var near_place = autocomplete.getPlace();
        document.getElementById('latitude_input').value = "";
        document.getElementById('longitude_input').value = "";
        document.getElementById('latitude-view').innerHTML = "";
        document.getElementById('longitutde-view').innerHtml = "";
        longData = document.getElementById('longitude_input').value;
        latData = document.getElementById('latitude_input').value;
        
    })

    $(document).on('click', '#citySearch', function() {
     latData = document.getElementById('latitude_input').value;
     longData = document.getElementById('longitude_input').value;
     console.log(document.getElementById('latitude_input').value);
     console.log("lat:" + latData + " long: " + longData + " City Name: " + cityName);
    
     var APIKey = "bc5f98e2e0cea0c6e28a5a426c201efa";
     var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latData + "&lon="+ longData + "&exclude=&appid=" +  APIKey;
     $.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {

  // Log the queryURL
  // console.log(queryURL);

  // Log the resulting object
  console.log(response.lat, response.lon);
  console.log(response);
   document.getElementById('temp').innerHTML = response.current.temp;
  document.getElementById('humidity').innerHTML = response.current.humidity;
  document.getElementById('wind').innerHTML = response.current.wind_speed;
  document.getElementById('uvi').innerHTML = response.current.uvi;
  
});

 });
 
