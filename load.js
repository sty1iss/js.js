window.js = (function(undefined){
	var _dir_ = /[^\/]+$/
	  , _use_ = /use (?=(?!strict))([\w\.]+)/ig
		;
			
	var js = {};
	
	js.headNode = document.getElementsByTagName('head')[0] ||
		document.getElementsByTagName('*')[0];
				
	js.require = function(src, callback){
		var node = document.createElement('script');
		if(callback)
			node.onload = callback;
		node.charset = 'UTF-8';
		js.headNode.appendChild(node);
		node.src = src;
	};
		
	js.include = document.readyState == 'complete' ?
		js.require :
		function(src){
			document.write('<script src="'+src+'"></'+'script>');
		};
	
	js.package = function(loading){
		var that = this
		  , nodes = js.headNode.childNodes
		  , script
		  , src
		  , i = nodes.length
			;
		
		while(i-->0){
			script = nodes[i];
			if(script.nodeType!=1 || script.tagName!='SCRIPT')
				continue;
			src = script.getAttribute('src');
			if(src===null)
				continue;
			break;
		}
		
		var dir = src.replace(_dir_, '')
		  , dev = script.getAttribute('dev') !== null
		  , cache = dev ?
		  		(src.indexOf('?')<0 ? '?' : '&')+'dev='+(new Date).getTime() :
		  		''
		  , use = (script.innerHTML || '').match(_use_) || []
		  , i = -1
		  , c = use.length
		  , add = function(src, callback){
				js.include(that.dir+src+cache, callback);
			}
			;
		
		this.dir = dir;
		this.src = src;
		this.dev = dev;		
		this.prefix = '';
		this.suffix = '';
		this.onload = script.onload;
		script.onload = null;
		
		loading && loading.call(this, add);
		
		while(++i<c)
			add(this.prefix+use[i].substr(4)+'.js');
	};
	
	return js;
})();

new js.package(function(add){	
	if(this.dev){
		window.console ||
			add('polyfill/console.js');
		add('dev.js');
	}else if(!window.console){
		window.console = {log:function(){}};
	}
	
	Array.prototype.indexOf ||
		add('polyfill/1.6.js');
	
	Array.prototype.reduce ||
		add('polyfill/1.8.js');
		
	String.prototype.trim ||
		add('polyfill/1.8.1.js');
		
	Array.isArray ||
		add('polyfill/1.8.5.js');

	add('js.js', this.onload);
	
	('jQuery' in window) &&
		add('polyfill/jquery.js');
	
	this.prefix = 'js.';
	this.dir+= 'extend/';
	
	js.dir = this.dir;
});