$(function() {
	var TP_OPTS = {
		timeFormat: 'h:mm p',
		interval: 60,
		minTime: '0',
		maxTime: '11:59pm',
		defaultTime: '0',
		startTime: '0:00',
		dynamic: true,
		dropdown: false,
		scrollbar: false
	};

	initDatepicker($(".datepicker"));
	initTimepicker($('.timepicker'));
	prepareForthcomingSchedule();

	//Requirements: 0 <= hour <= 23 && 0 <= min <= 59
	function ToD(hour, min) {
		return hour * 60 + min;
	}

	//Requirements: 0 <= tod <= 1439
	function ToDtoDate(tod) {
		return new Date(0, 0, 0, Math.floor(tod / 60), tod % 60)
	}

	//Requirements: dt exists and is instance of Date
	function DateToToD(dt) {
		return ToD(dt.getHours(), dt.getMinutes());
	}

	function initDatepicker(jqLs) {
		return jqLs.datepicker({
			minDate: 0
		});
	}

	function initTimepicker(jqLs) {
		return jqLs.on('change', function(ev) {
			console.log($(this).timepicker().getTime());
		}).blur(function(ev) {
			var me = $(this),
				tp = me.timepicker();
			if (!tp.getTime()) {

				if (!me.val()) { //empty -> put default value there
					tp.setTime(new Date(0, 0, 0, 0, 0, 0, 0));
					return;
				}
				//TODO: show error tooltip here instead of console.log
				console.log('"' + me.val() + '" is NOT time, please fix it or leave blank for default!');
				me.focus();
			}
		}).timepicker(TP_OPTS);
	}

	function prepareForthcomingSchedule() {
		$('.ftcom-period').on('cloner:cloned', function(ev, stem) { //stem <-> source <-> original
			// console.log(ev.target);
			// console.log(stem);
			stem = $(stem);

			var me /*cloned*/ = $(this), //<-> $(ev.currentTarget) but NOT equivalent to $(ev.target), see: https://stackoverflow.com/questions/12077859/difference-between-this-and-event-target
				prv = me.prev(),
				nxt = me.next();

			// var loHr = 0,
			// 	loMin = 0,
			// 	hiHr = 23,
			// 	hiMin = 59,
			// 	since, until;

			var loToD = 0,
				hiToD = 1439,
				prvUntil, nxtSince,
				since, until;

			if (prv.length) {
				prvUntil = prv.find('.ftcom-until');

				if (prvUntil.length) {
					since = prvUntil.timepicker().getTime();
					if (since) {
						// loHr = since.getHours();
						// loMin = since.getMinutes();
						loToD = DateToToD(since);
					}
				}

			}

			hiToD = loToD

			if (nxt.length) {
				nxtSince = nxt.find('.ftcom-since');

				if (nxtSince.length) {
					var until = nxtSince.timepicker().getTime();
					if (until) {
						// hiHr = until.getHours();
						// hiMin = until.getMinutes();
						hiToD = DateToToD(until);
					}
				}
			}

			// var min, hr;
			// if (loMin > 44) {
			// 	min = (loMin + 15) % 60;
			// 	hr = (loHr + 1) % 24;
			// } else {
			// 	min = loMin + 15;
			// 	hr = loHr;
			// }

			if (hiToD - loToD <= 1) {
				since = ToDtoDate(loToD);
				if (loToD + 15 < 1440) {
					until = ToDtoDate(loToD + 15);
				} else {
					until = ToDtoDate(loToD);
				}
			} else {
				since = ToDtoDate(loToD + 1);
				until = ToDtoDate(hiToD - 1);
			}

			// since = new Date(0, 0, 0, hr, min, 0, 0);
			// until = new Date(0, 0, 0, hr, min, 0, 0);

			var meSince = me.find('.ftcom-since'),
				meUntil = me.find('.ftcom-until');

			var tpSince = initTimepicker(meSince).timepicker(),
				tpUntil = initTimepicker(meUntil).timepicker();

			tpSince.setTime(since);
			tpUntil.setTime(until);
		});
	}
});