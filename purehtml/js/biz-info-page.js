$(function() {
	var TEST_DOMAIN_URL_PREFIX = "";
	//TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";
	var DEFAULT_LAT_LON = {lat: 10.7782416, lng: 106.7019958};
	var DEFAULT_MAP_GEOCODE_DELAY = 1000; //ms
	
	var map = new google.maps.Map(document.getElementById('map-container'), {
		zoom: 15,
		center: DEFAULT_LAT_LON
	});

	var marker = new google.maps.Marker({
		position: DEFAULT_LAT_LON,
		map: map,
		draggable:true,
		title: 'Hello World!'
	});
	
	loadData();

	// var map = new google.maps.Map(document.getElementById('map-container'), {
		// zoom: 10,
		// center: {
			// lat: 10.7782416,
			// lng: 106.7019958
		// },
		// mapTypeId: google.maps.MapTypeId.ROADMAP
	// });

	$('#edit-btn').click(function() {
		$(this).addClass("d-none");
		
		$('#discard-btn').removeClass("d-none");
		$('#save-btn').removeClass("d-none");
		
		$('#biz-basic-info input').prop('disabled', false);
	});
	
	$('#discard-btn').click(function() {
		$(this).addClass("d-none");
		$('#save-btn').addClass("d-none");
		
		$('#edit-btn').removeClass("d-none");
		$('#biz-basic-info input').prop('disabled', true);
		loadData();
	});
	$('#save-btn').click(function() {
		$(this).addClass("d-none");
		$('#discard-btn').addClass("d-none");
		
		$('#edit-btn').removeClass("d-none");
		updateData();
	});

	function getParameterByName(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	function loadData() {
		var id = getParameterByName("id");
		if (!id) {
			alert("empty id");
			return
		}

		//load biz info to inputs
		
		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;
		
		$.get(url, function(dataObj) {
			document.title = dataObj.name + " | GoOhYeah";
			$("#biz-name").val(dataObj.name);
			$("#biz-address-1").val(dataObj.addr.casual);
			$("#biz-address-2").val(dataObj.addr.extra);
			$("#biz-web").val(dataObj.web);
			
			marker.setTitle(dataObj.name);
			initMap(dataObj.coor.lat, dataObj.coor.lon);
		}).fail(function() {
			alert( "business not found" );
		});
	}

	function initMap(lat, lon) {
		var myLatLng = {lat: lat, lng: lon};

		marker.setPosition(myLatLng);
		map.setCenter(myLatLng);
	}
	
	function updateData() {
		var id = getParameterByName("id");
		if (!id) {
			alert("empty id");
			return
		}
		
		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;
		
		var coor = marker.getPosition();
		
		$.ajax({
			url: url,
			type: 'PUT',
			data: {
				name: $("#biz-name").val(),
				addrcasual: $("#biz-address-1").val(),
				addrextra: $("#biz-address-2").val(),
				web: $("#biz-web").val(),
				phones: $("#biz-phone").val().replace(/\D/g, ''),//strip all non-digits chars
				lat: coor.lat(),
				lon: coor.lng()
			},
			success: function(response) {
				alert("success!!!");
			},
			error: function() {
				alert("unable to update Business");
			}
		});
	}
	
	(function() {
		var tmrId = null;
		var addrEle = $("#biz-address-1");
		var geocoder = new google.maps.Geocoder();
		
		function mapReload() {
			tmrId = null;
			var addr = addrEle.val();
			
			if (addr === "") {
				return
			}
			
			// addr !== "":
			
			geocoder.geocode( { 'address': addr}, function(results, status) {
				if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
					marker.setPosition(results[0].geometry.location);
				} else {
					console.log("unable to find any place that matches the address: " + status);
				}
			});
			
			return;
		}
		
		addrEle.keydown(function() {
			if (tmrId) {
				clearTimeout(tmrId);
			}
			
			tmrId = setTimeout(mapReload, DEFAULT_MAP_GEOCODE_DELAY);
		});
	})();
});