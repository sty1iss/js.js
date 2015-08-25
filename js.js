/**
 * js.core.js
 * @version 0.6.2
 */
'use strict';
window.js = (function(origin, window, document, Array, Boolean, Date, Function, Number, Math, Object, RegExp, String, undefined) {
	origin = origin || {};
	
	var useNativeQuery = true;

	Array.test = Array.isArray;

	Array.add = Array.prototype;

	Array.add.run = function(method) {
		for(var i = 0, c = this.length; i < c; i++)
			method.call(this, this[i]);
	};

	Array.add.shifts = function(loop) {
		loop = loop || 2;
		var result = [];
		while(loop-- > 0)
		result.push(this.shift());
		return result;
	};

	Array.add.shifted = function() {
		this.shift();
		return this;
	};

	Array.add.unshifted = function() {
		Array.prototype.unshift.apply(this, arguments);
		return this;
	};

	Array.add.max = function(needIndex) {
		var i = this.length-1
		  , value
		  , result = this[i]
		  , index = i
			;
		while(i-->0){
			value = this[i];
			if(value > result){
				result = value;
				index = i;
			}
		}
		return needIndex ?
			index :
			result;
	};

	Array.add.min = function(needIndex) {
		var i = this.length-1
		  , value
		  , result = this[i]
		  , index = i
			;
		while(i-->0){
			value = this[i];
			if(value < result){
				result = value;
				index = i;
			}
		}
		return needIndex ?
			index :
			result;
	};

	Array.add.sum = function() {
		var i = this.length, result = 0;
		while(i-->0)
		result += this[i];
		return result;
	};

	Array.add.average = function() {
		return this.sum() / this.length;
	};

	Array.add.out = function(index) {
		return this.splice(index, 1)[0];
	};

	Array.add.has = function(needle) {
		return this.indexOf(needle) > -1;
	};

	Array.add.hasAll = function(needles) {
		var i = needles.length, needle;
		while(i--) {
			needle = needles[i];
			if(this.indexOf(needle) < 0)
				return false;
		}
		return true;
	};

	Array.add.unique = function() {
		return (Array.add.unique = (function() {
			return function() {
				return this.filter(unique);
			};

			function unique(value, key, all) {
				return key == all.indexOf(value);
			}

		})()).apply(this, arguments);
	};

	Array.add.tags = function() {
		return this.join('\n').tags();
	};

	Array.add.camel = function() {
		for(var word = this, i = word.length; --i; ) {
			word[i] = word[i].charAt(0).toUpperCase() + word[i].slice(1);
		}
		return word.join('');
	};

	Array.add.shuffle = function() {
		for(var result = this, i = result.length, c = i - 1, key, now; i--; ) {
			key = Math.rand(c);
			now = result[i];
			result[i] = result[key];
			result[key] = now;
		}
		return result;
	};
	
	Array.add.last = function(){
		return this[this.length-1];
	};

	Boolean.test = function(target) {
		return typeof target == 'boolean';
	};

	if(!Date.now) {
		Date.now = function() {
			return new Date().getTime();
		};
	}

	Date.format = function(format, time) {
		return (Date.format = (function() {
			return function(format, time) {
				if(!time) {
					time = new Date;
				} else if(Number.test(time)) {
					time = new Date(time);
				}
				for(var i = 0, c = format.length, char, choose, result = ''; i < c; i++) {
					char = format.charAt(i);
					choose = choice(char);
					result += choose ? choose(time) : char;
				}
				return result;
			};

			function choice(method) {
				switch(method) {
				case 'd':
					return d;
				case 'D':
					return D;
				case 'j':
					return j;
				case 'l':
					return l;
				case 'N':
					return N;
				case 'S':
					return S;
				case 'w':
					return w;
				case 'z':
					return z;
				case 'W':
					return W;
				case 'F':
					return F;
				case 'm':
					return m;
				case 'M':
					return M;
				case 'n':
					return n;
				case 't':
					return t;
				case 'L':
					return L;
				case 'Y':
					return Y;
				case 'y':
					return y;
				case 'a':
					return a;
				case 'A':
					return A;
				case 'g':
					return g;
				case 'G':
					return G;
				case 'h':
					return h;
				case 'H':
					return H;
				case 'i':
					return i;
				case 's':
					return s;
				//case ' r': return r;
				}
				return null;
			}

			function d(o) {
				return o.getDate().fill(2);
			}

			function D(o) {
				return l(o).substr(0, 3);
			}

			function j(o) {
				return o.getDate();
			}

			function l(o) {
				return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][o.getDay()];
			}

			function N(o) {
				return o.getDay() + 1;
			}

			function S(o) {
				var day = o.getDate() - 1;
				return day < 3 ? ['st', 'nd', 'rd'][day] : 'th';
			}

			function w(o) {
				return o.getDay();
			}

			function z(o) {
				return [31, L(o) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].splice(0, o.getMonth()).sum() + o.getDate() - 1;
			}

			function W(o) {
				return Math.ceil(z(o) / 7);
			}

			function F(o) {
				return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][o.getMonth()];
			}

			function m(o) {
				return (o.getMonth() + 1).fill(2);
			}

			function M(o) {
				return F(o).substr(0, 3);
			}

			function n(o) {
				return o.getMonth() + 1;
			}

			function t(o) {
				return [31, L(o) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][n(o) - 1];
			}

			function L(o) {
				var y = Y(o);
				return ((!y % 4 && y % 100) || y % 400) ? 1 : 0;
			}

			// o

			function Y(o) {
				return o.getFullYear();
			}

			function y(o) {
				return String(Y(o)).substr(2);
			}

			function a(o) {
				var h = o.getHours();
				return h == 1 || h < 12 ? 'am' : 'pm';
			}

			function A(o) {
				return a(o).toUpperCase();
			}

			// B

			function g(o) {
				var h = o.getHours();
				return h > 12 ? h - 12 : h;
			}

			function G(o) {
				return o.getHours();
			}

			function h(o) {
				return g(o).fill(2);
			}

			function H(o) {
				return o.getHours().fill(2);
			}

			function i(o) {
				return o.getMinutes().fill(2);
			}

			function s(o) {
				return o.getSeconds().fill(2);
			}

			// u
			// e
			// I
			// O
			// P
			// T
			// Z
			// c

			//function r(o){
			//	return php.date('D, d M Y H:i:s ', t);
			//}

			// u
		})()).apply(this, arguments);
	};

	Date.request = new Date;

	Date.y = Date.request.getFullYear();

	Date.m = Date.request.getMonth();

	Date.d = Date.request.getDate();

	Date.h = Date.request.getHours();

	Date.i = Date.request.getMinutes();

	Date.s = Date.request.getSeconds();

	Date.add = Date.prototype;

	Date.add.format = function(format) {
		return Date.format(format, this);
	};
	
	/*
	Date.add.isLeapYear = function(){
		return Date.format('L')==1;
	}
	*/
	Function.test = function(target) {
		return target instanceof Function;
	};

	Number.test = function(target) {
		return RegExp.number.test(target);
	};
	
	Number.unit = function(target){
		return /^-?\d+(\.\d+)?\s?(px|pt|em|rem|%)$/.test(target);
	}

	Number.add = Number.prototype;
	
	Number.add.trim = function(){
		return this;
	}

	Number.add.run = function(method) {
		for(var i = 1, c = this + 1; i < c; i++)
			method.call(this, i);
	};

	Number.add.substr = function(start, length) {
		return String.prototype.substr.apply(this, arguments);
	};
	
	Number.add.zerofill = function(){
		alert('Number.add.zerofill was renamed to fill.');
		return Number.add.fill.apply(this, arguments);		
	};

	Number.add.fill = function(length) {
		return (Number.add.fill = (function(undefined) {
			var $pad = [''];
			return function(length) {
				length = length || 2;
				var self = String(this), diff = length - self.length;
				return diff > 0 ? ($pad[diff] || ($pad[diff] = '0'.repeat(diff))
				) + self : self;
			};
		})()).apply(this, arguments);
	};
	
	Number.add.toClass = function(prefix, max){
		prefix = prefix || 'x';
		for(var i=2, c=max||10, className=[];i<=c;i++){
			if(this%i==0)
				className.push(prefix+i);
		}
		return className.join(' ');
	};	

	Number.add.min = function(min) {
		return this < min ? min : this;
	};

	Number.add.max = function(max) {
		return this > max ? max : this;
	};

	Number.add.range = function(min, max) {
		return this < min ? min : this > max ? max : this;
	};

	Math.rand = function(start, end) {
		if(end === undefined) {
			end = start;
			start = 0;
		}
		return Math.round(Math.random() * (end - start)) + start;
	};

	Object.test = function(target, havy) {
		return havy ? target.constructor == Object : typeof target == 'object';
	};

	if(!Object.is) {
		Object.is = function(a, b) {
			if(a === 0 && b === 0)
				return 1 / a === 1 / b;
			if(a !== a)
				return b !== b;
			return a === b;
		};
	}

	Object.toArray = function(target) {
		return (Object.toArray = (function(slice, ie, undefined) {
			return ie && ie < 9 ? function(target) {
				var i = 0, result = [];
				if(target.charAt) {
					for(var c = target.length; i < c; i++)
						result.push(target.charAt(i));
				} else {
					for(; i < target.length; i++)
						result.push(target[i]);
				}
				return result;
			} : function(target) {
				return slice.call(target, 0);
			};
		})(Array.prototype.slice, js.user.ie)).apply(this, arguments);
	};

	if(!Object.clone){
		Object.clone = function(target) {
			var copied = {};
			for(var keys = Object.keys(target), key, i = 0, c = keys.length; i < c; i++) {
				key = keys[i];
				copied[key] = target[key];
			}
			return copied;
		};
	}

	Object.merge = function(target, replace) {
		if(Object.test(target)) {
			for(var keys = Object.keys(replace), key, i = 0, c = keys.length; i < c; i++) {
				key = keys[i];
				target.hasOwnProperty(key) || (target[key] = replace[key]);
			}
			return target;
		} else {
			return replace;
		}
	};
	// Object.forEach
	RegExp.test = function(target) {
		return target instanceof RegExp;
	};

	RegExp.upper = /[A-Z]/;
	RegExp.spaces = /\s+/g;
	RegExp.number = /^\-?[1-9]\d*$/;
	RegExp.float = /^\-?\d+(\.\d+)?$/;
	RegExp.email = /^\w([-_.]?\w)*@\w([-_.]?\w)*\.[a-zA-Z]{2,3}$/;
	RegExp.url = /^(https?|ftp):\/\/([\w-]+\.)+[-\w]+(\/[-./?&%=\w]*)?$/;
	RegExp.date = /^(\d{1,4}[-\/\.])?(?:(?:(0[13578]|10|12|[13578])[-\/\.](0[1-9]|[12]\d|3[01]|[1-9]))|(?:(0[469]|11|[469])[-\/\.](0[1-9]|[12]\d|30|[1-9]))|(0?2)-(0[1-9]|[12][1-9]))$/;
	RegExp.year = /^\d{2,4}$/;
	RegExp.time = /^[0-2]\d(:[0-6]?\d){1,2}$/;
	RegExp.tel = /^(0\d{1,2}\-)?\d{3,4}\-\d{4}$/;

	//String.test = String.charAt

	String.add = String.prototype;

	String.add.camel = function() {
		return this.split('-').camel();
	};

	String.add.hyphen = function() {
		return this.replace(/([A-Z])/g, '-$1').toLowerCase();
	};

	String.add.repeat = function(multiplier) {
		var result = '';
		while(multiplier-- > 0)
		result += this;
		return result;
	};

	String.add.start = function(searchValue) {
		return this.indexOf(searchValue) === 0;
	};

	String.add.end = function(searchValue) {
		return this.substr(-searchValue.length) == searchValue;
	};

	String.add.pad = function(length, string, type) {
		var diff = length - this.length;
		if(diff > 0) {
			string = (string || ' ').repeat(Math.ceil(diff / string.length));
			string = string.substr(0, diff);
			switch(type) {
			case 'both':
				var half = diff / 2;
				return string.substr(0, Math.floor(half)) + this + string.substr(0, Math.ceil(half));
			case 'left':
				return string + this;
			default:
				return this + string;
			}
		}
		return this;
	};

	String.add.tags = function() {
		return (String.add.tags = (function() {
			var _hotword = /<([a-zA-Z]+)(?:#([^\.>\s\/]+))?(?:\.([^\s\/>\/]+))?([^<]*)>/g;

			return function() {
				
				var div = document.createElement('div')
				  , fragment = document.createDocumentFragment()
				  , nodes = []
				  , node
				  ;

				div.innerHTML = this.replace(_hotword, hotword);
				while( node = div.firstChild) {
					fragment.appendChild(node);
					nodes.push(node);
				}
				return nodes;
			};

			function hotword(full, tag, id, css, remain) {
				return '<' + tag + ( id ? ' id="' + id + '"' : '') + ( css ? ' class="' + css.split('.').join(' ') + '"' : '') + remain + '>';
			}

		})()).apply(this);
	};

	String.add.tag = function(child) {
		return (String.add.tag = (function() {
			var _hotword = /^([a-zA-Z]+)(?:#([^.>\s]+))?(?:\.([^\s]+))?$/;

			return function(child) {
				var match = this.match(_hotword), el = document.createElement(match[1]);

				match[2] && (el.id = match[2]);
				match[3] && (el.className = match[3].split('.').join(' '));

				if(child || child === 0) {
					if(child.charAt || Number.test(child)) {
						el.innerHTML = child;
					} else {
						el.appendChild(child);
					}
				}

				return el;
			};
		})()).apply(this, arguments);
	};

	String.add.br = function() {
		return this.replace(/\n/g, '<br>');
	};

	// updated 150519
	String.add.httpQuery = function() {
		for(var start = this.indexOf('?'), queries = queries = (start > -1 ? this.substr(start + 1) : this).split('&'), query, name, value, result = {}, i = 0, c = queries.length; i < c; i++) {
			query = queries[i].split('=');
			if( name = query.shift()) {
				value = query.join('=');
				result[name] = Number.test(value) ? Number(value) : value;
			}
		}
		return result;
	};

	String.add.parseUrl = function() {
		return (String.add.parseUrl = (function() {
			var _regex = /^(?:(?:([^\/]+)\/\/)?((?:[\w-]+\.)?\w+(?:\.\w+)+)|\.*)?([^\?#]+)?(\?[^#]*)?(\#.*)?$/;
			return function() {
				var matched = this.match(_regex);
				return {
					hash : matched[5] || '',
					host : matched[2] || '',
					hostname : matched[2] || '',
					href : this,
					pathname : matched[3] || '',
					protocol : matched[1] || '',
					query : matched[4] || ''
				};
			};
		})()).call(this);
	};

	String.add.toDate = function() {
		/*
		 * String object to Date object
		 */
		return (String.add.toDate = (function() {
			var _regex = /(?:(\d{2,4})[\/])?(\d{1,2})(?:[\/](\d{1,2}))(?:\s*(\d{1,2})(?:\:(\d{1,2}))(?:\:(\d{1,2}))?)?|(\d{1,2})(?:\:(\d{1,2}))(?:\:(\d{1,2}))?/;
			return function() {
				var matched = this.match(_regex);
				if(matched) {
					var y = matched[1] || Date.y, m = matched[2] || Date.m, d = matched[3] || Date.d, h = matched[4] || matched[7] || Date.h, i = matched[5] || matched[8] || Date.i, s = matched[6] || matched[9] || Date.s;
					return new Date(y, m - 1, d, h, i, s);
				}
			};
		})()).apply(this, arguments);
	};
	
	String.add.toInt = function(){
		return parseInt(this);
	};
	
	String.add.fill = function(length){
		return this.toInt().fill(length);
	};

	var none = function() {
		return false;
	};

	var js = (function(FunctionIs, ArrayIs, undefined) {
		var _html = /<\/?[a-zA-z]+[^>]*>/, $none;
		return function(selectors, parents) {
			return selectors ?
				selectors instanceof js.js ?
					selectors :
					FunctionIs(selectors) ?
						js.ready(selectors) :
						selectors._js_ ?
							selectors._js_ :
								js.js(selectors.charAt ?
									_html.test(selectors) ?
										selectors.tags() :
										js.query(
											selectors
										  , parents instanceof js.js ?
										  	parents.nodes :
										  	parents
									  	) :
								  	ArrayIs(selectors) ?
								  		selectors :
								  		[selectors]
						  		) :
				false;
		};
	})(Function.test, Array.test);

	for(var keys = Object.keys(origin), key, i = keys.length; i--; ) {
		key = keys[i];
		js[key] = origin[key];
	}

	js.include = js.require;
	
	js.use = function(name, callback, atReady){
		return js.require(js.dir+'js.'+name+'.js', atReady ?
			function(){
				js(callback);
			} :
			callback
		);
	};

	origin = null;

	js.merge = function(node, defaultObject) {
		/*
		 * object merge by compared to node attribute
		 */
		var object = {}, keys = Object.keys(defaultObject || {}), key, i = keys.length;
		while(i--) {
			key = keys[i];
			object[key] = node.getAttribute(key) || defaultObject[key];
		}
		return object;
	};

	js.user = (function(ua, undefined) {
		// multi checker
		var is = function(name) {
			for(var i = arguments.length; i--;)
				if(is[arguments[i]])
					return true;
			return false;
		};

		is.under = function(browser, version) {
			return is[browser] ? is[browser] < version : false;
		};

		is.over = function(browser, version) {
			return is[browser] ? is[browser] > version : false;
		};

		is.label = {};

		// set browser
		set('browser', [['safari', null, 'version/'], ['opera'], ['firefox'], ['trident', 'ie', 'rv:'], ['ie'], ['chrome'], ['opr', 'opera']]);

		set('engine', [['gecko'], ['webkit'], ['trident']]);

		// set platform
		ua = ua.split(')')[0];
		if(set('os', [['ipad', 'ios', 'cpu os'], ['iphone', 'ios', 'cpu os'], ['macintosh', null, /(?:x|rv:)/], ['linux'], ['tizen'], ['android'], ['windows', null, null]])) {
			is.mobile = is('android', 'ios', 'tizen');
		} else if(is.firefox) {
			is.mobile = ua.indexOf('mobile') > -1;
		}

		return is;

		function set(name, types) {
			for(var i = types.length, type, ver, key; i--; ) {
				type = types[i];
				if(ua.indexOf(type[0]) > -1) {
					is[name] = type[0];
					// changed .pop() to [1]
					if( ver = ua.split(type[2] || type[0])[1]) {
						ver = ver
							.replace(/^[^\w;]+/, '')
							.replace('_', '.')
							.split(/[\);]/)[0];
					}
					key = type[1] || type[0];
					is[key] = parseFloat(ver) || ver || true;
					is.label[name] = key;
					return true;
				}
			}
			is[name] = 'unknown';
			return false;
		}

	})(navigator.userAgent.toLowerCase());

	js.query = function() {
		return (js.query = useNativeQuery && document.querySelectorAll ? (function(document, toArray, push, undefined) {
			return function(selectors, parents) {
				if(Array.test(parents)) {
					for(var i = 0, c = parents.length, parent, result = []; i < c; i++) {
						push.apply(result, toArray(parents[i].querySelectorAll(selectors)));
					}
					return result;
				} else {
					return toArray((parents || document).querySelectorAll(selectors));
				}
			};
		})(document, Object.toArray, Array.prototype.push) : (function(Array, undefined) {
			var $document = [document], $body = [document.body], _selectors = /(?:\[[^\]]*\]|[^,])+/g, _selector = /(?:\[[^\]]*\]|[^\s])+/g, _spaces = /\s*([>|~\+])\s*([^\s]+)/g, _startUntagged = /^,?([\.\[])/, _untagged = /(?:(\s[>|~\+]?))\s*([\.\[])/g, _paths = /[>|~|\+]?(\w+|\*)|[>|~|\+]|#[^\.\:\[]+|\.[^#\:\[]+|\[(?:\[[^\]]*\]|[^\]])+|:+.+/g, _tag = /^\w+|\*$/, _attrs = /((?:"[^"]*"|'[^']*'|[^,])+)/g, _attr = /([\w_]+)(?:(.?=)(?:"((?:[^"]|\")+)"|'((?:[^']|\')+)'|([^\s,]+)))?/;

			return function(selectors, parents) {
				selectors = selectors.match(_selectors);

				parents = parents ? Array.test(parents) ? parents : [parents] : $document;
				selectorLoop:
				for(var selector, nodes, paths, path, result = [], i = 0, c = selectors.length, j, d, k, e; i < c; i++) {

					selector = selectors[i].trim().replace(_spaces, ' $1$2').replace(_startUntagged, '*$1').replace(_untagged, '$1*$2').match(_selector);

					nodes = false;

					for( j = 0, d = selector.length; j < d; j++) {
						paths = selector[j].match(_paths);
						k = 0;
						e = paths.length;
						do {
							path = paths[k];
							nodes = _tag.test(path) ?
								byTag(path, nodes || parents) :
								choice(path.substr(0, 1))(
									path.slice(1)
								  ,	nodes ||
										(parents == $document ?
											byTag('*', $document) :
											parents)
								);
							
							if(nodes === null)
								continue selectorLoop;
						} while(++k<e);

					}
					nodes && ( result = result.concat(nodes));
				}
				return result.unique();
			};

			function choice(method) {
				switch(method) {
				case '>':
					return byDirect;
				case '+':
					return bySibling;
				case '~':
					return bySiblings;
				case '#':
					return byId;
				case '.':
					return byClass;
				case '[':
					return byAttrs;
				case ':':
					return byPseudo;
				}
			}

			function byDirect(tag, parents) {
				tag = tag.toUpperCase();

				for(var i = 0, c = parents.length, j, d, childs, child, result = [], all = tag == '*'; i < c; i++) {
					childs = parents[i].childNodes;
					for( j = 0, d = childs.length; j < d; j++) {
						child = childs[j];
						(child.nodeType == 1 && (all || child.tagName == tag)) && result.push(child);
					}
				}
				return result.length ? result : null;
			};

			function bySibling(tag, parents) {
				tag = tag.toUpperCase();
				var result, element, i;
				for(i in parents) {
					( element = next(parents[i])) && (tag == '*' || element.tagName == tag) && (result || ( result = [])).push(element);
				}
				return result;
			}

			function bySiblings(tag, parents) {
				tag = tag.toUpperCase();
				for(var result, element, i = 0, c = parents.length; i < c; i++) {
					element = parents[i];
					do {
						( element = next(element)) && (tag == '*' || element.tagName == tag) && (result || ( result = [])).push(element);
					} while(element);
				}

				return result;
			}

			function byTag(tag, parents) {
				switch(tag) {
				case 'html':
					return $document;
				case 'head':
					return document.head
				case 'body':
					return $body;
				}				
				for(var i = 0, c = parents.length, j, d, nodes, node, result = []; i < c; i++) {
					if( nodes = parents[i].getElementsByTagName(tag)) {
						for( j = 0, d = nodes.length; j < d; j++){
							node = nodes[j];
							if(node.tagName=='!')
								continue;
							result.push(node);
						}
					}
				}
				return result;
			}

			function byId(id) {
				var node = document.getElementById(id);
				return node ? [node] : null;
			}

			function byClass(classes, parents) {
				classes = classes.split('.');
				for(var i = 0, c = parents.length, result = [], parent; i < c; i++) {
					parent = parents[i];
					parent.className && parent.className.split(' ').hasAll(classes) && result.push(parent);
				}
				return result;
			}

			function byAttrs(find, start, end) {
				return ( byAttrs = (function(undefined) {
					var _attrs = /((?:"[^"]*"|'[^']*'|[^,])+)/g, _attr = /([\w_]+)(?:(.?=)(?:"((?:[^"]|\")+)"|'((?:[^']|\')+)'|([^\s,]+)))?/;
					return function byAttrs(attrs, parents) {
						attrs = attrs.match(_attrs);
						var result = [], parent, attr, a, b, glue, i, c = parents.length, j, d = attrs.length;

						for( i = d; i--; ) {
							attr = attrs[i].match(_attr);
							attrs[i] = [attr[1], attr[2], attr[3] || attr[4] || attr[5]];
						} push:
						for( i = 0; i < c; i++) {
							parent = parents[i];
							for( j = d; j--; ) {
								attr = attrs[j];
								a = parent[attr[0]] || parent.getAttribute(attr[0]);
								b = attr[2];
								glue = attr[1];
								if(a === null || ((glue == '=' && a != b) || (glue == '~=' && a.split(' ').indexOf(b) < 0) || (glue == '|=' && a.split('-')[0] !== b) || (glue == '^=' && !a.start(b)) || (glue == '$=' && !a.end(b)) || (glue == '*=' && a.indexOf(b) < 0)
									))
									continue push;
							}
							result.push(parent);
						}

						return result;
					};
				})()).apply(this, arguments);
			}

			function byPseudo() {
				return ( byPseudo = (function(undefined) {
					var _pseudo = /([^(]+)(?:\(([^\)]+)\))?/;

					return function(pseudo, parents) {
						pseudo = pseudo.match(_pseudo);
						var result = [], nodes;
						for(var i = 0, c = parents.length; i < c; i++) {
							nodes = (choice(pseudo[1]))(parents[i], pseudo[2], pseudo[1], i + 1, c);
							if(nodes) {
								if(Array.test(nodes)) {
									result = result.concat(nodes);
								} else {
									result.push(nodes);
								}
							}
						}
						return result;
					};

					function choice(method) {
						switch(method) {
						case 'root':
							return root;
						case 'even':
							return nth;
						case 'odd':
							return nth;
						case 'nth-child':
							return nth;
						case 'nth-last-child':
							return nth;
						//case 'nth-of-type': return nthOfType;
						//case 'nth-last-of-type'' : return nthLastOfType;
						case 'first-child':
							return firstChild;
						case 'last-child':
							return lastChild;
						//case 'first-of-type' : return firstOfType;
						//case 'last-of-type' : return lastOfType;
						//case 'only-child' : return onlyChild;
						//case 'only-of-type'' : return onlyOfType;
						case 'empty' :
							return empty;
						//case 'link' : return link;
						//case 'visited' : return visited;
						//case 'active' : return active;
						//case 'hover' : return hover;
						//case 'focus' : return focus;
						//case 'target' : return target;
						case 'lang' :
							return lang;
						case 'enabled' :
							return enabled;
						case 'disabled' :
							return disabled;
						case 'checked' :
							return checked;
						//case ''first-line'' : return firstLine;
						//case ''first-letter'' : return firstLetter;
						//case 'before' : return before;
						//case 'after' : return after;
						}
					}

					function root() {
					}

					function nth(node, value, type, i, c) {
						switch(type) {
						case 'even':
						case 'odd':
							value = type;
							break;
						case 'nth-last-child':
							i = c - i;
						}

						switch(value) {
						case 'even':
							return i % 2 != 0 ? node : false;
						case 'odd':
							return i % 2 == 0 ? node : false;
						}
						return Number.test(value) && value == i ? node : null;
					}

					function firstChild(node) {
						return ( firstChild = document.firstElementChild ? function(node) {
							return node.firstElementChild;
						} : function(node) {
							var childs = node.childNodes;
							for(var i = 0, c = childs.length, child; i < c; i++) {
								child = childs[i];
								if(child.nodeType == 1)
									return child;
							}
							return null;
						}
						).apply(this, arguments);
					}

					function lastChild(node) {
						return ( firstChild = document.lastElementChild ? function(node) {
							return node.lastElementChild;
						} : function(node) {
							var childs = node.childNodes;
							for(var i = childs.length, child; i--; ) {
								child = childs[i];
								if(child.nodeType == 1)
									return child;
							}
							return null;
						}
						).apply(this, arguments);
					}

					function empty(node) {
						return node.childNodes.length ? false : node;
					}

					function lang(node, value) {
						return (node.lang || node.getAttribute('lang')) == value ? node : false;
					}

					function enabled(node) {
						return node.disable ? false : node;
					}

					function disabled(node) {
						return node.disable ? node : false;
					}

					function checked(node) {
						return node.checked ? node : flase;
					}

				})()).apply(this, arguments);
			}

		})(Array)).apply(this, arguments);
	};

	js.loaded = false;

	js.ready = function(method, that) {
		return (js.ready = (function() {
			var $methods = [];

			if(document.addEventListener && (!js.user.ie || js.user.ie>10)) {
				if(!/interative|complete/.test(document.readyState)){
					document.addEventListener('DOMContentLoaded', complete, false);
				}else{
					return complete();
				}
			} else {
				document.onreadystatechange = function() {
					document.readyState == 'complete' &&
						setTimeout(complete);
				};
				js(window).load(complete);
			}

			return function(method, that) {
				if(that && that.charAt) {
					$methods.push([
					function() {
						var nodes = js(that);
						nodes && method.call(nodes);
					}, this]);
				} else {
					$methods.push([method, that || this]);
				}
			};
			
			function complete(event) {
				if(js.loaded)
					return;
				js.loaded = true;
				for(var i = 0, c = $methods.length, method; i < c; i++) {
					method = $methods[i];
					method[0].call(method[1]);
				}
				$methods = [];
				return (js.ready = completed);
			}
			
			function completed(method, that) {
				if(that && that.charAt){
					var nodes = js(that);
					nodes && method.call(nodes);
				}else{
					method.call(that || this, method);
				}
			}
		})()).apply(this, arguments);
	};

	js.cookie = function(name, value, time, path) {
		name += '=';
		if(value !== undefined) {
			var cookie = name + encodeURI(value) + ';path=' + (path || '/') + ';';
			time && (cookie += ' expires=' + (new Date(time)).toUTCString() + ';');

			document.cookie = cookie;
		} else {
			return document.cookie.indexOf(name) > -1 ? decodeURI(document.cookie.split(name)[1].split(';')[0]) : null;
		}
	};

	js.event = function(event, node) {
		this.original = event;
		this.type = event.type;
		this.target = event.target || event.srcElement;
		this.node = node;
	};

	js.event.replace = function replace(type) {
		switch(type) {
		case 'down':
		case 'press':
		case 'up':
			return 'key' + type;

		case 'over':
		case 'out':
		case 'wheel':
			return 'mouse' + type;

		case 'double':
			return 'dblclick';
		}
		return type;
	};

	js.event.add = js.event.prototype;

	js.event.add.keys = function() {
		return (js.event.add.keys = (function(gecko) {
			return function() {
				var event = this.original;
				this.alt = event.altKey;
				this.ctrl = event.ctrlKey;
				this.shift = event.shiftKey;
				this.code = event.keyCode || event.which || event.charCode;

				this.key = this.shift ? upper(this.code) : lower(this.code);

				this[this.key] = true;
				this.arrow = this.up || this.down || this.left || this.right;

				if(this.ctrl) {
					this.copy = this.c;
					this.paste = this.v;
					this.cut = this.x;
					this.fn = true;
				} else {
					this.fn = !this.unknown && this.key.length > 1;
				}

				return this.key;
			};

			function upper(code) {// upper
				switch(code) {
				case 192:
				case 96 :
					return '~';

				case 49 :
					return '!';
				case 50 :
					return '@';
				case 51 :
					return '#';
				case 52 :
					return '$';
				case 53 :
					return '%';
				case 54 :
					return '^';
				case 55 :
					return '&';
				case 56 :
					return '*';
				case 57 :
					return '(';
				case 48 :
					return ')';
				case 109:
					return '_';
				case 187:
				case 61 :
					return '+';
				case 92 :
				case 220:
					return '|';
				case 189:
				case 173:
					return '_';

				case 219:
					return '{';
				case 91 :
					return gecko ? '{' : 'OS';
				case 93 :
				case 221:
					return '}';

				case 59 :
				case 186:
					return ':';
				case 39 :
				case 222:
					return '"';

				case 44 :
				case 188:
					return '<';
				case 190:
					return '>';
				case 47 :
				case 191:
					return '?';
				}
				return lower(code);
			}

			function lower(code) {
				switch(code) {
				case 27 :
					return 'esc';

				case 8  :
					return 'backspace';

				case 192:
					return '`';
				case 109:
				case 173:
				case 189:
					return '-';
				case 187:
					return '=';
				case 92 :
				case 220:
					return '\\';

				case 91 :
					return gecko ? '[' : 'OS';
				case 219:
					return gecko ? 'OS' : '[';
				case 93 :
				case 221:
					return ']';

				case 59 :
				case 186:
					return ';';
				case 222:
					return "'";

				case 44 :
				case 188:
					return ',';
				case 190:
					return '.';
				case 47 :
				case 191:
					return '/';

				case 9  :
					return 'tab';
				case 20 :
					return 'capsLock';
				case 13 :
					return 'enter';
				case 32 :
					return 'space';
				case 93 :
					return 'menu';
				case 92 :
					return 'rightOS';

				case 45 :
					return 'insert';
				case 36 :
					return 'home';
				case 33 :
					return 'pageUp';
				case 46 :
					return 'delete';
				case 35 :
					return 'end';
				case 34 :
					return 'pageDown';

				case 37 :
					return 'left';
				case 38 :
					return 'up';
				case 39 :
					return 'right';
				case 40 :
					return 'down';

				case 144:
					return 'numLock';
				case 111:
					return '/';
				case 110:
					return '.';
				case 107:
					return '+';
				case 106:
					return '*';
				case 105:
					return '9';
				case 104:
					return '8';
				case 103:
					return '7';
				case 102:
					return '6';
				case 101:
					return '5';
				case 100:
					return '4';
				case 99 :
					return '3';
				case 98 :
					return '2';
				case 97 :
					return '1';
				//case 96 : return '0'; same to '~'
				case 229:
					return 'unknown';
				}
				return String.fromCharCode(code).toLowerCase();
			}

		})(js.user.gecko)).call(this);
	};

	js.event.add.wheel = function() {
		return (js.event.add.wheel = this.original.detail ? function() {
			return Math.max(-1, Math.min(1, this.original.detail));
		} : function() {
			return Math.max(-1, Math.min(1, this.original.wheelDelta));
		}
		).call(this);
	};

	js.event.add.pointer = function(key) {
		return (js.event.add.pointer = event.x || event.y ? function(key) {
			var event = this.original, body = document.body, rect = this.target.getBoundingClientRect();
			this.x = event.clientX + body.scrollLeft - body.clientLeft;
			this.y = event.clientY + body.scrollTop - body.clientTop;

			this.position = Math.round(((this.x - rect.left) / Number(this.target.scrollWidth)) * 100, 1);

			if(key)
				return this[key];
		} : function(key) {
			var event = this.original;
			this.x = event.pageX;
			this.y = event.pageY;

			if(key)
				return this[key];
		}
		).apply(this, arguments);
	};

	js.event.add.stop = function() {
		return (js.event.add.stop = this.original.stopPropagation ? function() {
			this.original.stopPropagation();
			return false;
		} : function() {
			this.original.cancelBubble = true;
			return false;
		}
		).call(this);
	};

	js.ajax = (function(js, none) {
		return function(url, success, fail) {
			var request = create(success || none, fail || none), handle = request.handle;
			handle.open('GET', url);
			handle.send(null);
			return request;
		};

		function create(success, fail) {
			return ( create = window.ActiveXObject ? function(sucess, fail) {
				var handle = window.ActiveXObject('MSXML2.XMLHTTP'), extend = new js.ajax.js(handle);

				handle.onreadystatechange = function() {
					if(handle.readyState == 4) {
						success.call(extend.success());
					}
				};
				return extend;
			} : function(sucess, fail) {
				var handle = new XMLHttpRequest, extend = new js.ajax.js(handle);
				handle.onload = function() {
					success.call(extend.success());
				};

				return extend;
			}
			).apply(this, arguments);
		}

	})(js, none);

	js.ajax.js = function(handle) {
		this.handle = handle;
	};

	js.ajax.js.toString = function() {
		return this.text;
	};

	js.ajax.add = js.ajax.js.prototype;

	js.ajax.add.success = function() {
		this.text = this.handle.responseText;
		this.xml = this.handle.responseXML;
		return this;
	};

	js.ajax.add.json = function() {
		eval('val result = ' + this.text);
		return result;
	};

	js.ajax.add.stop = function() {
		this.handle.abort();
	};
	
	js.win = function(){
		return window._js_ || js(window);
	};
	
	js.root = function() {
		return (js.root = (function() {
			var _root = js(document.documentElement);
			return function() {
				return _root;
			};
		})()).call(this);
	};

	js.head = function() {
		return (js.head = (function() {
			var $head = js(document.head || document.getElementsByTagName('head')[0]);
			return function() {
				return $head;
			};
		})()).call(this);
	};

	js.body = function() {
		return (js.body = (function() {
			var $body = js(document.body || document.documentElement);
			return function() {
				return $body;
			};
		})()).call(this);
	};

	js.css = function(href, charset) {
		var node = 'link'.tag();
		node.rel = 'stylesheet';
		if(charset)
			node.charset = charset;
		node.href = href;
		var link = js.headNode.getElementsByTagName('link')[0];
		if(link){
			js.headNode.insertBefore(node, link);
		}else{
			js.headNode.appendChild(node);
		}
	};

	js.height = function() {
		return (js.height = (function(body, el) {
			return document.height ? function() {
				return document.height;
			} : function() {
				return Math.max(body.scrollHeight, body.offsetHeight, el.clientHeight, el.scrollHeight, el.offsetHeight);
			};
		})(document.body, document.documentElement)).call(this);
	};

	js.computed = function() {
		return (js.computed = (function(undefined) {
			var $node = js.body().add('<div>');
			return function(prop, value) {
				value !== undefined && $node.css(prop, value);
				var result = $node.css(prop, true);
				$node[0].style.display = 'none';
				return result;
			};
		})()).apply(this, arguments);
	};

	js.js = function(nodes) {
		var length = nodes.length;
		if(this instanceof js.js) {
			this.length = length;
			this.nodes = nodes;

			while(length--)
			this[length] = nodes[length];

			if(this.length == 1) {
				this.single = true;
				this.get = this.get1;
				this.set = this.set1;
				this[0]._js_ = this;
			}
		} else {
			return length ? new js.js(nodes) : false;
		}
	};

	js.add = js.js.prototype;

	js.adds = function(keys, each) {
		keys = keys.split('|');
		var i = keys.length, key;
		while(i--) {
			key = keys[i];
			each(key, key);
		}
	};

	js.add.js = function(selectors) {
		return js(selectors, Object.toArray(this));
	};

	js.add.filter = function(selectors) {
		for(var i = 0, c = this.length, result = [], parent, item, child; i < c; i++) {
			item = this[i];
			parent = js(item).parentJs();
			if(parent.js) {
				child = parent.js(selectors);
				child.js && child.nodes.indexOf(item) > -1 && result.push(item);
			}
		}
		return js.js(result);
	};

	js.add.child = function() {
		var result = [];
		for(var result = [], i = 0, c = this.length, j, d, childs, child; i < c; i++) {
			childs = this[i].childNodes;
			for( j = 0, d = childs.length; j < d; j++) {
				child = childs[j];
				if(child.nodeType == 1)
					result.push(child);
			}
		}
		return js(result);
	};

	js.add.get = function(method, args) {
		if(!args)
			args = [];
		var result = [], node, i = 0, c = this.length, m = method.length;
		if(args && args.length < m) {
			for(args.unshift(null); i < c; i++)
				result.push(method.apply(js(args[0] = this[i]), args));
		} else if(!args & m == 1) {
			for(; i < c; i++)
				result.push(method.call(js( node = this[i]), node));
		} else {
			for(; i < c; i++)
				result.push(method.apply(this[i], args));
		}
		return result;
	};

	js.add.get1 = function(method, args) {
		if(!args)
			args = [];

		var node = this[0], m = method.length;
		return args.length < m ? method.apply(js(node), args.unshifted(node)) : method.apply(node, args);
	};

	js.add.set = function(method, args) {
		this.get(method, args);
		return this;
	};

	js.add.set1 = function(method, args) {
		this.get1(method, args);
		return this;
	};
	
	js.add.getNodes = function(){
		return this.nodes.length ?
			this.nodes :
			(this.nodes = Object.toArray(this));
	};

	js.add.on = function(type, method) {
		return (js.add.on = (function(Function, undefined) {
			var $flag = !!document.addEventListener;
			
			window.onload = function(){};
			
			return function(type, method) {
				return this.set(set, [js.event.replace(type), method]);
			};

			function replace(type) {
				switch(type) {
				case 'down':
				case 'press':
				case 'up':
					return 'key' + type;

				case 'over':
				case 'out':
				case 'wheel':
					return 'mouse' + type;

				case 'double':
					return 'dblclick';

				case 'tap':
					return js.user.mobile ? 'click' : 'mouseover';
				}
				return type;
			}

			function set(type, method) {
				this._jsEvent_ || (this._jsEvent_ = {});

				if(!this._jsEvent_[type])
					this._jsEvent_[type] = bubble(this, type);

				this._jsEvent_[type].methods.push(method);
				this._jsEvent_[type].wrapped.push(execute(method));
			}

			function get(type) {
				if(Function.test(this[type])) {
					return this[type].call(this);
				}
			}

			function bubble(element, type) {
				var target = function(event) {
					event = event || window.event;
					for(var methods = target.wrapped, method, length, i = 0, c = methods.length; i < c; i++) {
						method = methods[i];
						if(method && method.call(element, event) === false)
							return false;
					}
				};

				target.methods = [];
				target.wrapped = [];
				
				// scroll does not work, if use attach
				//attach(element, type, target);
				//return target;
				return (element['on' + type] = target);	
				
			}

			function execute(method) {
				return function(event) {
					var length = method.length;
					return length ? length == 1 ? method.call(this, new js.event(event, this)) : method.call(js(this), new js.event(event, this), this) : method.call(this);
				};
			}
			/*
			function attach(){
				return (attach = document.addEventListener ?
					function(element, type, method){
						element.addEventListener(type, method, false);
					} :
					function(element, type, method){
						element.attachEvent('on'+type, method);
					}
				).apply(this, arguments);
			}//*/

		})(Function)).apply(this, arguments);
	};

	js.add.off = function(type, method) {
		return (js.add.off = (function(undefined) {
			return function(type, method) {
				return this.set(set, [js.event.replace(type), method]);
			};

			function set(type, method) {
				if(this._jsEvent_ && this._jsEvent_[type]) {
					var key = this._jsEvent_[type].methods.indexOf(method);
					if(key > -1) {
						this._jsEvent_[type].methods.out(key);
						this._jsEvent_[type].wrapped.out(key);
					}
				}
			}

		})()).apply(this, arguments);
	};

	js.adds('unload|click|double|change|up|down|press|over|out|wheel|submit|tap|resize', function(key, value) {
		js.add[key] = function(method) {
			return this.on(value, method);
		};

		js.add[key + 'x'] = function(method) {
			return this.off(value, method);
		};
	});
	
	js.adds('load|focus|blur|scroll', function(key, value) {
		js.add[key + 'x'] = function(method) {
			return this.off(value, method);
		};
	});	
	
	js.adds('resize', function(key){
		js[key] = function(method){
			return js(window).on(key, method);
		};
		
		js[key + 'x'] = function(method){
			return js(window).off(key, method);
		};
	});
	
	js.add.load = (function() {
		var _body = /<body[^>]*>/, _bodies = /<\/?body[^>]*>/;
		return function(url) {
			if(Function.test(url)) {
				return this.on('load', url);
			} else {
				var self = this;
				js.ajax(url, function() {
					self.set(set, [this.text]);
				});
			}
		};

		function set(text) {
			this.innerHTML = text;
		}

		function parse(text) {
			var body = _body.test(text) ? text.split(_bodies)[1] : text;
			return body;
		}
	})();
	
	js.add.focus = function(method) {
		return (js.add.focus = (function(undefined) {
			return function(method) {
				return method ? this.on('focus', method) : this.set(set);
			};

			function set() {
				var self = this;
				setTimeout(function() {
					self.focus();
				});
			}

		})()).apply(this, arguments);
	};

	js.add.blur = function(method) {
		return (js.add.blur = (function() {
			return function(method) {
				return method ? this.on('blur', method) : this.set(set);
			};

			function set() {
				this.blur();
			}

		})()).apply(this, arguments);
	};
	
	// document.body.scrolling
	js.add.scroll = function() {
		return (js.add.scroll = (function() {
			return function(method) {
				return this.set(set, [method]);
			};

			function set(node, method) {
				var user = js.user
				  , ie = user.ie
				 	;
				if(node==document.body){
					return js(
						ie ?
							ie == 8 ?
								window :
								document.documentElement :
						user.safari ?
							document :
							node
					).on('scroll', method);
				}else{
					this.on('scroll', method);
				}
			}
		})()).apply(this, arguments);
	};
	

	js.add.css = function(property, value) {
		return (js.add.css = (function(user, upper, undefined) {
			var $noTouch = function(a) {
				return a;}
			  , $compatible = {
					opacity : function() {
						return user.ie && user.ie < 9 ? user.ie == 8 ? {
							hyphen : '-ms-filter',
							set : function(value) {
								value = Math.round(value * 100);
								return 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')';
							},
							get : getIE
						} : {
							hyphen : 'filter',
							set : function(value) {
								value = Math.round(value * 100);
								return 'alpha(opacity=' + value + ')';
							},
							get : getIE
						} : null;
					
						function getIE(value) {
							value = value.replace(/.*opacity=(\d+).*/i, '$1');
							return value !== '' ? Number(value) / 100 : 1;
						}
					
					}
					// 익스플로러를 제외한 브라우저에서 색 값이 맨 앞에 나오는지 알 수 없다
					/*
					 , boxShadow: function(){
					 return !user.ie ? {
					 get: function(value){
					 value = value.match(/(\w+\([^\)]+\)|[^\s]+)/g);
					 value.splice(4, 0, value.shift());
					 value[5] &&
					 ((value[5].indexOf('set')<0 && value.splice(9, 0, value.splice(5, 1)[0])) ||
					 value.splice(10, 0, value.splice(6, 1)[0]));
					
					 return value.join(' ');
					 }
					 } :
					 null;
					
					 }
					 */
				}
		  	  , _isUseLength = /(.*(width|height|size|top|bottom|left|bottom)|position(-[xy])?)$/i
		  	  , _isEnterUnit = /(r?em|v[wh]|p[xt]|%)$/i;
		  	;

			return function(property, value) {
				var compatible, computed = value === true;
				if(computed || value === undefined) {
					property = dual(property);
					var get = computed ? getComputed : getDefault;

					compatible = isCompatible(property);

					return compatible ? this.get(getCompatible, [compatible.camel, compatible.hyphen, get, compatible.get]) : this.get(get, [property.camel, property.hyphen]);
				} else {
					for(var i = 0, c = arguments.length; i < c; i += 2) {
						property = dual(arguments[i]);
						value = arguments[i + 1];
						if(_isUseLength.test(property.hyphen) && !_isEnterUnit.test(value))
							value+= 'px';
						compatible = isCompatible(property);
						this.set(set, compatible ? [compatible.camel, compatible.set(value)] : [property.camel, value]);
					}
					return this;
				}
			};

			function dual(property) {
				return upper.test(property) ? {
					camel : property,
					hyphen : property.hyphen()
				} : {
					camel : property.camel(),
					hyphen : property
				};
			}

			function set(camel, value) {
				this.style[camel] = value;
			}

			function getDefault(camel, hyphen) {
				return this.style[camel] || getComputed.call(this, camel, hyphen);
			}

			function getComputed(camel, hyphen) {
				return (getComputed = window.getComputedStyle ?
					function(camel, hyphen) {
						// i can't remember why i use hyphen.camel() to arguments. so i remove.
						return window.getComputedStyle(this, null).getPropertyValue(hyphen) || null;
					} :
					function(camel) {
						//return this.currentStyle[camel == 'float' ? 'styleFloat' : camel] || null;
						return this.currentStyle ?
							this.currentStyle[camel] :
							null;
					}
				).apply(this, arguments);
			}

			function isCompatible(property) {
				var camel = property.camel, compatible = $compatible[camel];
				if(compatible && Function.test(compatible)) {
					compatible = compatible(user);
					var noTouch = $noTouch;

					if(compatible === null)
						compatible = {};
					if(!compatible.hyphen)
						compatible.hyphen = property.hyphen;
					if(!compatible.get)
						compatible.get = noTouch;
					if(!compatible.set)
						compatible.set = noTouch;

					compatible.camel = compatible.hyphen.camel();
					$compatible[camel] = compatible;
				}
				return compatible;
			}

			function getCompatible(camel, hyphen, get, method) {
				return method(get.call(this, camel, hyphen));
			}

		})(js.user, RegExp.upper)).apply(this, arguments);
	};

	js.adds('opacity', function(key) {
		js.add[key] = function(value) {
			return this.css(key, value);
		};
	});

	js.add.hide = function() {
		return (js.add.hide = (function(undefined) {
			return function() {
				return this.set(set);
			};
			function set(self) {
				var display = this.css('display');
				if(display == 'none') {
					display = js('<' + self.tagName + '>').css('display');
				}
				self._jsDisplay_ = display;
				self.style.display = 'none';
			}

		})()).apply(this, arguments);
	};

	js.add.show = function() {
		return (js.add.show = (function(undefined) {
			return function() {
				return this.set(set);
			};

			function set(node) {
				var display = node._jsDisplay_;
				if(!display) {
					var temp = js(node.parentNode).add('<' + node.tagName + '>');
					display = temp.css('display');
					if(display == 'none')
						display = 'block';
					temp.clear();
				}
				node.style.display = display;
			}

		})()).apply(this, arguments);
	};
	
	js.add.toggle = function(){
		return (js.add.toggle = (function(){
			return function(){
				return this.set(set);
			}
			
			function set(node){
				this[this.css('display')=='none' ? 'show' : 'hide']();
			}
		})()).apply(this, arguments);
	}

	js.add.attr = function(name, value) {
		return (js.add.attr = (function(undefined) {
			return function(name, value) {
				return value === undefined ? this.get(get, [name]) : this.set(set, [name, value]);
			};

			function set(name, value) {
				this.setAttribute(name, value);
			}

			function get(name) {
				return this.getAttribute(name);
			}

		})()).apply(this, arguments);
	};

	js.add.attrx = function(name) {
		return (js.add.attr = (function(undefined) {
			return function(name) {
				return this.set(set, [name]);
			};

			function set(name) {
				this.removeAttribute(name);
			}

		})()).apply(this, arguments);
	};

	js.add.size = function(target) {
		return (js.add.size = (function(undefined) {
			var $full = js.body()
				.add('<div>')
				.css(
					'position', 'absolute'
				  ,	'top', 0
				  , 'left', 0
				  , 'width', '100%'
				  , 'height', '100%'
				  , 'display', 'none'
				);
			return function(target) {
				return this.get(get, [target]);
			};

			function get(target) {
				var prop = ['scroll', target].camel();
				switch(this) {
				case window:
				case document:
				case document.body:
				case document.documentElement:
					return $full[0][prop];
				}
				return this[prop] || this.scrollWidth;
			}

		})()).apply(this, arguments);
	};

	js.add.selected = function(value) {
		return (js.add.selected = (function(undefined) {
			return function(value) {
				return value ? this.set(set, [value]) : this.get(get);
			};
			function set(value) {
				var i = this.options.length, option;
				while(i--) {
					option = this.options[i];
					if(options.value == value) {
						option.selected = true;
						break;
					}
				}
			}

			function get() {
				var selected = this.options[this.selectedIndex];
				return selected ? selected.value : null;
			}

		})()).apply(this, arguments);
	};

	js.add.html = function(source) {
		return (js.add.html = (function(Array, undefined) {
			return function(source) {
				return arguments.length ? this.set(set, [source]) : this.get(get);
			};

			function set(source) {
				Array.test(source) && ( source = source.join('\n\r'));
				this[this.nodeType == 1 ? 'innerHTML' : 'nodeValue'] = source;
			}

			function get() {
				return this.nodeType == 1 ? this.innerHTML : this.nodeValue;
			}

		})(Array)).apply(this, arguments);
	};

	js.add.value = function(value) {
		var _selectable = /input|select/;
		
		return (js.add.value = (function(undefined) {
			return function(value) {
				return value === undefined ?
					this.get(get) :
					this.set(set, [value])
					;
			};

			function set(value) {
				switch(this.tagName){
					default:
					this.value = value;
				}
			}

			function get(){
				if(this.tagName=='SELECT'){
					return this.selectedIndex ?
						this.options[this.selectedIndex].value :
						null;
				}else if(this.length && 'value' in this[0]){
					for(var i=this.length; i--;){
						if(this[i].checked)
							return this[i].value;
					}
					return null;
				}
				
				return this.value;
			}

		})()).apply(this, arguments);
	};

	js.add.tag = function(match) {
		return (js.add.tag = (function(undefined) {
			return function(match) {

				return match ? this.get(test, [tag.toUpperCase()]) : this.set(get);
			};

			function test() {
				return this.tagName == tag;
			}

			function set() {
				return this.tagName.toLowerCase();
			}

		})()).apply(this, arguments);
	};

	js.add.style = function(className) {
		/*
		 * @version 1.5
		 */
		return (js.add.style = (function(toArray, undefined) {
			return function(className) {
				return className ? this.set(set, [' ' + (arguments[1] ? (toArray(arguments)).join(' ') : className
				)]) : this.get(get);
			};

			function set(value) {
				if((' '+this.className+' ').indexOf(value+' ')<0)
					this.className += value;
			}

			function get() {
				return this.className.trim();
			}

		})(Object.toArray)).apply(this, arguments);
	};

	js.add.stylex = function(className) {
		return (js.add.stylex = (function(toArray, _spaces, undefined) {
			return function(className) {
				return this.set(set, [toArray(arguments).join(' ').split(_spaces)]);
			};

			function set(remove) {
				var className = this.className.split(_spaces);
				for(var i = className.length; i--; ) {
					if(remove.has(className[i]))
						className[i] = '';
				}

				this.className = className.join(' ');
			}

		})(Object.toArray, RegExp.spaces)).apply(this, arguments);
	};
	
	js.add.fullSize = (function(){
		return function(target){
			return this.get(get, [
				target
			  , ['scroll', target].camel()
			  , {
			  		'width': ['left', 'right']
			  	  , 'height': ['top', 'bottom']
			  	}[target]
			]);
		}
		
		function get(node, prop, scroll, dir){		
			// scrollHeight will  be less than real height when using height of css at msie 6 & 7
			return node[scroll]
			  + size(this, 'border-'+dir[0]+'-width')
			  + size(this, 'border-'+dir[1]+'-width')
			  + size(this, 'margin-'+dir[0]) 
			  + size(this, 'margin-'+dir[1])
				;			
		}
		
		function size(target, hyphen){
			var result = target.css(hyphen);
			return Number.unit(result) ?
				parseInt(result) :
				0;
		}  	
	})();
	
	js.adds('width|height', function(key) {
		js.add[key] = function(width) {
			return this.size(key);
		};
		
		js.add[['full', key].camel()] = function(){
			return this.fullSize(key);
		}
	});
	

	js.add.offset = (function(){
		return function(outer){
			return this.get(get, [outer]);
		};
		
		function get(node, outer){
			var rect = node.getBoundingClientRect()
			  , html = document.documentElement
			  , body = document.body
			  , sTop = window.pageYOffset || html.scrollTop || body.scrollTop
			  , sLeft = window.pageXOffset || html.scrollLeft || body.scrollLeft
			  , cTop = html.clientTop || body.clientTop || 0
			  , cLeft = html.clientLeft || body.clientLeft || 0
			  , top = rect.top + sTop - cTop
			  , left = rect.left + sLeft - cLeft
				;
			if(outer){
				var mTop = this.css('margin-top')
				  , mLeft = this.css('margin-left')
					;
					
				if(mTop.lastIndexOf('%')==0)
					mTop = this.parentNode.scrollWidth * (parseInt(mTop)*100);
				if(mLeft.lastIndexOf('%')==0)
					mLeft = this.parentNode.scrollHeight * (parseInt(mLeft)*100);
				
				
				top -= parseInt(mTop);
				left -= parseInt(mLeft);
			}
			return {
				top: Math.round(top)
			  , left: Math.round(left)
			};
		}
	})();	

	js.add.insert = function(type, html) {
		return (js.add.insert = (function(undefined) {
			return function(type, html) {
				type = choice(type);
				if(!Array.test(html)) {
					html = html instanceof js.js ?
						html.getNodes() :
						html.charAt ?
							html.tags() :
							[html];
				};

				if(this.single)
					return this.set(type[0], [html]);

				this.set(type[1], [html]);
				return this;
			};

			function choice(type) {
				switch(type) {
				case 'append':
					return [append, appends];
				case 'prepend':
					return [prepend, prepends];
				case 'after':
					return [after, afters];
				case 'before':
					return [before, befores];
				case 'replace':
					return [replace, replaces];
				}
			}

			function append(html) {
				while(html.length)
				this.appendChild(html.shift());
			}

			function appends(html) {
				for(var i = 0, c = html.length; i < c; i++) {
					this.appendChild(html[i].cloneNode(true));
				}
			}

			function prepend(html) {
				var first = this.childNodes[0];
				if(first) {
					before.call(first, html);
				} else {
					append.call(this, html);
					html.shift();
				}
			}

			function prepends(html) {
				var first = this.childNodes[0];
				if(first) {
					befores.call(first, html);
				} else {
					appends.call(this, html);
					html.shift();
				}
			}

			function after(html) {
				var parent = this.parentNode;
				while(html.length)
				parent.insertBefore(html.shift(), this.nextSibling);
			}

			function afters(html) {
				var parent = this.parentNode;
				for(var i = 0, c = html.length; i < c; i++)
					parent.insertBefore(html[i].cloneNode(true), this.nextSibling);
			}

			function before(html) {
				var parent = this.parentNode;
				while(html.length)
				parent.insertBefore(html.shift(), this);
			}

			function befores(html) {
				var parent = this.parentNode;
				for(var i = 0, c = html.length; i < c; i++)
					parent.insertBefore(html[i].cloneNode(true), this);
			}

			function replace(html) {
				var parent = this.parentNode;
				while(html.length)
				parent.replaceChild(html.shift(), this);
			}

			function replaces(html) {
				var parent = this.parentNode;
				for(var i = 0, c = html.length, nodes = [], node; i < c; i++) {
					node = html[i].cloneNode(true);
					parent.replaceChild(node, this);
				}
			}

		})()).apply(this, arguments);
	};

	js.adds('append|prepend|after|before|replace', function(key) {
		js.add[key] = function(html) {
			return this.insert(key, html);
		};
	});

	js.add.to = function(){
		alert('js.add.to was renamed to add.');
		return js.add.add.apply(this, arguments);
	};
	
	js.add.add = function(target){
		target = js(target);
		this.append(target);
		return target;
	};

	js.add.clone = function() {
		return (js.add.clone = (function(undefined) {
			return function() {
				return this.get(get);
			};
			function get() {
				// true 확인 필요
				return this.cloneNode(true);
			}

		})()).apply(this, arguments);
	};

	js.add.cloneJs = function() {
		return js(this.clone());
	};

	js.add.clear = function() {
		return (js.add.clear = (function(undefined) {
			return function() {
				return this.get(get);
			};

			function get() {
				return this.parentNode.removeChild(this);
			}

		})()).apply(this, arguments);
	};

	js.add.move = function(type, tag, loop) {
		return (js.add.move = (function(undefined) {
			var $types = {
				next : 'nextSibling',
				prev : 'previousSibling',
				parent : 'parentNode'
			}, _regex = /[^a-zA-Z]/;
			return function(type, tag, loop) {
				type = $types[type];
				if(!loop)
					loop = 1;

				return tag ? _regex.test(tag) ? this.get(match, [type, new RegExp('tag', i), loop]) : this.get(equal, [type, tag.toUpperCase(), loop]) : this.get(get, [type, loop]);
			};

			function equal(type, tag, loop) {
				var node = this;
				while(loop-- && self) {
					do {
						node = move(node, type);
					} while(node && node.tagName != tag);
				}
				return node;
			}

			function match(type, tag, loop) {
				var self = this;
				while(loop-- && self) {
					do {
						node = move(node, type);
					} while(node && !tag.test(node.tagName));
				}
				return node;
			}

			function get(type, loop) {
				var node = this;
				while(loop-- && node) {
					node = move(node, type);
				}
				return node;
			}

			function move(node, dir) {
				do {
					node = node[dir];
				} while(node && node.nodeType!=1 && node!=window);
				return node;
			}

		})()).apply(this, arguments);
	};

	js.adds('next|prev|parent', function(key) {
		js.add[key] = function(tag, loop) {
			return this.move(key, tag, loop);
		};

		js.add[key + 'Js'] = function(tag, loop) {
			return js(this.move(key, tag, loop));
		};
	});

	js.add.first = function() {
		return js.query(':first-child', this);
	};

	js.add.last = function() {
		return js.query(':last-child', this);
	};

	js.range = function(node) {
		this.node = node;
	};

	js.range.add = js.range.prototype;
	if(document.selection) {
		js.range.add.create = function() {
			this.node.focus();
			return document.selection.createRange();
		};

		js.range.add.cursor = function() {
			this.node.focus();
			var range = document.selection.createRange();
			range.moveStart('character', -this.node.value.length);
		};

		js.range.add.select = function(start, end) {
			end = end || start;
			var node = this.node;

			var range = js.range.create();
			range.moveStart('character', -node.value.length);
			range.moveStart('character', index);
			range.moveEnd('character', 0);
			range.select();
		};
	} else {
		js.range.add.cursor = function() {
			return this.node.selectionStart;
		};

		js.range.add.select = function(start, end) {
			end = end || start;
			var node = this.node;

			node.selectionStart = start;
			node.selectionEnd = end;
			node.focus();
		};
	}

	js.range.add.text = function(text, move) {
		move = move || 0;
		var node = this.node, scrolled = node.scrollTop, value = node.value;
		;

		cursor = this.cursor();
		node.value = value.substr(0, cursor) + text + value.substr(cursor);
		this.select(cursor + text.length + move);

		return false;
	};

	js.range.add.getLine = function() {
		return this.node.value.substr(0, this.cursor()).split('\n').length;
	};

	js.range.add.getLineValue = function(move) {
		move = move - 1 || -1;

		var node = this.node, value = node.value, lines = value.substr(0, this.cursor()).split('\n');
		return lines[lines.length + move];
	};

	js.range.add.textToLine = function(text) {
		var node = this.node, scrolled = node.scrollTop, value = node.value, char;

		var cursor = this.cursor(), br = value.substr(0, cursor).lastIndexOf('\n') + 1;
		node.value = value.substr(0, br) + text + value.substr(br);
		this.select(cursor + text.length);

		return false;
	};

	js.add.range = (function() {
		return function() {
			return this.get(get);
		};

		function get() {
			return new js.range(this);
		}

	})();

	return js;
})(js, window, document, Array, Boolean, Date, Function, Number, Math, Object, RegExp, String);
