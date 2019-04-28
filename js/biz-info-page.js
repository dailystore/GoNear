$(function() {
	var BIZ_ID = getParameterByName("id");
	if (!BIZ_ID) {
		alert("empty id");
	}

	var TEST_DOMAIN_URL_PREFIX = "";
	TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";
	var DEFAULT_LAT_LON = {
		lat: 10.7782416,
		lng: 106.7019958
	};
	var DEFAULT_MAP_GEOCODE_DELAY = 1000; //ms

	var BIZ_HILI_IMG_ROOT_URL = TEST_DOMAIN_URL_PREFIX + "/api/biz/" + BIZ_ID + "/img";

	var map = new google.maps.Map(document.getElementById('map-container'), {
		zoom: 15,
		center: DEFAULT_LAT_LON
	});

	var marker = new google.maps.Marker({
		position: DEFAULT_LAT_LON,
		map: map,
		draggable: true,
		title: 'Hello World!'
	});

	loadData();
	loadStaffHighListList();
	loadSpecialty();
	prepareHiLiImg();

	$("#profile-history-save").click(addProfileHistory);
	$("#profile-history-discard").click(discardProfileHistory);

	$("#biz-dress-code-save-btn").click(updateDressCode);
	$("#biz-dress-code-discard-btn").click(discardDressCode);

	$("#biz-echo-save-btn").click(updateEcho);
	$("#biz-echo-discard-btn").click(discardEcho);

	$("#price-range-save-btn").click(updatePrice);
	$("#price-range-discard-btn").click(discardPrice);

	function discardPrice() {
		$("#price-range-from").val($("#price-range-from-tmp").val());
		$("#price-range-to").val($("#price-range-to-tmp").val());
	}

	function updatePrice() {
		var priceFrom = $("#price-range-from").val();
		var priceTo = $("#price-range-to").val();

		if (priceFrom > priceTo) {
			alert("Min price should be less than Max price");
			return;
		}

		var action = "update-price";
		updateData(action);
	}

	function updateEcho() {
		var action = "update-echo";
		updateData(action);
	}

	function discardEcho(elm) {
		$("#biz-echo-field").val($("#biz-echo-tmp").val());
	}

	function updateDressCode() {
		var action = "update-dress-code";
		updateData(action);
	}

	function discardDressCode(elm) {
		$("#biz-dress-code-field").val($("#biz-dress-code-tmp").val());
	}

	function discardProfileHistory(elm) {
		$("#profile-history").val($("#profile-history-tmp").val());
	}

	function addProfileHistory() {
		var action = "update-profile";
		updateData(action);
	}

	function loadSpecialty() {

		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;

		$("#specialty-list-hidden").val("");

		$.get(url, function(resp) {
			$("#specialty-list-hidden").val(resp.specialty);
			var itm = resp.specialty.split(",");
			if (itm.length > 0 && itm[0] !== "") {
				for (var i = 0; i < itm.length; i++) {
					var cnt = `
						<li class="list-group-item d-flex justify-content-between align-items-center">
							` + itm[i] + `
							<a href="#">
								<span class="badge badge-danger badge-pill">
									<i onclick="deleteSpecialty(this)" id="specialty-` + i + `" class="fa fa-times" aria-hidden="true"></i>
								</span>
							</a>
						</li>
					`;
					$("#specialty-list").append(cnt);
				}
			}
		}).fail(function() {});


	}

	$("#specialty-add-btn").click(addSpecialty);

	function addSpecialty() {
		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;

		this.specialty = $("#biz-specialties").val();
		if (this.specialty === "") {
			alert("Need to input value");
			return;
		}

		var storeSpecialty = $("#specialty-list-hidden").val();
		if (storeSpecialty !== "") {
			storeSpecialty += ",";
		}
		storeSpecialty += this.specialty;

		var that = this;
		$.ajax({
			url: url,
			type: 'PUT',
			data: {
				specialty: storeSpecialty
			},
			success: function(response) {
				var idx = $("#specialty-list").children().length;
				var cnt = `
					<li class="list-group-item d-flex justify-content-between align-items-center">
						` + that.specialty + `
						<a href="#">
							<span class="badge badge-danger badge-pill">
								<i onclick="deleteSpecialty(this)" id="specialty-` + idx + `" class="fa fa-times" aria-hidden="true"></i>
							</span>
						</a>
					</li>
				`;
				$("#specialty-list").append(cnt);
				$("#biz-specialties").val("");
				$("#specialty-list-hidden").val(storeSpecialty);
			},
			error: function() {
				alert("unable to update Business");
			}
		});
	}

	$("#promotion-add-btn").click(addPromotion);

	function addPromotion() {
		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;

		this.promotion = $("#biz-promotion").val();
		if (this.promotion === "") {
			alert("Need to input value");
			return;
		}

		var storePromotion = $("#promotion-list-hidden").val();
		if (storePromotion !== "") {
			storePromotion += ",";
		}
		storePromotion += this.promotion;

		var that = this;
		$.ajax({
			url: url,
			type: 'PUT',
			data: {
				promo: storePromotion
			},
			success: function(response) {
				var idx = $("#promotion-list").children().length;
				var cnt = `
				<div class="card-header promotion-tool-bar transparent white-text">
					<p class="mb0">
						<strong class="label-promotion">
							` + that.promotion + `
						</strong>
						<a onclick="deletePromotion(this)" id="promotion-` + idx + `" href="javascript:void(0);" class="d-inline-block">
							<img src="img/icon/trash.png" alt="" width="20">
							Remove
						</a>
					</p>
				</div>
				`;
				$("#promotion-list").append(cnt);
				$("#biz-promotion").val("");
				$("#promotion-list-hidden").val(storePromotion);
			},
			error: function() {
				alert("unable to update Business");
			}
		});
	}

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

			//For loading profile introduction data
			$("#profile-history").val(dataObj.intro);
			$("#profile-history-tmp").val(dataObj.intro);

			//For loading dress code data
			$("#biz-dress-code-field").val(dataObj.dresscode);
			$("#biz-dress-code-tmp").val(dataObj.dresscode);

			//For loading echo data
			$("#biz-echo-field").val(dataObj.echo);
			$("#biz-echo-tmp").val(dataObj.echo);

			//For loading price data
			$("#price-range-from").val(dataObj.pricemin);
			$("#price-range-from-tmp").val(dataObj.pricemin);
			$("#price-range-to").val(dataObj.pricemax);
			$("#price-range-to-tmp").val(dataObj.pricemax);

			$('.mdb-select').material_select('destroy');
			$('.mdb-select').material_select();

			// $('#price-range-from option[value='+ dataObj.pricemin +']').attr('selected','selected');
			// $("#price-range-from-tmp").val(dataObj.pricemin);
			// $('#price-range-to option[value='+ dataObj.pricemax +']').attr('selected','selected');
			// $("#price-range-to-tmp").val(dataObj.pricemax);

			//For loading promotion data
			$("#promotion-list-hidden").val(dataObj.promo);
			var itm = dataObj.promo.split(",");
			if (itm.length > 0 && itm[0] !== "") {
				for (var i = 0; i < itm.length; i++) {
					var cnt = `
						<div class="card-header promotion-tool-bar transparent white-text">
							<p class="mb0">
								<strong class="label-promotion">
									` + itm[i] + `
								</strong>
								<a onclick="deletePromotion(this)" id="promotion-` + i + `" href="javascript:void(0);" class="d-inline-block">
									<img src="img/icon/trash.png" alt="" width="20">
									Remove
								</a>
							</p>
						</div>
					`;
					$("#promotion-list").append(cnt);
				}
			}
		}).fail(function() {
			alert("business not found");
		});

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/cat";

		$.get(url, function(dataObj) {
			//console.log(dataObj);
			var catLabels = [];
			var catPath = [];
			for (var i = 0; i < dataObj.length; i++) {
				var cat = dataObj[i];
				if (cat.lv <= catPath.length) {
					catPath.length = cat.lv - 1;
				} else if (cat.lv - 1 > catPath.length) {
					catPath.push(dataObj[i - 1].label);
				}

				if (catPath.length == 0) {
					catLabels.push({
						value: cat.label,
						data: cat.name
					});
					continue;
				}

				catLabels.push({
					value: "" + catPath.join(" > ") + " > " + cat.label,
					data: cat.name
				});
			}
			$("#form-cate-1").autocomplete({
				lookup: catLabels,
				autoSelectFirst: true,
				showNoSuggestionNotice: true,
				formatResult: function(suggestion, currentValue) {
					return '<img src="img/icon/save.png" alt="" width="20">' + JSON.stringify(suggestion);
				},
			});
			//console.log(catLabels);
		}).fail(function() {
			alert("categories not found");
		});
	}

	function initMap(lat, lon) {
		var myLatLng = {
			lat: lat,
			lng: lon
		};

		marker.setPosition(myLatLng);
		map.setCenter(myLatLng);
	}

	function updateData(action) {
		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + id;

		var oData = {};

		if (action === "update-profile") {
			oData.intro = $("#profile-history").val();
		} else if (action === "update-dress-code") {
			oData.dresscode = $("#biz-dress-code-field").val();
		} else if (action === "update-echo") {
			oData.echo = $("#biz-echo-field").val();
		} else if (action === "update-price") {
			var priceFrom = $("#price-range-from").val();
			var priceTo = $("#price-range-to").val();
			oData.pricemin = priceFrom;
			oData.pricemax = priceTo;
		} else {
			oData = {
				name: $("#biz-name").val(),
				addrcasual: $("#biz-address-1").val(),
				addrextra: $("#biz-address-2").val(),
				web: $("#biz-web").val(),
				phones: $("#biz-phone").val().replace(/\D/g, ''), //strip all non-digits chars
				lat: coor.lat(),
				lon: coor.lng()
			};
		}

		var coor = marker.getPosition();

		$.ajax({
			url: url,
			type: 'PUT',
			data: oData,
			success: function(response) {
				alert("success!!!");
				if (action === "update-profile") {
					$("#profile-history-tmp").val(oData.intro);
				}
				if (action === "update-dress-code") {
					$("#biz-dress-code-tmp").val(oData.dresscode);
				}
				if (action === "update-echo") {
					$("#biz-echo-field-tmp").val(oData.echo);
				}
				if (action === "update-price") {
					$("#price-range-from-tmp").val(oData.pricemin);
					$("#price-range-to-tmp").val(oData.pricemax);
				}
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

			geocoder.geocode({
				'address': addr
			}, function(results, status) {
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

	// $("#set-profile-picture-btn").click(SetAvatar);

	function SetAvatar() {
		var formData = new FormData($("#set-profile-picture-form")[0]);
		formData.append('tax_file', $('input[type=file]')[0].files[0]);

		$.ajax({
			type: "POST",
			url: "/set_avatar",
			data: formData,
			//use contentType, processData for sure.
			contentType: false,
			processData: false,
			// beforeSend: function() {
			// 	$('.modal .ajax_data').prepend('<img src="' +
			// 		base_url +
			// 		'"asset/images/ajax-loader.gif" />');
			// 	//$(".modal .ajax_data").html("<pre>Hold on...</pre>");
			// 	$(".modal").modal("show");
			// },
			success: function(msg) {
				// $(".modal .ajax_data").html("<pre>" + msg +
				// 	"</pre>");
				// $('#close').hide();
			},
			error: function(msg) {
				// $(".modal .ajax_data").html(
				// 	"<pre>Sorry! Couldn't process your request.</pre>"
				// ); // 
				// $('#done').hide();
			}
		});
	}

	function addStaffHighlight() {
		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var staffName = $("#staff-name").val();
		var staffComment = $("#staff-comment").val();

		var url = "",
			param;
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/set_avatar";

		param += "staffName=" + staffName;
		param += "&staffComment=" + staffComment;
		param += "&bizId=" + id

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				$("#error-display").html("Change updated successfully !");
				$("html, body").animate({
					scrollTop: 0
				}, 400);
			}
		};
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(param);

	}

	function loadStaffHighListList() {

		var id = getParameterByName("id");
		if (!id) {
			return
		}

		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/get_staff_highlight_list/" + id;

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				var dataObj = JSON.parse(this.responseText).staff_list;
				if (dataObj.length === 0) {
					return
				}
				for (var i = 0; i < dataObj.length; i += 6) {
					var isManager = "";
					if (dataObj[i + 5] === "true") {
						isManager = " (Manager)";
					}
					var cnt = `
						<div class="media mb-1" id="staff-card-` + dataObj[i + 3] + `">
							<a class="media-left waves-light">
								<img style="width:100px; height:100px" class="rounded-circle" src="/get_staff_avatar/` + dataObj[i] + `">
							</a>
							<div class="media-body">
								<h4 class="media-heading"><span id="staff-name">` + dataObj[i + 1] + isManager + `</span></h4>
								<p>
									<a onclick="editStaffData(this)" id="` + dataObj[i + 3] + `" href="javascript:void(0);" class="d-inline-block">
										<img src="img/icon/pencil.png" alt="" width="20">
										Edit
									</a>
				
									<a onclick="updateStaffData(this)" id="` + dataObj[i + 3] + `" href="javascript:void(0);" class="d-inline-block">
										<img src="img/icon/save.png" alt="" width="20">
										Save
									</a>
				
									<a onclick="removeStaffData(this)" id="` + dataObj[i + 3] + `" href="javascript:void(0);" class="d-inline-block">
										<img src="img/icon/trash.png" alt="" width="20">
										Remove
									</a>
								</p>
								<textarea class="md-textarea" name="" id="staff-input-` + dataObj[i + 3] + `" cols="30" rows="10">` + dataObj[i + 2] + `</textarea>
							</div>
						</div>
					`;
					$(".staff-highlight-list").append(cnt);
				}
			}
		};
		xhttp.open("GET", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send();

	}

	function loadHiLiImgList(initialPreview, initialPreviewConfig) {
		$("#fileUpload").fileinput({
			uploadUrl: BIZ_HILI_IMG_ROOT_URL,
			uploadAsync: true,

			theme: "fa",
			initialPreviewShowDelete: true,
			browseClass: "btn btn-primary bg-orange",
			uploadClass: "btn btn-success",
			removeClass: "btn btn-danger",
			showCaption: true,
			showDrag: false,
			dropZoneEnabled: false,
			overwriteInitial: false,
			initialPreviewAsData: true,
			deleteUrl: "#",
			progressClass: 'hide',
			initialPreview: initialPreview,
			initialPreviewConfig: initialPreviewConfig
		});
	}

	function prepareHiLiImg() {

		if (!BIZ_ID) {
			loadHiLiImgList([
				"http://lorempixel.com/1920/1080/transport/1",
				"http://lorempixel.com/1920/1080/transport/2",
				"http://lorempixel.com/1920/1080/transport/3"
			], [{
				caption: "transport-1.jpg",
				size: 329892,
				width: "120px",
				url: "{$url}",
				key: 1,
				showDrag: false
			}, {
				caption: "transport-2.jpg",
				size: 872378,
				width: "120px",
				url: "{$url}",
				key: 2,
				showDrag: false
			}, {
				caption: "transport-3.jpg",
				size: 632762,
				width: "120px",
				url: "{$url}",
				key: 3,
				showDrag: false
			}]);
			return;
		}

		$.get(BIZ_HILI_IMG_ROOT_URL, function(data) {
			var initialPreview = [],
				initialPreviewConfig = [];

			for (var i = 0; i < data.length; i++) {
				var url = BIZ_HILI_IMG_ROOT_URL + "/" + data[i].fileid;
				initialPreview.push(url);
				initialPreviewConfig.push({
					width: "120px",
					url: url,
					key: i + 1,
					showDrag: false
				});
			}

			loadHiLiImgList(initialPreview, initialPreviewConfig);
		}).fail(function() {
			loadHiLiImgList([]);
			return;
		});
	}

});

function SaveStaffAvatar() {
	var bizId = getParameterByName("id");
	var staffName = $("#staff-name").val();
	var staffComment = $("#staff-comment").val();
	var staffIsManager = $("#staff-is-manager-chkbox").is(":checked")
	document.getElementById('set-profile-picture-form').action = "https://team.goohyeah.com/set_staff_avatar/" + bizId + "/" + staffName + "/" + staffComment + "/" + staffIsManager;
	return true;
}

function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function deleteSpecialty(elm) {
	var action = "delete-specialty";
	deleteBizData(elm, action);
}

function deletePromotion(elm) {
	var action = "delete-promotion";
	deleteBizData(elm, action);
}

function deleteBizData(elm, action) {
	var id = getParameterByName("id");
	if (!id) {
		return
	}

	var url = "";
	url += "/api/biz/" + id;

	var oData = {};

	if (action === "delete-specialty") {
		var elmId = elm.id.substr(10);
		var aCurrentSpecialty = $("#specialty-list-hidden").val().split(",");
		aCurrentSpecialty.splice(elmId, 1);
		oData.specialty = aCurrentSpecialty.toString();
	}

	if (action === "delete-promotion") {
		var elmId = elm.id.substr(10);
		var aCurrentPromotion = $("#promotion-list-hidden").val().split(",");
		aCurrentPromotion.splice(elmId, 1);
		oData.promo = aCurrentPromotion.toString();
	}

	var that = this;
	$.ajax({
		url: url,
		type: 'PUT',
		data: oData,
		success: function(response) {
			if (action === "delete-specialty") {
				$("#specialty-list-hidden").val(aCurrentSpecialty.toString());
				var child = document.getElementById(elm.id).parentElement.parentElement.parentElement;
				var parent = document.getElementById("specialty-list");
				parent.removeChild(child);
			}

			if (action === "delete-promotion") {
				$("#promotion-list-hidden").val(aCurrentPromotion.toString());
				var child = document.getElementById(elm.id).parentElement.parentElement;
				var parent = document.getElementById("promotion-list");
				parent.removeChild(child);
			}


		},
		error: function() {
			alert("unable to update Business");
		}
	});
}

function updateStaffData(evt) {
	var id = evt.id
	if (!id) {
		return
	}

	var url = "";
	url += "/update_staff/" + id;

	var oData = {};
	oData.comment = $("#staff-input-" + id).val();

	$.ajax({
		url: url,
		type: 'PUT',
		data: oData,
		success: function(response) {
			alert("success!!!");
		},
		error: function() {
			alert("unable to update Staff data");
		}
	});
}

function removeStaffData(evt) {
	var id = evt.id
	if (!id) {
		return
	}

	var url = "";
	url += "/delete_staff/" + id;

	$.ajax({
		url: url,
		type: 'DELETE',
		success: function(response) {
			alert("success!!!");
			debugger;
			var parent = document.getElementsByClassName("staff-highlight-list");
			var child = document.getElementById("staff-card-" + id);
			parent[0].removeChild(child);
		},
		error: function() {
			alert("unable to update Staff data");
		}
	});

}