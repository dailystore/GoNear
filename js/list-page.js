$(function () {
  var TEST_DOMAIN_URL_PREFIX = "";
  //TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";

  $("#search-shop").val(getParameterByName('txt'));
  $('#search-location').val(getParameterByName('loc'));

  loadInAreaLocations();

  var stickyTop = $('.sticky-map').offset().top;

  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= stickyTop) {
      // $('.sticky-map').css({position: "fixed", top: "0px", width: "100%", left: "0"});
      $('.sticky-map').addClass("stick-map-up")
      $('.list-store').addClass("stick-active")
      $('.sticky-filter').addClass("sticky-filter-active")
    } else {
      // $('.sticky-map').css({position: "relative", top: "0px", width: "auto", left: "auto"});
      $('.sticky-map').removeClass("stick-map-up")
      $('.list-store').removeClass("stick-active")
      $('.sticky-filter').removeClass("sticky-filter-active")
    }
  });

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function initMap(aLocation) {
    aLocation = [["Board Game Station", 10.765480, 106.667580], ["Union Jack's Fish & Chips", 10.772470, 106.702920], ["Indika Saigon (House of Curiosity)", 10.792610, 106.697340], ["Adina Art Studio", 10.728280, 106.713990]];
    var map = new google.maps.Map(document.getElementById('map-container'), {
      zoom: 12,
      center: new google.maps.LatLng(aLocation[1][1], aLocation[1][2]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < aLocation.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(aLocation[i][1], aLocation[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(aLocation[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
  }

  function loadInAreaLocations() {

    // var sQuery = window.location.href.split("?")[1];
    // var url = "";
    // url += TEST_DOMAIN_URL_PREFIX;
    // url += "/api/s/search?" + sQuery;

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function(data) {
    // 	if (this.readyState == 4 && this.status == 200) {
    // 		var oData = JSON.parse(this.responseText);
    // 		var aData = [];
    // 		var bigList = [];
    // 		for (var i = 0; i < oData.length; i++) {
    // 			var sName = oData[i].name;
    // 			var sAddr = oData[i].addr.formal.split(", USA")[0];
    // 			var sPhone = oData[i].phones != "" ? " - " + oData[i].phones : "";
    // 			var sBusinessGeoParam = "!lat=" + oData[i].coor.lat + "!lon=" + oData[i].coor.lon;
    // 			var imglogoname = "img/sample/" + oData[i].imglogoname;
    // 			var imgbannername = "img/sample/" + oData[i].imgbannername;
    // 			/*var item = '<div class="row mb10"> <!--Image column--> <div class="col-md-2 col-12"> <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg"> </div> <!--/.Image column--> <!--Content column--> <div class="col-md-10 col-12"> <h3 class="user-name mb0"> <a href="details.html?sAddr=' + sAddr + sPhone + '!name=' + sName + sBusinessGeoParam + imglogoname + imgbannername + '" class="hover-link inline-block">' + sName + '</a> </h3> <div class="card-data pt0"> <ul> <li class="comment-date"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <strong>333 reviews</strong> </li> </ul><ul> <li> <i class="fa fa-map-marker"></i>' + sAddr + '</li> </ul><ul> <li> <a href="#" class="hover-link"> <i class="fa fa-home ml0 mr0"></i> www.abc.com </a> </li> </ul> </div> </div> <!--/.Content column--> </div>';*/
    // 			var item = '<div class="row mb10"> <!--Image column--> <div class="col-md-2 col-12"> <img src="'+ imglogoname +'"> </div> <!--/.Image column--> <!--Content column--> <div class="col-md-10 col-12"> <h3 class="user-name mb0"> <a href="details.html?id='+ oData[i].id +'" class="hover-link inline-block">' + sName + '</a> </h3> <div class="card-data pt0"> <ul> <li class="comment-date"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <strong>333 reviews</strong> </li> </ul><ul> <li> <i class="fa fa-map-marker"></i>' + sAddr + '</li> </ul><ul> <li> <a href="#" class="hover-link"> <i class="fa fa-home ml0 mr0"></i> www.abc.com </a> </li> </ul> </div> </div> <!--/.Content column--> </div>';
    // 			// $("#list-store").append(item);
    // 			bigList.push(item);
    // 			aData.push([sName, oData[i].coor.lat, oData[i].coor.lon]);
    // 		}
    // 		$("#list-store").append(bigList.join(''));
    // 		initMap(aData);
    // 	}
    // };
    // xhttp.open("GET", url, true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // // xhttp.setRequestHeader("Authorization", window.localStorage.getItem("candy"));
    // xhttp.send();

    var aData = [];
    initMap(aData);
  }
});
