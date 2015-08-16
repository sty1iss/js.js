js.add.subMenu = (function(){
	var $index = 0
	  , $parents = []
	  , $hideTimer
	  , $hideDelay = 450
		;
	return function(){
		this.set(setItem);
	};	
	
	
	function setItem(parent, depth){
		depth = depth || 0;
		parent._jsSubMenu_ = {};
		parent.className+= ' depth'+depth;
		$parents.push(parent);
		
		for(var items = this.child()
			  , item
			  , child
			  , link
			  , sub
			  , i = items.length
			; i--
			;){
			item = items[i];
			child = js(item).child();
			link = child.filter('a');
			sub = child.filter('ul');
			if(link.js){
				link[0]._jsSubMenu_ = {
					parent: parent
				};
				link.over(over);
				if(sub.js){
					link[0]._jsSubMenu_.sub = sub;
					sub
						.hide()
						.over(subOver)
						;
					setItem.call(sub, sub[0], depth+1);
				}
			} 
		}
	}

	function over(event){
		hideCancel();
		event.stop();

		var store = this._jsSubMenu_
		  , parent = store.parent
		  , sub = store.sub
		  , prev = parent._jsSubMenu_.show; 
		  ;
		 
		if(prev){
			prev.hide();
		}
		
		if(sub){
			parent._jsSubMenu_.show = sub.show();
			js.body().over(hideReady);
		}
		return false;
	}
	
	function subOver(event){
		hideCancel();
		return event.stop();
	}
	
	function hideReady(event){
		hideCancel();
		$hideTimer = setTimeout(hiding, $hideDelay);
		return event.stop();		
	}
	
	function hideCancel(){
		if($hideTimer)
			clearTimeout($hideTimer);
	}
	
	function hiding(event){	
		for(var i=$parents.length
			  , parent
		  ; i--
		  ;){
		  	parent = $parents[i];
		  	if(parent._jsSubMenu_.show){
		  		parent._jsSubMenu_.show.hide();
		  		parent._jsSubMenu_.show = null;
		  	}
		}
		js.body().overx(hideReady);
	}
})();