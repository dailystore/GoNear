



function getUserProfile() {
  var TEST_DOMAIN_URL_PREFIX = "";
  // TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";
  var a = window.localStorage.getItem("candy");

  var url = "";
  url += TEST_DOMAIN_URL_PREFIX;
  url += "/get_user_profile";

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (data) {
    if (this.readyState == 4 && this.status == 200) {
      var isBizOrExp = JSON.parse(this.responseText).business_information;
      if (isBizOrExp === undefined) {
        window.location.href = "setting.html";
      } else {
        window.location.href = "biz-info.html?id=FQAAAAAAAAA";
      }

    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
}

$(document).ready(function () {

  var TEST_DOMAIN_URL_PREFIX = "";
  // TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";

  if (document.title !== "Login | GoOhYeah") {
    window.localStorage.setItem("currentPage", window.location.href);
  }

  $('.mdb-select').material_select();
  $("#store a").on("click", function () {
    // $("#store").val(this.text.trim());
    $("#search-shop")[0].value = this.text.trim();
  });

  $("#location a").on("click", function () {
    $("#search-shop")[0].value = this.text.trim();
  });
  $("#navigate_to_type_user").on("click", function () {
    getUserProfile();
  })

  $("#side-stick").sticky({
    topSpacing: 0,
    zIndex: 2,
    stopper: "footer"
  });

  $('[data-toggle="tooltip"]').tooltip()

  var crntUsrNm = window.localStorage.getItem("candy");
  if (crntUsrNm !== null && crntUsrNm !== "") {
    $("#welcome-name").html(JSON.parse(crntUsrNm).Phone);
  }

  if (localStorage.getItem("bIsLoggedIn") === "true") {
    $("#avatar-after-login").each(function () {
      this.style.setProperty('visibility', 'visible', 'important');
    });
    $("#avatar-before-login").each(function () {
      this.style.setProperty('display', 'none', 'important');
    });
  } else {
    $("#avatar-after-login").each(function () {
      this.style.setProperty('display', 'none', 'important');
    });
    $("#avatar-before-login").each(function () {
      this.style.setProperty('visibility', 'visible', 'important');
    });
  }

  $("#sign-in-box").on("submit", function (event) {
    event.preventDefault();

    var url = "", param, email, password;
    email = $("#sign-in-box #email-phone").val();
    password = $("#sign-in-box #password").val();
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/login";
    param = "email=" + email + "&password=" + password

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var resp = this.responseText;
        localStorage.setItem("candy", resp);
        localStorage.setItem("bIsLoggedIn", "true");

        var crntPage = window.localStorage.getItem("currentPage");
        // if (crntPage === "index") {
        //     crntPage = "/";
        // } else if (crntPage === "details") {
        //     crntPage = "details.html";
        // } else if (crntPage === "setting") {
        //     crntPage = "setting.html";
        // } else {
        //     crntPage = "/";
        // }

        //Navigate back to home when user logs out from setting page
        //Otherwise, navigate them back to where they are
        if (crntPage !== null && crntPage.indexOf("setting") > 0) {
          crntPage = "/";
        }

        window.location.href = crntPage;
      } else if (this.status === 401) {
        $("#error-signin").html("Login failed !");
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(param);
  });

  $("#log-out").click(function (evt) {
    evt.preventDefault();

    var url = "";
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/logout";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        window.localStorage.clear();
        var crntPage = window.location.href.split("/")[3].split("?")[0];
        if (crntPage.indexOf("biz-info") > -1 || crntPage.indexOf("setting") > -1) {
          window.location.href = "/";
        } else {
          var currentPage = window.localStorage.getItem("currentPage");
          window.localStorage.setItem("currentPage", currentPage);
          window.location.href = "";
        }
      }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Authorization", window.localStorage.getItem("candy"));
    xhttp.send();
  });

  $("#sign-up-username").focusout(function (e) {
    var err = false;
    var illegalChars = /\W/; // allow letters, numbers, and underscores
    var val = this.value;

    $("#" + this.id).removeClass("invalid");
    $("#" + this.id).removeClass("valid");

    if ((val.length < 5) || (val.length > 15)) {
      err = true;
    }
    if (illegalChars.test(val)) {
      err = true;
    }
    if (err === true) {
      $("#" + this.id).addClass("invalid");
    } else {
      $("#" + this.id).addClass("valid");
    }
  });

  $("#sign-up-box").on("submit", function (evt) {
    evt.preventDefault();

    var url = "", username, email, phone, password, repeatPassword, firstname, lastname, gender, birthday;

    username = $("#sign-up-box #sign-up-username").val()
    firstname = $("#sign-up-box #sign-up-firstname").val()
    lastname = $("#sign-up-box #sign-up-lastname").val()
    email = $("#sign-up-box #sign-up-email").val()

    phone = $("#sign-up-box #phone").val()
    phone = phone.toString().match(/\d+/g).join("");
    if (phone.length > 0 && phone.length < 10 || phone.length > 10) {
      $("#error-signup").html("Phone format is incorrect. Should have 10 digits");
      return;
    }

    password = $("#sign-up-box #sign-up-password").val()
    repeatPassword = $("#sign-up-box #repeat-password").val()
    accountType = $("#sign-up-box #account-type").val()

    gender = $("#sign-up-box #sign-up-gender").val()
    if (gender === null) {
      //value 3 => gender unset
      gender = 3;
    }
    var brthd_day, brthd_month, brthd_year;
    brthd_day = $("#sign-up-box #birthday-day").val();
    brthd_month = $("#sign-up-box #birthday-month").val();
    brthd_year = $("#sign-up-box #birthday-year").val();
    birthday = new Date(brthd_year, brthd_month - 1, brthd_day);
    birthday = birthday.getTime();

    if (password !== repeatPassword) {
      alert("different password");
      return;
    }

    url += TEST_DOMAIN_URL_PREFIX;
    url += "/register";
    param = "firstname=" + firstname + "&username=" + username + "&lastname=" + lastname + "&password=" + password + "&email=" + email + "&phone=" + phone + "&accounttype=" + accountType + "&gender=" + gender + "&birthday=" + birthday;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        window.location.href = "page-login.html";
      } else if (this.status === 400) {
        $("#error-signup").html("Sign Up Failed ! Phone or Email is duplicated.");
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(param);
  });

  $("#search-button").on("click", function (evt) {
    evt.preventDefault();
    var sQuery = $('#search-location').val();
    var sName = $('#search-shop').val();
    var url;
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sQuery + "&key=AIzaSyAz54H1uS2XwJwJ-9bboGK6doocBWFP1AQ";

    if (sQuery !== "") {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function (data) {
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

          window.location.href = "list-bk.html?swlon=" + swlon + "&swlat=" + swlat + "&nelon=" + nelon + "&nelat=" + nelat + "&txt=" + sName + "&loc=" + sQuery;
        }
      };
      xhttp.open("GET", url, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // xhttp.setRequestHeader("Authorization", window.localStorage.getItem("candy"));
      xhttp.send();
    } else {
      window.location.href = "list-bk.html?swlon=-117.2824&swlat=32.5348&nelon=-116.9058&nelat=33.1142&loc=San%20Diego&txt=" + sName;
    }
  });

  // $("#explorer-profile-form input").focusout(function(e) {
  //     //this.id === e.originalEvent.relatedTarget.id &&
  //     if (this.value !== "" && this.getAttribute("value") !== this.value) {
  //         var tickElm = $("#" + this.id).next();
  //         if (tickElm.length === 1 && tickElm[0].id === "tick-status") {
  //             this.parentElement.removeChild(document.getElementById("tick-status"));
  //         }

  //         if (this.value !== this.getAttribute("value")) {
  //             var url = "", param;
  //             var that = this;
  //             url += TEST_DOMAIN_URL_PREFIX;
  //             url += "/update_user_profile";
  //             param = this.id + "=" + this.value;
  //             var xhttp = new XMLHttpRequest();
  //             xhttp.onreadystatechange = function(data) {
  //                 if (this.readyState == 4 && this.status == 200) {
  //                     addSuccessTick(that);
  //                 }
  //             };
  //             xhttp.open("POST", url, true);
  //             xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //             xhttp.send(param);
  //         }
  //     }

  //   });

  //   $("#explorer-profile-form textarea").focusout(function(e) {
  //     if (this.value !== "" && this.getAttribute("value") !== this.value) {
  //         var tickElm = $("#" + this.id).next();

  //         //TODO grammarly bug
  //         if (tickElm.length === 1 && tickElm[0].id === "tick-status") {
  //             this.parentElement.removeChild(document.getElementById("tick-status"));
  //         }

  //         if (this.value !== this.getAttribute("value")) {
  //             var url, param;
  //             var that = this;
  //             url = "http://localhost:8000/update_user_profile";
  //             param = this.id + "=" + this.value;
  //             var xhttp = new XMLHttpRequest();
  //             xhttp.onreadystatechange = function(data) {
  //                 if (this.readyState == 4 && this.status == 200) {
  //                     addSuccessTick(that);
  //                 }
  //             };
  //             xhttp.open("POST", url, true);
  //             xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //             xhttp.send(param);
  //         }
  //     }

  //   });

  //   function addSuccessTick(that) {
  //       var elm = document.createElement("p");
  //       elm.setAttribute("id", "tick-status");
  //       var cnt = document.createTextNode("\u2714");
  //       elm.appendChild(cnt);
  //       that.parentNode.append(elm);
  //       that.setAttribute("value", that.value);
  //   }

});

$(function () {
  $("#rate-star").rating({
    size: 'xs',
    theme: 'krajee-fa',
    showClear: false,
    clearCaption: '',
    defaultCaption: '',
    captionElement: "#caption-rate",
    starCaptions: function (val) {
      if (val === 1) {
        return 'Not for me';
      }
      else if (val === 2) {
        return 'I dislike it';
      }
      else if (val === 3) {
        return 'It is OK';
      }
      else if (val === 4) {
        return 'Like better';
      }
      else if (val === 5) {
        return 'Highly preferred';
      } else {
        return;
      }
    },

    starCaptionClasses: { 1: 'text-danger', 2: 'text-warning', 3: 'text-info', 4: 'text-primary', 5: 'text-success' }
  });
});
