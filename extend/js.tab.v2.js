/**
 * create layout to tab-like style.
 * @version 1.12.2.160202
 * @todo 탭 컨덴츠를 원하는 수만큼 묶어 계산하기
 * @todo 해쉬값에 따른 자동 인덱스
 */

js.prefs.tab = {
	'target': '.tab-i'
  , 'button': null
  , 'ui': null
  , 'ui-position': 'top'
  , 'ui-combine': false
  , 'timer': null
  , 'index': null
  , 'event': 'click'
  
  , 'type': 'normal'
  
  , 'prev': '%EC%9D%B4%EC%A0%84'
  , 'page': '%EB%B2%88%EC%A7%B8%20%EB%B3%B4%EA%B8%B0'
  , 'next': '%EB%8B%A4%EC%9D%8C'
  
  , 'change': null
  
  , 'animate-time' : 0.5
  
  // consider
  , 'image': null
};

js.$.tab = (function(undefined){
	js.use.css('tab.v2');
	js.ready($bridge, '[tab-target]');
	
	//location.hash &&
		//$hash();
	
	var $index = 0
	  , $hash = location.hash
	  , $_contentClass = /([\w-]*tab-(?!near)\w*)/g
	  , $_tabsClass = /([\w-]*tabs-\w+)/g
	  , $_nearClass = /([\w-]*tab-near-\w+)/g
		;
	
	$bridge.type = {};
	
	return $bridge;
	
	function $bridge(prefs, callback){
		prefs = Object.merge(prefs, js.prefs.tab);	
		return this.set($set, [prefs, callback]);
	}
			
	function $set(node, prefs, callback){
		var type = this.attr('tab-type') || prefs['type']
		  , method = $bridge.type[type];
		  
		if(method.prefs)
			prefs = Object.merge(prefs, method.prefs);
		
		prefs = js.merge('tab', node, prefs);
		
		var contents = js.query(prefs['target'], node);
		if(!contents)
			throw new ReferenceError('Can\'t find elements of '+prefs['target']);
		
		$index++;
		prefs['prev'] = prefs['prev'].decode();
		prefs['page'] = prefs['page'].decode();
		prefs['next'] = prefs['next'].decode();
		
		// disable javascript fallback
		this.css('overflow-y') == 'visible' ||
			this.css('overflow-y', 'hidden');
		
		var id = node.id || 'tab'+$index
		  , size = contents.length
		  , last = size - 1
		  , index = prefs['index'] ?
	  			Number(prefs['index']) - 1 :
	  			Math.rand(size) 
		  , event = prefs['event'] == 'over' ?
		  		'tap' :
		  		'click'
		  , contentClass = node.className.match($_contentClass) || ['tab']
		  , tabsClass = node.className.match($_tabsClass) || ['tabs']
		  , nearClass = node.className.match($_nearClass) || ['tab-near']
			;
			
		if(index >= size){
			index = size-1;
		}else if(index<0){
			index = 0;
		}
		
		var change = prefs['change'] ?
			(function(change){
				if(change.charAt){
					change = change.split('.');
					var i = 0;
					var object = window;
					var method;
					
					for(;property = change[i++];){
						object = object[property];
					}
					change = object;
				}
				return change;
			})(prefs['change']) :
			null;

		node._jsTab = {
			self: this
		  , contents: contents
		  , index: $getPrevIndex(index, last)
		  , last: last
		  , timer: null
		  , method: method
		  , prefs: prefs,
		  
		  change: change
		  
		}
		
		method.init &&
			method.init(node._jsTab);
			
		// set class for stylesheet
		node.className+= $getClass(tabsClass, 'n'+size);
		
		var ui = this[prefs['ui-position']=='top'?
				'prepended' :
				'appended'
			]('<div class="tabUI">');
		
		ui[0]._jsTab = {
			parent: node
		};
		
		id = id+'-';
		
		var hash = '#'+id
		  , pages = ui.appended('<div class="'+$getClass(tabsClass)+'"/>')
		  , content
		  , tab
		  , link = []
		  , title
		  , i=0
			;
		
		size = contents.length;
		// for each contents
		for(;i<size; i++){
			page = i + 1;
			content = contents[i];
			content.className+= $getClass(contentClass, 'i');
			
			if(prefs['button']){
				title = prefs['button'] == 'self' ?
					js(content) :
					js(prefs['button'], content);
				
				value = title ?
					title[0].tagName == 'IMG' ?
						'<img src="'+title[0].getAttribute('src')+'">' :
						title[0].innerHTML :
						page + prefs['page'];
			}else{
				value = page + prefs['page'];
			}
			
			if(content.id){
				tabTarget = '#'+content.id;
			}else{
				tabTarget = hash+page;
				content.id = id+page;
			}
					
			tab = pages.appended('<a.page href="' + tabTarget + '">' + value + '</a>');
			tab.on(event, $show);
			//js(tab[0].childNodes[0]).on(event, $show);
			
			tab[0]._jsTab = {
				parent: node
			  , index: i
			}
			
			content._jsTab = {
				tab: tab
			  , index: i
			}
			
			method.set(node._jsTab, prefs, content, tab[0]);
		}
		
		var near = prefs['ui-combine'] ?
			pages :
			ui.appended('<div class="'+$getClass(nearClass)+'"/>');
		
		var prev = near.prepended('<a.prev href="'+hash+'prev">'+prefs['prev']+'</a>')
			.click($showPrev);
		next = near.appended('<a.next href="'+hash+'next">'+prefs['next']+'</a>')
			.click($showNext);

		prev[0]._jsTab = 
		next[0]._jsTab = {
			parent: node
		}

		$show.call({_jsTab: {
			index: index
		  , parent: node
		}});
		
		// make delay for css animation
		setTimeout(function(){
			node.className+= ' tabApplied';
			callback &&
				callback();
		});
			
		prefs['timer'] &&
			$getTimer(this);

		this.touch($touchEvent);
	}
	
	function $getClass(classes, suffix){
		suffix = suffix || 'i';
		return ' '+classes.join('-'+suffix+' ')+'-'+suffix+' ';
	}
	
	function $getPrevIndex(index, last){
		var prev = index - 1;
		return prev < 0 ?
			last :
			prev;
	}
	
	function $show(event){
		var _ = this._jsTab
		  , __ = _.parent._jsTab
		  , prefs = __.prefs
		  , prev = __.contents[__.index]
		  , next = __.contents[_.index]
			;
		
		if(__.index == _.index)
			return true;
			
		__.index = _.index;
		__.method.show(__, prefs, prev, next);
		
		prev._jsTab.tab.stylex('here');
		next._jsTab.tab.style('here');
		
		if(__.change){
			__.change.call(__, next);
		}
		
		if(event){
			event.stop();
		}
		
		return false;
	}
	
	function $showPrev(event){
		var parent = event instanceof js.event ?
			this._jsTab.parent :
			event
		  , _ = parent._jsTab			
			;
		
		return $show.call({_jsTab: {
			index: $getPrevIndex(_.index, _.last)
		  , parent: parent
		}});
	}
	
	function $showNext(event){
		var parent = event instanceof js.event ?
			this._jsTab.parent :
			event
		  , _ = parent._jsTab
		  , index = _.index + 1
			;
		
		return $show.call({_jsTab: {
			index: _.last < index ?
				0 :
				index
		  , parent: parent		
		}});
	}
	
	function $showByHash(content){
		$show.call(content._jsTab.tab);
	}
	
	function $getTimer(target){
		var _ = target[0]._jsTab;
		
		_.timer = js.interval(function(){
			$showNext(target[0]);
		}, Number(_.prefs['timer']));
		
		target
			.over($contentOver)
			.out($contentOut)
			;		
	}

		function $contentOver(){
			this._jsTab.timer.pause();	
		}
		
		function $contentOut(){
			this._jsTab.timer.reset();
		}
	
	function $touchEvent(event){
		if(event.left()){
			$showNext(this);
		}else if(event.right()){
			$showPrev(this);
		}
	}
})();

js.$.tab.type.normal = {
	set: function(parent, prefs, content, i){
  		content.style.display = 'none';
  }
  , show: function(parent, prefs, prev, next){
  		js(prev).hide();
  		js(next).show();
		//prev.style.display = 'none';
  		//next.style.display = 'block';
  }
};

js.$.tab.type.classic = js.user.under('ie', 9) ?
	js.$.tab.type.slide : {
	set: function(content, i){
		if(i)
			content.style.display = 'none';
	}
  , show: function(parent, prefs, prev, next){
		var target = parent.contents[0];
		target.alt = next.alt ?
			next.alt : '';
		target.style.filter = 'blendTrans(duration=1)';
		target.filters.blendTrans.Apply();
		target.src = next.src;
		target.filters.blendTrans.Play();
  }
}

js.$.tab.type.slide = js.user.under('ie', 9) ?
	js.$.tab.type.normal : {
	prefs: {
		'animate': 'fade'
	  , 'animate-prefix': 'tab-ani-'
	  , 'animate-time': 0.5
	  , 'show-class': 'tab-show'
	  , 'hide-class': 'tab-hide'
	}
	
  , init: function(_){
  		var animate = _.prefs['animate'].split('-');
  		if(!animate[1])
  			 animate[1] = animate[0];
  		
  		_.animate = [
  			_.prefs['animate-prefix'] + animate[0]
		  , _.prefs['animate-prefix'] + animate[1]
  		];
  		
  		_.animate = [
  			[_.animate[0], _.animate[1]] 
  		  , [_.animate[1], _.animate[0]]
  		];
  		
		_.animateTime = _.prefs['animate-time'] * 1000;
	}
	
  , set: function(parent, prefs, content, i){
  		content.style.display = 'none';
  		content.style.animationDuration= prefs['animate-time']+'s';
  }
  
  , show: function(parent, prefs, prev, next){

  		if(parent.animated){
  			clearTimeout(parent.animateTimer);
  			parent.animated();
  		}

  		var prevNo = prev._jsTab.index
  		  , nextNo = next._jsTab.index
  		  , animate = (prevNo == parent.last && nextNo == 0) ||
  		  		(!(prevNo == 0 && nextNo == parent.last) &&
  		  			prevNo < nextNo) ?
  		  		parent.animate[0] :
	  			parent.animate[1]
  		
  		next = js(next);
  		
  		parent.self
			.stylex(animate[1])
			.style(animate[0])
			;
  			
  		prev = js(prev)
  			.show()
  			.style(prefs['hide-class']);
  		
  		next
  			.style(prefs['show-class'])
  			.show();

  		parent.animated =  function(){
  			parent.animated = null;
  			prev
				.hide()
				.stylex(prefs['hide-class'])
				;
			next.stylex(prefs['show-class']);  	
  		}
  		
  		parent.animateTimer = setTimeout(parent.animated, parent.animateTime)	
  }
}

js.$.tab.type.order = {
	prefs: {
  		'order': null
  	  , 'order-index': null
  	  , 'order-class': 'order'
  	}	
  , init: function(_){
  		_.orderClass = new RegExp(' '+_.prefs['order-class']+'\\w+', 'g');

  		var contents = _.contents
  		  , size = contents.length
  			;

  		_.prefs['order'] = _.prefs['order'] ?
  			Number(_.prefs['order']) :
  			size;
  			
  		if(!_.prefs['order-index'])
  			_.prefs['order-index'] = _.prefs['order'] == 1 ?
  				1 :
  				Math.ceil(_.prefs['order']/2);
  		_.prefs['order-index']--;
  		
  		// need three elements to the before, the after and the off
		var order = _.prefs['order']+3
		  , i = 0
		  , clone
		  , to = contents[0].parentNode
		  , tab
			;
		do{
			contents[i].className = contents[i].className.replace(/order[^\s]+/g, '');	
		}while(++i < contents.length);
			
		while(order > contents.length){
			for(i=0; i<size; i++){
				clone = contents[i].cloneNode(true);
				contents.push(clone);
				to.appendChild(clone);
			}
		}
		
		// for don't use equal oper
		_.prefs['order']++;
		
		_.last = contents.length-1;
		_.size = _.last+1;
		
		_.classes = {};
		_.classes[_.size] = 'Before';
		_.classes[_.prefs['order']] = 'After';
	}
  , set: function(parent, prefs, content){
  		content.className+= prefs['order-class']+'Off';
  	}
  	
  , show: function(parent, prefs, prev, next){
  		// change focus
  		var index = parent.index - prefs['order-index'];
  		if(index<0)
  			index = parent.last - index - 1;
  		//console.log(parent.last, index);
  		var contents = parent.contents
		  , content
		  , order = prefs['order']
		  , className = ' '+prefs['order-class']
		  , size = contents.length
		  , i = size
		  , precalc = size - index
		  , key
		  , classes = parent.classes
		  , _orderClass = parent.orderClass
			;
		while(i-->0){
			key = ((precalc + i) % size) + 1;
			content = contents[i];
			content.className = content.className.replace(_orderClass, className+(
				classes[key] ?
					classes[key] :
					key > -1 && key < order ?
						key :
						'Off'
			));
		}
	}
}
