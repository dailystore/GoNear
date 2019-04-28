$(function() {

    window.localStorage.setItem("currentPage", window.location.href);

    var TEST_DOMAIN_URL_PREFIX = "";
	// TEST_DOMAIN_URL_PREFIX = "http://localhost:8000";
    getUserProfile();

    $("#address #resetFormBtn").click(function(evt) {
        evt.preventDefault();
        $("#error-setting-account").html();
        $("#error-display").html();
        getUserProfile();
    });

    $("#profile #resetFormBtn").click(function(evt) {
        evt.preventDefault();
        $("#error-setting-account").html();
        $("#error-display").html();
        getUserProfile();
    });

    $("#account #resetFormBtn").click(function(evt) {
        evt.preventDefault();
        $("#error-setting-account").html();
        $("#error-display").html();
        getUserProfile();
    });

    function getUserProfile() {
        var a = window.localStorage.getItem("candy");
        
        var url = TEST_DOMAIN_URL_PREFIX;
        url += TEST_DOMAIN_URL_PREFIX;
        url += "/get_user_profile";

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4 && this.status == 200) {
                debugger;
                var oData = JSON.parse(this.responseText);
                $("#welcome-name").html(oData.first_name);
                $("#first_name").val(oData.first_name);
                $("#last_name").val(oData.last_name);
                $("#add1").val(oData.address);
                $("#add2").val(oData.address2);

                var birthday = new Date(parseInt(oData.birthday));
                var month = birthday.getMonth()+1;
                $("#birthday-day option[value=" + birthday.getDate() + "]").attr('selected', 'selected')
                $("#birthday-month option[value=" + month + "]").attr('selected', 'selected')
                $("#birthday-year option[value=" + birthday.getFullYear() + "]").attr('selected', 'selected')

                $("#email").val(oData.email);
                $("#fb_acc").val(oData.facebook_nick);
                $("#gender option[value=" + oData.gender + "]").attr('selected', 'selected')

                if (oData.marriage_status !== "") {
                    $("#marriage_status option[value=" + oData.marriage_status + "]").attr('selected', 'selected')
                }
                
                $("#personal_note").val(oData.personal_information);

                // oData.phone = oData.phone.toString().match(/\d+/g).join("");
                $("#phone").val(oData.phone);

                $("#skype_acc").val(oData.skype_nick);
                $("#search-states").val(oData.state ? oData.state : "");
                $("#user-name").val(oData.username);
                $("#yahoo_acc").val(oData.yahoo_nick);
                $("#zip").val(oData.zip ? oData.zip : "");
                $("#search-city").val(oData.city_id ? oData.city_list[oData.city_id-1] : "");
                $("#search-states").val(oData.state_id ? oData.state_list[oData.state_id-1] : "");

                $('.mdb-select').material_select('destroy');
                $('.mdb-select').material_select();

                $('#search-city').mdb_autocomplete({
                    data: oData.city_list
                });
                $('#search-states').mdb_autocomplete({
                    data: oData.state_list
                });

            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
    }

    $("#user-name").focusout(function(e) {
        var err = false;
        var illegalChars = /\W/; // allow letters, numbers, and underscores
        var val = this.value;

        $("#" + this.id).removeClass("invalid");
        $("#" + this.id).removeClass("valid");
        if (val.length === 0) {
            return;
        }
        
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

    $("#profile > #explorer-profile-form").submit(function(e) {
        e.preventDefault();
        var firstname, lastname, gender, birthday, phone, marriage_status, fb_acc, skype_acc, yahoo_acc, personal_note;

        firstname = $('#explorer-profile-form #first_name').val();
        lastname = $('#explorer-profile-form #last_name').val();
        gender = $('#explorer-profile-form #gender').val();
        birthday = $('#explorer-profile-form #birthday').val();

        phone = $('#explorer-profile-form #phone').val();
        phone = phone.toString().match(/\d+/g).join("");

        marriage_status = $('#explorer-profile-form #marriage_status').val();
        fb_acc = $('#explorer-profile-form #fb_acc').val();
        skype_acc = $('#explorer-profile-form #skype_acc').val();
        yahoo_acc = $('#explorer-profile-form #yahoo_acc').val();
        personal_note = $('#explorer-profile-form #personal_note').val();

        var url = "", param;
        var that = this;
        url += TEST_DOMAIN_URL_PREFIX;
        url += "/update_user_profile";
        param = "first_name=" + firstname;
        param += "&last_name=" + lastname;
        param += "&gender=" + gender;

        var brthd_day, brthd_month, brthd_year;
        brthd_day = $("#birthday-day").val();
        brthd_month = $("#birthday-month").val();
        brthd_year = $("#birthday-year").val();
        birthday = new Date(brthd_year, brthd_month-1, brthd_day);
        birthday = birthday.getTime();
        param += "&birthday=" + birthday;

        param += "&phone=" + phone;
        param += "&marriage_status=" + marriage_status;
        param += "&facebook_nick=" + fb_acc;
        param += "&skype_nick=" + skype_acc;
        param += "&yahoo_nick=" + yahoo_acc;
        // param += "&personal_note=" + personal_note;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4 && this.status == 200) {
                // addSuccessTick(that);
                // debugger;
                $("#error-display").html("Change updated successfully !");
                $("html, body").animate({ scrollTop: 0 }, 400);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);

    });

    $("#account > #explorer-profile-form").submit(function(e) {
        e.preventDefault();
        var username, password, repeatPassword, email;

        username = $('#account > #explorer-profile-form #user-name').val();
        password = $('#account > #explorer-profile-form #password').val();
        repeatPassword = $('#account > #explorer-profile-form #repeatPassword').val();
        email = $('#account > #explorer-profile-form #email').val();

        if (password != "" && password !== repeatPassword) {
            $("#error-display").html("Password mismatched !");
            return;
        }

        var url = "", param = "";
        var that = this;
        url += TEST_DOMAIN_URL_PREFIX;
        url += "/update_user_profile";
        
        if (username !== "") {
            param = "username=" + username;
        }
        if (password != "") {
            param += "&password=" + password;
        }
        if (email !== "") {
            param += "&email=" + email;
        }
        if (param === "") {
            $("#error-display").html("There is nothing new to save !");
            return;
        }
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4 && this.status == 200) {
                // addSuccessTick(that);
                // debugger;
                $("#error-display").html("Change updated successfully !");
                $("html, body").animate({ scrollTop: 0 }, 400);
            } else if (this.status === 400) {
                $("#error-setting-account").html("Update Failed ! You can not use that email.");
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);

    });

    $("#address > #explorer-profile-form").submit(function(e) {
        e.preventDefault();

        var address, address2, cityID, states, zip;

        address = $('#address > #explorer-profile-form #add1').val();
        address2 = $('#address > #explorer-profile-form #add2').val();
        cityID = $('#address > #explorer-profile-form #search-city').val();
        states = $('#address > #explorer-profile-form #search-states').val();
        zip = $('#address > #explorer-profile-form #zip').val();

        var url = "", param;
        var that = this;

        url += TEST_DOMAIN_URL_PREFIX;
        url += "/update_user_profile";
        param = "address=" + address;

        if (address2 !== "") {
            param += "&address2=" + address2;
        }
        if (cityID !== "") {
            param += "&city_id=" + cityID;
        }
        if (states !== "") {
            param += "&state_id=" + states;
        }

        if (zip !== "") {
            param += "&zip=" + zip;
        }
        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
        if (isValidZip === false) {
            $("#error-display").html("Zip code is invalid!");
            $("html, body").animate({ scrollTop: 0 }, 400);
            return;
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4 && this.status == 200) {
                $("#error-display").html("Change updated successfully !");
                $("html, body").animate({ scrollTop: 0 }, 400);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(param);
    });

    //what this used for :-)
    $("#side-stick li").click(function(){
        $(".error-display").html("");
    });
});