/**
 * latte for cafe24
 * @version 0.1.1.151104
 * @author styliss.net
 */

function $byId(id) {
	return document.getElementById(id);
}

function $byTag(tag, node) {
	return (tag || document).getElementsByTagName(name || '*');
}

function $byClass(name, node) {
	if(document.getElementsByClass) {
		$byClass = function(name, node) {
			return (node || document).getElementsByClassName(name);
		}
	} else {
		$byClass = function(name, node) {
			var all = $byTag();
			var i = all.length;
			var target;
			var result = [];
			while(i-- > 0) {
				target = all[i];
				if((' ' + target.className + ' ').indexOf(' ' + name) > -1) {
					result.push(target);
				}
			}
			return result;
		}
	}
	return $byClass(name, node);
}

var latte = {};

latte.query = function(name) {
	var match = location.search.match(new RegExp(name + '=([^&#]+)'));
	return match && match[1] ? match[1] : null;
}

latte.category = latte.query('cate_no');

latte.display = function() {
	var $category = latte.category + ',';

	return (latte.display = function() {
		$display('isHide', 'hide', 'none');
		$display('isShow', 'show', 'block');
	}).apply(this, arguments);

	function $display(targets, prefix, display) {
		targets = $byClass(targets);
		var i = targets.length;
		var target;
		var attr;

		while(i-- > 0) {
			target = targets[i];
			attr = target.getAttribute(prefix + '-category');
			if(!attr)
				return;
			if((attr + ',').indexOf($category) > -1) {
				target.style.display = display;
			}
		}
	}
};

(function() {
	if(latte.category) {
		latte.display();
	}
});
