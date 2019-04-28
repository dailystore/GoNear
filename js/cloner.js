//.cloner-button
//.cloner-anchor
//.cloner-choose-sibling-above-anchor
//.cloner-choose-sibling-below-anchor
//.cloner-place-before-chosen
//.cloner-place-after-chosen
//.cloner-cloned

//.cloner-button-remove

$(function() {
	$('.cloner-button').click(function ClonerButtonClicked() {
		var btn = $(this);
		var anchor = btn.closest('.cloner-anchor');
		var chosen;

		if (!anchor.length) {
			anchor = btn;
		}

		switch (true) {
			case anchor.hasClass('cloner-choose-sibling-above-anchor'):
				chosen = anchor.prev();
				break;
			case anchor.hasClass('cloner-choose-sibling-below-anchor'):
				chosen = anchor.next();
				break;
			default:
				chosen = anchor;
				break;
		}

		//Options attached to the button element as HTML custom-attribute under the form <data-*='123abc' />:
		var maxCloned = btn.attr("data-cloner-max-cloned"),
			topDeep = btn.attr("data-cloner-top-deep") === 'true',
			nestedDeep = btn.attr("data-cloner-nested-deep") !== undefined ? btn.attr("data-cloner-nested-deep") === 'true' : topDeep;

		if (maxCloned <= chosen.siblings(".cloner-cloned").length + 1) {
			return;
		}

		if (!topDeep) {
			chosen.find('.cloner-button').click(ClonerButtonClicked);
		}

		var cloned = chosen.clone(topDeep, nestedDeep).addClass('cloner-cloned');

		//JQuery custom event triggered for the original:
		chosen.trigger('cloner:chosen');

		switch (true) {
			case chosen.hasClass('cloner-place-before-chosen'):
				chosen.before(cloned);
				break;
			case chosen.hasClass('cloner-place-after-chosen'):
			default:
				chosen.after(cloned);
				break;
		}

		//JQuery custom event triggered for the cloned:
		cloned.trigger("cloner:cloned", chosen);
	});

	$('.cloner-button-remove').click(function ClonerRemoveButtonClicked() {
		var btn = $(this);
		var anchor = btn.closest('.cloner-anchor');
		var chosen;

		if (!anchor.length) {
			anchor = btn;
		}

		switch (true) {
			case anchor.hasClass('cloner-choose-sibling-above-anchor'):
				chosen = anchor.prev();
				break;
			case anchor.hasClass('cloner-choose-sibling-below-anchor'):
				chosen = anchor.next();
				break;
			default:
				chosen = anchor;
				break;
		}

		var minRemain = btn.attr("data-cloner-remove-min-remain");

		if (minRemain >= chosen.siblings(".cloner-cloned").length + 1) {
			return;
		}

		if (chosen.hasClass('cloner-cloned')) {
			chosen.trigger("cloner:removed").remove();
		}
	});
});