$(function(){
	"use strict";
    let coords = [];

    navigator.geolocation.getCurrentPosition(function(position) {
            coords[0] = position.coords.latitude;
            coords[1] = position.coords.longitude;

            createScript(coords.toString(), coords);
    }, function() {
            let coords = [ 48.4593, 35.03865 ];
            createScript(coords.toString(), coords);
    });
  
    function req(lat, lng) {
        let url = `http://api.geonames.org/countrySubdivisionJSON?lat=${lat}&lng=${lng}&username=Designa`;
        fetch(url)
        .then(res => res.json())
        .then(res => { 
            $(".town").text(`${res.adminName1}`); 
            console.log(res)

            $(".wait").css("display", "none");
            $(".weather").css("display", "block");
        });
    }

    function createScript(url, coords) {
    	let basicUrl ="https://api.darksky.net/forecast/d514f5864d23d3406c2cceddf75a8892/",
    		cb = "?callback=getWeather",
    		script = document.createElement("script");

        console.log(coords)
        req(coords[0], coords[1]);

  		script.src = basicUrl + url + cb;

    	document.body.appendChild(script);
    }	
});

function getWeather(data) {

    console.log(data);
    let today = data.currently,
        second = data.daily.data[1],
        third = data.daily.data[2],
        fourth = data.daily.data[3],
        day;
    
    function daysWeather(day, name) {
        data = new Date(Number.parseInt(day.time + "000")).toString().match(/^\w+(?=\s)/g).toString();
        $("." + name + " " + ".day-name").text(data);
        $("." + name + " " + "img").attr("src",`img/${day.icon}.png`);
        if(day === today) $("." + name + " " + ".temperature").text(Math.round((day.temperature - 32) / 1.8) + "º")
        else $("." + name + " " + ".temperature").text(Math.round((day.dewPoint - 32) / 1.8) + "º");

        $(".c").css("background", "#35c2d4");

        $(".f").on("click", function() {
            if(day === today) $("." + name + " " + ".temperature").text(Math.round(day.temperature) + "º");
            else $("." + name + " " + ".temperature").text(Math.round(day.dewPoint) + "º");
            $(".f").css("background", "#35c2d4");
            $(".c").css("background", "none");
        });
        $(".c").on("click", function() {
            if(day === today) $("." + name + " " + ".temperature").text(Math.round((day.temperature - 32) / 1.8) + "º")
            else $("." + name + " " + ".temperature").text(Math.round((day.dewPoint - 32) / 1.8) + "º");
            $(".c").css("background", "#35c2d4");
            $(".f").css("background", "none");
        });
    }

    showWeather(today)
    function showWeather(day) {

        let days = ["Мonday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            dayName = new Date(Number.parseInt(day.time + "000")).toString().match(/^\w+(?=\s)/g).toString(),
            month = new Date(Number.parseInt(day.time + "000")).toString().match(/\w+\s\d+(?=\s)/g).toString();

        if(dayName === "Mon") {$(".mainDay .data").text(days[0] +" " + month)}
        else if (dayName === "Tue") {$(".mainDay .data").text(days[1] + " " + month)}
        else if (dayName === "Wed") {$(".mainDay .data").text(days[2] + " " + month)}
        else if (dayName === "Thu") {$(".mainDay .data").text(days[3] + " " + month)}
        else if (dayName === "Fri") {$(".mainDay .data").text(days[4] + " " + month)}
        else if (dayName === "Sat") {$(".mainDay .data").text(days[5] + " " + month)}
        else if (dayName === "Sun") {$(".mainDay .data").text(days[6] + " " + month)};

        $(".mainDay .wind-speed").text(day.windSpeed + "kph");
        $(".mainDay .rain-prob > div").text("%" + day.precipProbability * 100);
        $(".mainDay .humidity > div").text("%" + day.humidity * 100);
        $(".mainDay .icon").attr("src",`img/${day.icon}.png`);


        if(day === today) $(".mainDay .temperature").text(Math.round((day.temperature - 32) / 1.8) + "º");
        else $(".mainDay .temperature").text(Math.round((day.dewPoint - 32) / 1.8) + "º");

        $(".f").on("click", function() {
            if(day === today) $(".mainDay .temperature").text(Math.round(day.temperature) + "º");
            else $(".mainDay .temperature").text(Math.round(day.dewPoint) + "º");
        });
        $(".c").on("click", function() {
            if(day === today) $(".mainDay .temperature").text(Math.round((day.temperature - 32) / 1.8) + "º");
            else $(".mainDay .temperature").text(Math.round((day.dewPoint - 32) / 1.8) + "º");
        });
   }

    $(".day").on("click", function() {
        if (this === document.querySelector(".today")) showWeather(today)
        else if (this ===  document.querySelector(".second")) showWeather(second)
        else if (this ===  document.querySelector(".third")) showWeather(third)
        else showWeather(fourth);
    });

    daysWeather(today, "today");
    daysWeather(second, "second");
    daysWeather(third, "third");
    daysWeather(fourth, "fourth");
}