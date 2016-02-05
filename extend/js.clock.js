/**
 * clock
 * @version 0.2.1.151101
 * @author styliss
 */

js.prefs.clock = {
	'target': 'span',
	'lang': 'en'
};

js.$.clock = (function() {
	js.ready($bridge, '[clock-target]');

	var $targets = [];

	return $bridge;

	function $bridge(prefs) {
		js.interval($updates);
		js.$.clock = $run;
		return $run.apply(this, arguments);
	};

	function $run(prefs) {
		prefs = Object.merge(prefs, js.prefs.clock);
		return this.set($set, [prefs]);
	}

	function $set(node, prefs) {
		prefs = js.merge('clock', node, prefs);

		if(prefs['weeks'])
			prefs['weeks'] = prefs['weeks'].split(',');

		var values = js.query(prefs['target'], node), value, i = values.length;

		if(!i)
			return;

		while(i-- > 0) {
			value = values[i];
			value._jsClock = value.innerHTML.trim();
		}
		node._jsClock = {
			prefs: prefs,
			values: values
		};
		$targets.push(node);
		$update(node);
	}

	function $updates(node) {
		var i = $targets.length;
		while(i-- > 0) {
			$update($targets[i]);
		}
	}
	
	function $update(node){
		var _ = node._jsClock;
		var i = _.values.length;
		var date = new Date;
		var value;
		date.language = _.prefs['lang'];
		while(i-- > 0){
			value = _.values[i];
			value.innerHTML = date.format(value._jsClock);
		}
	}

})(); 