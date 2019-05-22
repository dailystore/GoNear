$(document).ready(function() {
    $('.mdb-select').material_select();
    $("#store a").on("click", function() {
        // $("#store").val(this.text.trim());
        $("#search-shop")[0].value = this.text.trim();
    });

    $("#location a").on("click", function() {
        $("#search-shop")[0].value = this.text.trim();
    });
});

$(function() {
    $("#side-stick").sticky({
        topSpacing: 0,
        zIndex: 2,
        stopper: "footer"
    });
});

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

$().ready(function() {
    $('.datepicker').pickadate();

    $('.timepicker').pickatime({
        twelvehour: true
    });
});

$(document).ready(function() {

    if (localStorage.getItem("bIsLoggedIn") === "true") {
        $("#avatar-after-login").each(function () {
            this.style.setProperty( 'visibility', 'visible', 'important' );
        });
        $("#avatar-before-login").each(function () {
            this.style.setProperty( 'display', 'none', 'important' );
        });
    } else {
        $("#avatar-after-login").each(function () {
            this.style.setProperty( 'display', 'none', 'important' );
        });
        $("#avatar-before-login").each(function () {
            this.style.setProperty( 'visibility', 'visible', 'important' );
        });
    }

    $("#sign-in-box").on("submit", function(event) {
        event.preventDefault();

        var url, param, username, password;
        username = $("#sign-in-box").serializeArray()[0].value;
        password = $("#sign-in-box").serializeArray()[1].value;
        url = "/login";
        param = "username=" + username + "&password=" + password

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.localStorage.setItem("candy", this.responseText);
                localStorage.setItem("bIsLoggedIn", "true");
                window.location.href = "/";
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
    });

    $("#log-out").on("click", function(evt) {
        evt.preventDefault();

        window.localStorage.clear();
        window.location.href = "/";

        // var url;
        // url = "/logout";

        // var xhttp = new XMLHttpRequest();
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         window.localStorage.clear();
        //         var localStorage = window.localStorage.getItem("candy");
        //         window.location.href = "index.html";
        //     }
        // };
        // xhttp.open("POST", url, true);
        // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xhttp.setRequestHeader("Authorization", window.localStorage.getItem("candy"));
        // xhttp.send();
    });

    $("#sign-up-box").on("submit", function(evt) {
        evt.preventDefault();

        var url, email, phone, username, password, repeatPassword, personalInfo;
        email = $("#sign-up-box").serializeArray()[0].value;
        phone = $("#sign-up-box").serializeArray()[1].value;
        username = $("#sign-up-box").serializeArray()[2].value;
        password = $("#sign-up-box").serializeArray()[3].value;
        repeatPassword = $("#sign-up-box").serializeArray()[4].value;
        personalInfo = $("#sign-up-box").serializeArray()[5].value;
        accountType =  $("#sign-up-box").serializeArray()[6].value;

        if (password !== repeatPassword) {
            alert("different password");
            return;
        }
        url = "/register";
        param = "username=" + username + "&password=" + password + "&personalinfo=" + personalInfo + "&email=" + email + "&phone=" + phone + "&accounttype=" + accountType;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                window.location.href = "login.html";
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
    });

    $("#search-button").on("click", function(evt) {
        evt.preventDefault();
        var sQuery = $('#search-location').val();
        var sName = $('#search-shop').val();
        var url;
        url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sQuery + "&key=AIzaSyAjEDiN0cJ-KLBk3jLFO4gJqLMJondFF48";

        if (sQuery !== "") {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(data) {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResp = JSON.parse(this.responseText);

                    if (jsonResp.status !== "OK") {
                        alert("Unable to find the described location!!! Please try again with some other terms or wipe it blank for default to San Diego.");
                        $('#search-location').focus();
                        return;
                    }

                    var oData = jsonResp.results;
                    // var sFormattedAddress = oData[0].formatted_address;
                    var sBound = oData[0].geometry.bounds || oData[0].geometry.viewport;
                    var nelon = sBound.northeast.lng;
                    var nelat = sBound.northeast.lat;
                    var swlon = sBound.southwest.lng;
                    var swlat = sBound.southwest.lat;

                    window.location.href = "list.html?swlon=" + swlon + "&swlat=" + swlat + "&nelon=" + nelon + "&nelat=" + nelat + "&txt=" + sName + "&loc=" + sQuery;
                }
            };
            xhttp.open("GET", url, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // xhttp.setRequestHeader("Authorization", window.localStorage.getItem("candy"));
            xhttp.send();
        } else {
            window.location.href = "list.html?swlon=-117.2824&swlat=32.5348&nelon=-116.9058&nelat=33.1142&loc=San%20Diego&txt=" + sName;
        }
    });

    $("#explorer-profile-form input").focusout(function(e) {
        debugger;
        if (this.value !== this.getAttribute("value")) {
            var url, param;
            url = "/update_user_profile";
            param = this.id + "=" + this.value;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(data) {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResp = JSON.parse(this.responseText);
                    if (jsonResp.status !== "OK") {
                        alert("Unable to find the described location!!! Please try again with some other terms or wipe it blank for default to San Diego.");
                        $('#search-location').focus();
                        return;
                    }
                    // var oData = jsonResp.results;
                }
            };
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(param);
        }
      });
});

$(function () {

    $("#rate-star").rateYo({
        rating: 0,
        halfStar: true
    });

});
