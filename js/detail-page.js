$(function () {

  window.localStorage.setItem("currentPage", window.location.href);

  var TEST_DOMAIN_URL_PREFIX = "";
  TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";

  loadInAreaLocations();
  loadBizReviews();
  loadAverageReviewCount();
  loadTop5RatingReviews();
  loadTotalReviewsCount();
  loadStaffHighLight();
  loadReviewStats();

  function loadReviewStats() {
    var url = "";
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_stats_summary?biz_id=" + window.location.href.split("?id=")[1];
    $.get(url, function (dataObj) {
      debugger;
      $("#5-star-review-count .media-body").append("<span class='review-progress'>" + dataObj.cntdetails[5] + " reviews</span>");
      $("#4-star-review-count .media-body").append("<span class='review-progress'>" + dataObj.cntdetails[4] + " reviews</span>");
      $("#3-star-review-count .media-body").append("<span class='review-progress'>" + dataObj.cntdetails[3] + " reviews</span>");
      $("#2-star-review-count .media-body").append("<span class='review-progress'>" + dataObj.cntdetails[2] + " reviews</span>");
      $("#1-star-review-count .media-body").append("<span class='review-progress'>" + dataObj.cntdetails[1] + " reviews</span>");

      $("#5-star-review-count .media-body .progress-bar").attr("style", "width:" + dataObj.cntdetails[5] / (dataObj.cntstarrated - 1) * 100 + "%");
      $("#4-star-review-count .media-body .progress-bar").attr("style", "width:" + dataObj.cntdetails[4] / (dataObj.cntstarrated - 1) * 100 + "%");
      $("#3-star-review-count .media-body .progress-bar").attr("style", "width:" + dataObj.cntdetails[3] / (dataObj.cntstarrated - 1) * 100 + "%");
      $("#2-star-review-count .media-body .progress-bar").attr("style", "width:" + dataObj.cntdetails[2] / (dataObj.cntstarrated - 1) * 100 + "%");
      $("#1-star-review-count .media-body .progress-bar").attr("style", "width:" + dataObj.cntdetails[1] / (dataObj.cntstarrated - 1) * 100 + "%");
    }).fail(function () {
      debugger;
    });
  }

  function loadStaffHighLight() {
    var url = "";
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/get_staff_highlight_list/" + window.location.href.split("?id=")[1];
    $.get(url, function (dataObj) {
      debugger;
      var data = dataObj.staff_list;
      for (var i = 0; i < data.length; i += 6) {
        var isActive;
        if (i === 0) {
          isActive = "active";
        } else {
          isActive = "";
        }
        var isManager = "";
        if (data[i + 5] === "true") {
          isManager = " (Manager)";
        }
        var cnt = `
                    <div class="carousel-item ` + isActive + `">
                        <div class="testimonial">
                            <!--Avatar-->
                            <div class="avatar">
                                <img style="width:70px; height:70px" src="/get_staff_avatar/` + data[i] + `" class="rounded-circle img-fluid" alt="Avatar">
                            </div>
                            <h4 class="mb10">
                                <a href="#" class="hover-link">
                                    ` + data[i + 1] + isManager + `
                                </a>
                            </h4>
                            <!--Content-->
                            <p><i class="fa fa-quote-left"></i>` + data[i + 2] + `</p>
                        </div>
                    </div>
                `;
        $("#staff-highlight-container").append(cnt);
      }
    }).fail(function () {
      debugger;
    });
  }

  function loadTotalReviewsCount() {
    var url = "";
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_count?biz_id=" + window.location.href.split("?id=")[1];
    $.get(url, function (dataObj) {
      $("#total-reviews-count").html(dataObj)
    }).fail(function () {
      debugger;
    });
  }

  function loadTop5RatingReviews() {
    var url = "";
    var that = this;
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_list?biz_id=" + window.location.href.split("?id=")[1] + "&star_sort=d&star_lim=5";
    $.get(url, function (dataObj) {
      for (var i = 0; i < dataObj.length; i++) {
        var isActive;
        if (i === 0) {
          isActive = "active";
        } else {
          isActive = "";
        }
        var sTopReview = `
                    <div class="carousel-item ` + isActive + `">
                        <div class="testimonial">
                            <!--Avatar-->
                            <div class="avatar">
                            <img style="width:70px; height:70px" src="/get_staff_avatar/` + dataObj[i].avatar_url + `" class="rounded-circle img-fluid" alt="Avatar">
                            </div>
                            <h4 class="mb10">
                                <a href="#" class="hover-link">
								` + dataObj[i].firstname + `
                                </a>
                            </h4>
                            <p><i class="fa fa-quote-left"></i> ` + dataObj[i].content + `</p>
                        </div>
                    </div>
                `;
        $('#biz-top-5-reviews').append(sTopReview);
      }

      debugger;
    }).fail(function () {
      debugger;
    });


  }

  function loadAverageReviewCount() {
    var url = "";
    var that = this;
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_average_star?biz_id=" + window.location.href.split("?id=")[1];

    $.get(url, function (dataObj) {
      debugger;
      $('#biz-average-star').html(Math.round(dataObj * 10) / 10);

      var avrStar = Math.round(dataObj * 100) / 100;
      var stars = document.getElementById("total-biz-star");

      for (var i = 0; i < Math.floor(avrStar); i++) {
        var star = document.createElement("i");
        star.className = "fa fa-star";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
      }

      var decStar = avrStar % 1;
      var roundedAvrStar = Math.floor(avrStar);
      if (decStar > 0.75) {
        var star = document.createElement("i");
        star.className = "fa fa-star";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
        roundedAvrStar = Math.ceil(avrStar);
      } else if (decStar > 0.25) {
        var star = document.createElement("i");
        star.className = "fa fa-star-half-o";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
        roundedAvrStar = Math.ceil(avrStar);
      }

      var remainingStars = 5 - roundedAvrStar;
      for (var z = 0; z < remainingStars; z++) {
        var star = document.createElement("i")
        star.className = "fa fa-star-o";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
      }

      var starDrillDown = document.createElement("i");
      starDrillDown.className = "fa fa-angle-down rotate-icon";
      stars.appendChild(starDrillDown);
      debugger;
    }).fail(function () {
      debugger;
    });
  }

  function loadBizReviews() {
    var url = "";
    var that = this;
    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_list?biz_id=" + window.location.href.split("?id=")[1];

    $.get(url, function (dataObj) {
      debugger;
      var sReviewItm, starCount;
      for (var i = 0; i < dataObj.length; i++) {
        starCount = dataObj[i].star !== null ? dataObj[i].star : "0";
        var stars = document.createElement("span");
        stars.className = "star-yellow";

        for (var j = 0; j < Math.floor(starCount); j++) {
          var star = document.createElement("i")
          star.className = "fa fa-star";
          star.setAttribute("aria-hidden", "hidden");
          stars.appendChild(star);
        }

        if (starCount % 1 > 0) {
          var star = document.createElement("i")
          star.className = "fa fa-star-half-o";
          star.setAttribute("aria-hidden", "hidden");
          stars.appendChild(star);
        }

        var remainingStars = 5 - Math.ceil(starCount);
        for (var z = 0; z < remainingStars; z++) {
          var star = document.createElement("i")
          star.className = "fa fa-star-o";
          star.setAttribute("aria-hidden", "hidden");
          stars.appendChild(star);
        }

        // var isThumbUpPressed, isThumbDownPressed;
        // if (dataObj[i].thumbup > 0) {
        //     isThumbUpPressed = "neural-up-pressed";
        // } else if (dataObj[i].thumbup === 0) {
        //     isThumbUpPressed = "neural-up";
        // }

        // if (dataObj[i].thumbdw > 0) {
        //     isThumbDownPressed = "neural-down-pressed";
        // } else if (dataObj[i].thumbdw === 0) {
        //     isThumbDownPressed = "neural-down";
        // }

        var crntUsr = JSON.parse(window.localStorage.getItem("candy"));
        var crntUsrID;
        if (crntUsr !== null) {
          crntUsrID = ", " + crntUsr.Id;
        } else {
          crntUsrID = "";
        }
        // if (dataObj[i].uid !== null) {
        //     if (dataObj[i].thumbup > 0) {

        //     }
        // }

        var thDownCnt = dataObj[i].thumbdw;
        if (thDownCnt === 1) {
          thDownCnt = "-" + thDownCnt
        }

        sReviewItm = `
                    <div class="news" id="review-user-container">
                        <div class="label">
                            <img style="width:40px; height:40px" src="/get_staff_avatar/` + dataObj[i].avatar_url + `" class="rounded-circle z-depth-1-half">
                        </div>
                        <div class="excerpt">
                            <div class="brief">
                                <a class="name" id="review-user-name">` + dataObj[i].firstname + `</a> wrote a review<div class="date" id="review-user-time">1 hour ago ` + dataObj[i].lastupd + `</div> <div id="review-user-star">` + stars.outerHTML + `</div>
                            </div>
                            <div class="added-text" id="review-content-list">` + dataObj[i].content + `</div>
                            <div class="feed-footer">
                                <a class="comment" data-toggle="collapse" href="#reply-1" aria-expanded="false" aria-controls="reply-1">Comment</a> &middot;
                                <span><a>0</a></span>
                                <a id="review-user-thumb-up" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-up neural-up"></i><span id="` + dataObj[i].rid + `" class="total-up-count">` + dataObj[i].thumbup + `</span></a>
                                <a id="review-user-thumb-down" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I don't like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-down neural-down"></i><span id="` + dataObj[i].rid + `" class="total-down-count">` + thDownCnt + `</span></a>
                                <a class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="Report bad review"><i class="fa fa-flag"></i></a>
                            </div>
                        </div>
                    </div>
                `;
        $('#review_container').append(sReviewItm);
      }
      GetThumbById();
      debugger;
    }).fail(function () {
      debugger;
    });
  }

  function GetThumbById() {

    var url = "";
    var that = this;
    url += TEST_DOMAIN_URL_PREFIX;

    var crntUsr = JSON.parse(window.localStorage.getItem("candy"));
    var crntUsrID;
    if (crntUsr !== null) {
      crntUsrID = crntUsr.Id;
    } else {
      crntUsrID = "";
      console.log("You have not logged in to get your thumbs");
      return;
    }

    url += "/review_list_thumb_by_id?biz_id=" + window.location.href.split("?id=")[1] + "&user_id=" + crntUsrID;

    $.get(url, function (dataObj) {
      var rid;
      if (dataObj !== null) {
        for (var i = 0; i < dataObj.length; i++) {
          rid = dataObj[i].rid;
          if (dataObj[i].positive === false) {
            $("i[id='" + rid + "'][class='fa fa-thumbs-down neural-down']").removeClass("neural-down");
            $("i[id='" + rid + "'][class='fa fa-thumbs-down']").addClass("neural-down-pressed");
          } else {
            $("i[id='" + rid + "'][class='fa fa-thumbs-up neural-up']").removeClass("neural-up");
            $("i[id='" + rid + "'][class='fa fa-thumbs-up']").addClass("neural-up-pressed");
          }
        }
      }
    });
  }

  function AddReview() {
    var url = "",
      sParam;
    var that = this;

    var star_rating = $("#rate-star").val();
    if (star_rating === "") {
      star_rating = 0;
    }

    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_add";
    sParam = "biz_id=" + window.location.href.split("?id=")[1];
    sParam += "&review_content=" + $('#review_txt').val();
    sParam += "&star_rating=" + star_rating;

    var crntUsr = JSON.parse(window.localStorage.getItem("candy"));
    if (crntUsr === null) {
      alert("You need to log in to leave a review for the community.");
      return;
    }

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         debugger;
    //         // var jsonResp = JSON.parse(this.responseText);
    //         // if (jsonResp.status !== "OK") {
    //         //     alert("Unable to find the described location!!! Please try again with some other terms or wipe it blank for default to Ho Chi Minh.");
    //         //     $('#search-location').focus();
    //         //     return;
    //         // }
    //         // var oData = jsonResp.results;
    //     }
    // };
    // xhttp.open("POST", url, true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhttp.send(sParam);

    $.post(url, sParam, function (dataObj) {

      //reset rating to 0
      $('#rate-star').rating('update', 0);

      $.fn.goTo = function () {
        $('html, body').animate({
          scrollTop: $(that).offset().top - 50 + 'px'
        }, 'fast');
        return that; // for chaining...
      }

      var starCount = this.data.split("&")[2].split("=")[1];
      var stars = document.createElement("span");
      stars.className = "star-yellow";

      for (var j = 0; j < Math.floor(starCount); j++) {
        var star = document.createElement("i")
        star.className = "fa fa-star";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
      }

      if (starCount % 1 > 0) {
        var star = document.createElement("i")
        star.className = "fa fa-star-half-o";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
      }

      var remainingStars = 5 - Math.ceil(starCount);
      for (var z = 0; z < remainingStars; z++) {
        var star = document.createElement("i")
        star.className = "fa fa-star-o";
        star.setAttribute("aria-hidden", "hidden");
        stars.appendChild(star);
      }

      var sNewReview = `
                <div class="news">
                    <!--Label-->
                    <div class="label">
                        <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1-mini.jpg" class="rounded-circle z-depth-1-half">
                    </div>
                    <!--Excert-->
                    <div class="excerpt">
                        <!--Brief-->
                        <div class="brief">
                            <a class="name">` + JSON.parse(window.localStorage.getItem("candy")).Phone + `</a> wrote a review<div class="date">Just posted now</div><div id="review-user-star">` + stars.outerHTML + `</div>
                        </div>
                        <!--Added text-->
                        <div class="added-text">` + this.data.split("&")[1].split("=")[1] + `</div>
                        <!--Feed footer-->
                        <div class="feed-footer">
                            <a class="comment" data-toggle="collapse" href="#reply-1" aria-expanded="false" aria-controls="reply-1">Comment</a> &middot;
                            <span><a>0</a></span>
                            <a id="review-user-thumb-up" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I like it"><i id="` + dataObj + `" onclick="reviewSetThumb(` + dataObj + ", " + JSON.parse(window.localStorage.getItem("candy")).Id + ", " + "event" + ` )" class="fa fa-thumbs-up neural-up"></i><span id="` + dataObj + `" class="total-up-count">0</span></a>
                            <a id="review-user-thumb-down" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I don't like it"><i id="` + dataObj + `" onclick="reviewSetThumb(` + dataObj + ", " + JSON.parse(window.localStorage.getItem("candy")).Id + ", " + "event" + ` )" class="fa fa-thumbs-down neural-down"></i><span id="` + dataObj + `" class="total-down-count">0</span></a>
                            <a class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="Report bad review"><i class="fa fa-flag"></i></a>
                        </div>
                    </div>
                </div>
            `;
      $('#review_container').prepend(sNewReview);
      $('#review_container').goTo();
      $('#review_txt').val("");
      $("#rate-star .jq-ry-rated-group")[0].setAttribute("style", "");
      $('#biz-review-navigation-newest>a').trigger('click');

      //reload Customer Spotlight
      // loadTop5RatingReviews();
      if (starCount === "5") {
        var sTopReview = `
                    <div class="carousel-item">
                        <div class="testimonial">
                            <!--Avatar-->
                            <div class="avatar">
                                <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg" class="rounded-circle img-fluid" alt="First sample avatar image">
                            </div>
                            <h4 class="mb10">
                                <a href="#" class="hover-link">
                                    ` + JSON.parse(window.localStorage.getItem("candy")).Phone + `
                                </a>
                            </h4>
                            <p><i class="fa fa-quote-left"></i> ` + this.data.split("&")[1].split("=")[1] + `</p>
                        </div>
                    </div>
                `;
        $('#biz-top-5-reviews').append(sTopReview);
      }
      loadTotalReviewsCount();
      debugger;
    }).fail(function () {
      debugger;
    });
  }

  $('#review_btn').click(AddReview);

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
    loop: true,
    centeredSlides: true,
    slidesPerView: 1,
    initialSlide: 1,
    keyboardControl: true,
    mousewheelControl: false,
    preventClicks: false,
    preventClicksPropagation: false,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slideToClickedSlide: true,
    breakpoints: {
      767: {
        slidesPerView: 1,
        initialSlide: 1,
        pagination: '.swiper-pagination'
      },
    }
  });

  var BIZ_ID = getParameterByName('id');

  if (!BIZ_ID) {
    swiper.appendSlide('<div class="swiper-slide" style="background-image:url(https://lorempixel.com/600/600/nature/1)"></div>');
  } else {
    var BIZ_HILI_IMG_ROOT_URL = TEST_DOMAIN_URL_PREFIX + "/api/biz/" + BIZ_ID + "/img";
    $.get(BIZ_HILI_IMG_ROOT_URL, function (data) {
      if (!data || !data.length) {
        swiper.appendSlide('<div class="swiper-slide" style="background-image:url(https://lorempixel.com/600/600/nature/1)"></div>');
        return;
      }

      var ls = [];

      for (var i = 0; i < data.length; i++) {
        ls.push('<div class="swiper-slide" style="background-image:url(' + BIZ_HILI_IMG_ROOT_URL + '/' + data[i].fileid + ')"></div>');
      }

      swiper.appendSlide(ls);
    }).fail(function () {
      swiper.appendSlide('<div class="swiper-slide" style="background-image:url(https://lorempixel.com/600/600/nature/1)"></div>');
    });
  }

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

    $.get(url, function (dataObj) {
      document.title = dataObj.name + " | GoWhere";
      $("#brand-title").html(dataObj.name);
      $("#address").append(dataObj.addr.formal.split(", USA")[0]);

      if (dataObj.web) {
        $("#biz-website").html(dataObj.web).attr("href", "http://" + dataObj.web);
      } else {
        $("#biz-website").html("N/A");
      }

      if (dataObj.phones.length > 0) {
        $("#biz-phone").html(dataObj.phones[0]).attr("href", "tel:" + dataObj.phones[0]);
      }

      var sImgLogoName = '<img src="img/sample/' + dataObj.imglogoname + '" class="img-fluid mx-auto" alt=""><a><div class="mask waves-effect waves-light"></div></a>';
      var sImgBannerName = '<img src="img/sample/' + dataObj.imgbannername + '" alt="" class="img-fluid d-block mx-auto"/>'
      $("#business-logo").append(sImgLogoName);
      $("#business-banner").append(sImgBannerName);
      initMap(dataObj.coor.lat, dataObj.coor.lon);

      //For Specialty
      // var arrCnt = dataObj.specialty.match(/[^\r\n]+/g);
      var arrCnt = dataObj.specialty.split(",");
      var cnt = "";
      if (arrCnt[0] === "" || arrCnt === null) {
        cnt += "<div style='padding-left: 4%; padding-top:6%;'>Nothing to show here for Specialties Card</div>";
      } else {
        cnt = '<ul class="list-circle pl20">'
        for (var i = 0; i < arrCnt.length; i++) {
          if (i === 3) {
            break;
          }
          var li = "<li>" + arrCnt[i] + "</li>";
          cnt += li;
        }

        cnt += '</ul>';

        if (arrCnt.length > 3) {
          cnt += '<div class="collapse">';
          cnt += '<ul class="list-circle pl20">';

          for (var i = 3; i < arrCnt.length; i++) {
            var li = "<li>" + arrCnt[i] + "</li>";
            cnt += li;
          }
          cnt += '</ul>';
          cnt += '</div>';

          cnt += '<a href="javascript:void(0)" onclick="ReadMoreClick(this)" class="r-more-btn hover-link">';
          cnt += 'Read <span class="more">more</span> <span class="less">less</span>';
          cnt += '</a>';
        }
      }
      $("#specialty-card-container").append(cnt);

      //For Amenity
      arrCnt = dataObj.amenity === "" ? null : dataObj.amenity.split(",");
      cnt = "";
      if (arrCnt[0] === "" || arrCnt === null) {
        cnt += "<div style='padding-left: 4%; padding-top:6%;'>Nothing to show here for Amenity Card</div>";
      } else {
        cnt = '<ul>'
        for (var i = 0; i < arrCnt.length; i++) {
          if (i === 3) {
            break;
          }
          var li = "<li><i class='fa fa-credit-card' aria-hidden='true'></i> " + arrCnt[i] + "</li>";
          cnt += li;
        }

        cnt += '</ul>';

        if (arrCnt.length > 3) {
          cnt += '<div class="collapse">';
          cnt += '<ul>';

          for (var i = 3; i < arrCnt.length; i++) {
            var li = "<li><i class='fa fa-credit-card' aria-hidden='true'></i> " + arrCnt[i] + "</li>";
            cnt += li;
          }
          cnt += '</ul>';
          cnt += '</div>';

          cnt += '<a href="javascript:void(0)" onclick="ReadMoreClick(this)" class="r-more-btn hover-link">';
          cnt += 'Read <span class="more">more</span> <span class="less">less</span>';
          cnt += '</a>';
        }
      }
      $("#amenity-card-container").append(cnt);

      //For Promotion
      arrCnt = dataObj.promo === "" ? null : dataObj.promo.split(",");
      cnt = "";
      if (arrCnt[0] === "" || arrCnt === null) {
        cnt += "<div style='padding-left: 4%; padding-top:6%;'>Nothing to show here for Promotion Card</div>";
      } else {
        cnt = '<ul class="list-circle pl20">'
        for (var i = 0; i < arrCnt.length; i++) {
          if (i === 3) {
            break;
          }
          var li = "<li>" + arrCnt[i] + "</li>";
          cnt += li;
        }

        cnt += '</ul>';

        if (arrCnt.length > 3) {
          cnt += '<div class="collapse">';
          cnt += '<ul class="list-circle pl20">';

          for (var i = 3; i < arrCnt.length; i++) {
            var li = "<li>" + arrCnt[i] + "</li>";
            cnt += li;
          }
          cnt += '</ul>';
          cnt += '</div>';

          cnt += '<a href="javascript:void(0)" onclick="ReadMoreClick(this)" class="r-more-btn hover-link">';
          cnt += 'Read <span class="more">more</span> <span class="less">less</span>';
          cnt += '</a>';
        }
      }
      $("#promotion-card-container").append(cnt);

      //For loading dress code data
      var drsCodeStr = "",
        drsCode;
      if (dataObj.dresscode !== "") {
        drsCode = dataObj.dresscode.split("\n");
        for (var i = 0; i < drsCode.length; i++) {
          if (drsCode[i] === "") {
            continue;
          }
          drsCodeStr += "<p>" + drsCode[i] + "</p>"
        }
      } else {
        drsCodeStr = "Feed me your dress code";
      }
      $("#dress-code-card-container").append(drsCodeStr);

      var bizEcho = dataObj.echo;
      if (bizEcho === "") {
        bizEcho = "Feed me your biz echo";
      }
      //For loading biz echo data
      $("#biz-echo-card-container").append("<p class='card-text fs16'>" + bizEcho + "</p>");

      //For loading price range data
      $("#price-range-container").append("<i class='fa fa-money' aria-hidden='true'></i> From $" + dataObj.pricemin + " - $" + dataObj.pricemax);

      //For loading profile introduction data
      var introStr = "",
        aIntro;
      if (dataObj.intro !== "") {
        aIntro = dataObj.intro.split("\n");
        for (var j = 0; j < aIntro.length; j++) {
          if (aIntro[j] === "") {
            continue;
          }
          introStr += "<p>" + aIntro[j] + "</p>"
        }
      } else {
        introStr = "Feed me your business introduction";
      }
      $("#profile-card-container").append(introStr);

    }).fail(function () {
      alert("business not found");
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
    var myLatLng = {
      lat: lat,
      lng: lon
    };

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

  $("#biz-review-navigation-popular>a").click(loadPopularReviews);

  function loadPopularReviews() {
    var url = "";
    var that = this;

    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_list?biz_id=" + window.location.href.split("?id=")[1] + "&mostthumbup_sort";

    $.get(url, function (dataObj) {

      var sReviewItm, starCount;
      for (var i = 0; i < dataObj.length; i++) {
        starCount = dataObj[i].star !== null ? dataObj[i].star : "0"
        var stars = parseStars(starCount);

        var crntUsr = JSON.parse(window.localStorage.getItem("candy"));
        var crntUsrID;
        if (crntUsr !== null) {
          crntUsrID = ", " + crntUsr.Id;
        } else {
          crntUsrID = "";
        }

        var thDownCnt = dataObj[i].thumbdw;
        if (thDownCnt === 1) {
          thDownCnt = "-" + thDownCnt;
        }

        sReviewItm = `
                    <div class="news" id="review-user-container">
                        <div class="label">
                            <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1-mini.jpg" class="rounded-circle z-depth-1-half">
                        </div>
                        <div class="excerpt">
                            <div class="brief">
                                <a class="name" id="review-user-name">` + dataObj[i].firstname + `</a> wrote a review<div class="date" id="review-user-time">1 hour ago ` + dataObj[i].lastupd + `</div> <div id="review-user-star">` + stars.outerHTML + `</div>
                            </div>
                            <div class="added-text" id="review-content-list">` + dataObj[i].content + `</div>
                            <div class="feed-footer">
                                <a class="comment" data-toggle="collapse" href="#reply-1" aria-expanded="false" aria-controls="reply-1">Comment</a> &middot;
                                <span><a>0</a></span>
                                <a id="review-user-thumb-up" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-up neural-up"></i><span id="` + dataObj[i].rid + `" class="total-up-count">` + dataObj[i].thumbup + `</span></a>
                                <a id="review-user-thumb-down" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I don't like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-down neural-down"></i><span id="` + dataObj[i].rid + `" class="total-down-count">` + thDownCnt + `</span></a>
                                <a class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="Report bad review"><i class="fa fa-flag"></i></a>
                            </div>
                        </div>
                    </div>
                `;
        $('#review-container-popular').append(sReviewItm);
        GetThumbById();
      }
    }).fail(function () {
      debugger;
    });
  }

  $("#biz-review-navigation-critical>a").click(loadCriticalReviews);

  function loadCriticalReviews() {
    var url = "";
    var that = this;

    url += TEST_DOMAIN_URL_PREFIX;
    url += "/review_list?biz_id=" + window.location.href.split("?id=")[1] + "&star_sort=a&star_lim=2";

    $.get(url, function (dataObj) {

      var sReviewItm, starCount;
      for (var i = 0; i < dataObj.length; i++) {
        if (dataObj[i].star === 0) {
          continue;
        }
        starCount = dataObj[i].star !== null ? dataObj[i].star : "0"
        var stars = parseStars(starCount);

        var crntUsr = JSON.parse(window.localStorage.getItem("candy"));
        var crntUsrID;
        if (crntUsr !== null) {
          crntUsrID = ", " + crntUsr.Id;
        } else {
          crntUsrID = "";
        }

        var thDownCnt = dataObj[i].thumbdw;
        if (thDownCnt === 1) {
          thDownCnt = "-" + thDownCnt;
        }

        sReviewItm = `
                    <div class="news" id="review-user-container">
                        <div class="label">
                            <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1-mini.jpg" class="rounded-circle z-depth-1-half">
                        </div>
                        <div class="excerpt">
                            <div class="brief">
                                <a class="name" id="review-user-name">` + dataObj[i].firstname + `</a> wrote a review<div class="date" id="review-user-time">1 hour ago ` + dataObj[i].lastupd + `</div> <div id="review-user-star">` + stars.outerHTML + `</div>
                            </div>
                            <div class="added-text" id="review-content-list">` + dataObj[i].content + `</div>
                            <div class="feed-footer">
                                <a class="comment" data-toggle="collapse" href="#reply-1" aria-expanded="false" aria-controls="reply-1">Comment</a> &middot;
                                <span><a>0</a></span>
                                <a id="review-user-thumb-up" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-up neural-up"></i><span id="` + dataObj[i].rid + `" class="total-up-count">` + dataObj[i].thumbup + `</span></a>
                                <a id="review-user-thumb-down" class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="I don't like it"><i id="` + dataObj[i].rid + `" onclick="reviewSetThumb(` + dataObj[i].rid + crntUsrID + ", " + "event" + ` )" class="fa fa-thumbs-down neural-down"></i><span id="` + dataObj[i].rid + `" class="total-down-count">` + thDownCnt + `</span></a>
                                <a class="thumbs mr10" data-toggle="tooltip" data-placement="top" title="Report bad review"><i class="fa fa-flag"></i></a>
                            </div>
                        </div>
                    </div>
                `;
        $('#review-container-critical').prepend(sReviewItm);
      }
      GetThumbById();
    }).fail(function () {
      debugger;
    });
  }


});

function reviewSetThumb(rid, uid, event) {

  var up;
  var url = "";
  // url += TEST_DOMAIN_URL_PREFIX;
  url += "/review_thumb_add";

  var sParam = "";
  if (rid !== "") {
    sParam += "review_id=" + rid;
  }
  if (uid !== "") {
    sParam += "&user_id=" + uid;
  }
  if (typeof uid !== "number" || uid === "") {
    alert("You cannot like or dislike this review. You need to log in.");
    return;
  }

  if (event.currentTarget.classList[2] === "neural-up") {

    $("i[id='" + rid + "'][class='fa fa-thumbs-down neural-down-pressed']").removeClass("neural-down-pressed");
    $("i[id='" + rid + "'][class='fa fa-thumbs-down']").addClass("neural-down")
    $("span[id='" + rid + "'][class='total-down-count']").text("0");

    $("i[id='" + rid + "'][class='fa fa-thumbs-up neural-up']").removeClass("neural-up");
    $("i[id='" + rid + "'][class='fa fa-thumbs-up']").addClass("neural-up-pressed");
    $("span[id='" + rid + "'][class='total-up-count']").text("1");
    up = true;
    sParam += "&up=" + up;
  } else if (event.currentTarget.classList[2] === "neural-up-pressed") {
    $("i[id='" + rid + "'][class='fa fa-thumbs-up neural-up-pressed']").removeClass("neural-up-pressed");
    $("i[id='" + rid + "'][class='fa fa-thumbs-up']").addClass("neural-up");
    $("span[id='" + rid + "'][class='total-up-count']").text("0");
  }

  if (event.currentTarget.classList[2] === "neural-down") {

    $("i[id='" + rid + "'][class='fa fa-thumbs-up neural-up-pressed']").removeClass("neural-up-pressed");
    $("i[id='" + rid + "'][class='fa fa-thumbs-up']").addClass("neural-up");
    $("span[id='" + rid + "'][class='total-up-count']").text("0");

    $("i[id='" + rid + "'][class='fa fa-thumbs-down neural-down']").removeClass("neural-down");
    $("i[id='" + rid + "'][class='fa fa-thumbs-down']").addClass("neural-down-pressed");
    $("span[id='" + rid + "'][class='total-down-count']").text("-1");
    up = false;
    sParam += "&up=" + up;
  } else if (event.currentTarget.classList[2] === "neural-down-pressed") {
    $("i[id='" + rid + "'][class='fa fa-thumbs-down neural-down-pressed']").removeClass("neural-down-pressed");
    $("i[id='" + rid + "'][class='fa fa-thumbs-down']").addClass("neural-down")
    $("span[id='" + rid + "'][class='total-down-count']").text("0");
  }

  if (rid !== "" && uid !== "") {
    $.post(url, sParam, function (dataObj) {
      debugger;
    }).fail(function () {
      debugger;
    });
  }
}

function parseStars(starCount) {
  var stars = document.createElement("span");
  stars.className = "star-yellow";

  for (var j = 0; j < Math.floor(starCount); j++) {
    var star = document.createElement("i")
    star.className = "fa fa-star";
    star.setAttribute("aria-hidden", "hidden");
    stars.appendChild(star);
  }

  if (starCount % 1 > 0) {
    var star = document.createElement("i")
    star.className = "fa fa-star-half-o";
    star.setAttribute("aria-hidden", "hidden");
    stars.appendChild(star);
  }

  var remainingStars = 5 - Math.ceil(starCount);
  for (var z = 0; z < remainingStars; z++) {
    var star = document.createElement("i")
    star.className = "fa fa-star-o";
    star.setAttribute("aria-hidden", "hidden");
    stars.appendChild(star);
  }
  return stars;
}

function ReadMoreClick(ev) {
  var btn = $(ev);
  var container = btn.closest('.b-info-overview-item');
  if (container.hasClass('col-lg-4')) {
    var sibl = container.removeClass('col-lg-4').addClass('col-lg-10').siblings().removeClass('col-lg-4').addClass('col-lg-1');
    sibl.find('.card-body').addClass('d-none');
    sibl.find('.card-header').addClass('card-header-stretch-height');
    container.find('.collapse').addClass('show');
  } else {
    var sibl = container.removeClass('col-lg-10 col-lg-1').addClass('col-lg-4').siblings().removeClass('col-lg-10 col-lg-1').addClass('col-lg-4');
    $(".b-info-overview-item").find('.card-body.d-none').removeClass('d-none');
    $(".b-info-overview-item").find('.card-header.card-header-stretch-height').removeClass('card-header-stretch-height');
    $(".b-info-overview-item").find('.collapse.show').removeClass('show');
  }
}