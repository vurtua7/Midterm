$(function() {
    var $h1 = $("h1");//uses jquery to manipulate document
    var $icon = $("#icon");
    var $zip = $("input[name='zip']");//stores the entered zip code
    $("form").on("submit", function(event) {
        event.preventDefault();
        var zipCode = $.trim($zip.val());
        $h1.text("Loading...");
        var request = $.ajax({
        url: "/" + zipCode,
        dataType: "json"
    });//provides the form action when the user enters their zip code
    request.done(function(data) {
        var temperature = data.temperature;
        var summary = data.summary;
        var icon = data.icon;
        $h1.html("The weather is " + summary + " With a temperature of " + temperature + "&#176; in " + zipCode + ".");
        $icon.html("<canvas id='icon1' width='84' height='84'></canvas>");
        var skycons = new Skycons({"color": "orange"});
        skycons.add("icon1", icon);
        skycons.play();
    });//processes the request and displays the weather data
    request.fail(function() {
        $h1.text("Error! Try another zip code...");
    });//wrong data was entered and throws an error
    });
});