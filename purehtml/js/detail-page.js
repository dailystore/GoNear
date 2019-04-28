$(function() {
	var TEST_DOMAIN_URL_PREFIX = "";
	//TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";
	
    loadInAreaLocations();

    var parent = $('#b-info-overview');

    function ReadMoreClick(ev) {
        var btn = $(this);
        var container = btn.closest('.b-info-overview-item');
        if (container.hasClass('col-lg-4')) {
            var sibl = container.removeClass('col-lg-4').addClass('col-lg-10').siblings().removeClass('col-lg-4').addClass('col-lg-1');
            sibl.find('.card-body').addClass('d-none');
            sibl.find('.card-header').addClass('card-header-stretch-height');
            container.find('.collapse').addClass('show');
        } else {
            var sibl = container.removeClass('col-lg-10 col-lg-1').addClass('col-lg-4').siblings().removeClass('col-lg-10 col-lg-1').addClass('col-lg-4');
            parent.find('.card-body.d-none').removeClass('d-none');
            parent.find('.card-header.card-header-stretch-height').removeClass('card-header-stretch-height');
            parent.find('.collapse.show').removeClass('show');
        }

        ev.preventDefault();
    }

    $('.r-more-btn').click(ReadMoreClick);
    parent.find('.card-header').click(ReadMoreClick);

    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        loop: true,
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 3,
        keyboardControl: true,
        mousewheelControl: false,
        lazyLoading: true,
        preventClicks: false,
        preventClicksPropagation: false,
        lazyLoadingInPrevNext: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slideToClickedSlide: true,
        coverflow: {
            rotate: 0,
            stretch: 0,
            depth: 250,
            modifier: 1,
            slideShadows : false,
        },
        breakpoints: {
            767: {
                slidesPerView: 1,
                initialSlide: 1,
                pagination: '.swiper-pagination'
            },
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

	function loadInAreaLocations() {
		var sQuery = window.location.href.split("?");
		if (sQuery.length == 1) {
			var sImgLogoName = '<img src="img/sample/samp-1.jpg" class="img-fluid mx-auto" alt=""><a><div class="mask waves-effect waves-light"></div></a>';
			var sImgBannerName = '<img src="img/sample/banner-kichi-sample.jpg" alt="" class="img-fluid d-block mx-auto"/>'
			$("#address").append("72 Le Thanh Ton, Ben Nghe, Quan 1, Ho Chi Minh");
			$("#business-logo").append(sImgLogoName);
			$("#business-banner").append(sImgBannerName);
			initMap(10.7782416, 106.7019958);
			return;
		}
		
		var url = "";
		url += TEST_DOMAIN_URL_PREFIX;
		url += "/api/biz/" + getParameterByName("id");
		
		$.get(url, function(dataObj) {
			document.title = dataObj.name + " | GoOhYeah";
			$("#brand-title").html(dataObj.name);
			$("#address").append(dataObj.addr.formal.split(", USA")[0]);
			
			if (dataObj.web) {
				$("#biz-website").html(dataObj.web).attr("href", "http://" + dataObj.web);
			} else {
				$("#biz-website").html("N/A");
			}
			
			if (dataObj.phones.length > 0) {
				$("#biz-phone").html(dataObj.phones[0]).attr("href", "tel:"+dataObj.phones[0]);
			}
			
			var sImgLogoName = '<img src="img/sample/' + dataObj.imglogoname + '" class="img-fluid mx-auto" alt=""><a><div class="mask waves-effect waves-light"></div></a>';
			var sImgBannerName = '<img src="img/sample/' + dataObj.imgbannername + '" alt="" class="img-fluid d-block mx-auto"/>'
			$("#business-logo").append(sImgLogoName);
			$("#business-banner").append(sImgBannerName);
			initMap(dataObj.coor.lat, dataObj.coor.lon);
		}).fail(function() {
			alert( "business not found" );
		});
		
		/*var sAddr = decodeURIComponent(sQuery[1].split("!")[0].split("=")[1]);
		var sName = decodeURIComponent(sQuery[1].split("!")[1].split("=")[1]);
		var sBrandTitle = `<strong>` + sName + `</strong>`;
		var lat = parseFloat(sQuery[1].split("!")[2].split("=")[1]);
		var lon = parseFloat(sQuery[1].split("!")[3].split("=")[1]);
		var sImgLogoName = sQuery[1].split("!")[4].split("=")[1];
		sImgLogoName = '<img src="img/sample/' + sImgLogoName + '" class="img-fluid mx-auto" alt=""><a><div class="mask waves-effect waves-light"></div></a>';
		var sImgBannerName = sQuery[1].split("!")[5].split("=")[1];
		sImgBannerName = '<img src="img/sample/' + sImgBannerName + '" alt="" class="img-fluid d-block mx-auto"/>'
		$("#brand-title").append(sBrandTitle);
		$("#address").append(sAddr);
		$("#business-logo").append(sImgLogoName);
		$("#business-banner").append(sImgBannerName);
		initMap(lat, lon);*/
	}

	function initMap(lat, lon) {
		var myLatLng = {lat: lat, lng: lon};

		var map = new google.maps.Map(document.getElementById('map-container'), {
			zoom: 15,
			center: myLatLng
		});

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: 'Hello World!'
		});
	}
});
