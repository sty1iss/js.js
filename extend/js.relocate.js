js.add.relocate = (function(){
	var _parents = [];
	
	return function(){
		return this.set(set);	
	}
	
	function set(node){
		_parents.push(this);
		var offset = this.offset();
		var child = this.child();
		node._jsRelocate_ = {
			width: this.width()
		  , top: offset.top
		  , left: offset.left
		  , child: child
		  , widths:[0]
		  , heights: []
		  , col : [0]		  
		};
		node.style.position = 'relative';
		child.set(ready);
		child.set(position);
		this.css('height', node._jsRelocate_.heights.max()+'px');
	}
	
	function reset(){
		for(var i = _parents.length, parent, width, __; i--;){
			parent = _parents[i];
			__ = parent[0]._jsRelocate_;
			width = parent.width();
			if(__.width != width){
				
				__.widths[0] = 0;
				__.col[0] = 0;
				parent[0]._jsRelocate_.width = width;
				parent[0]._jsRelocate_.heights = [];
				__.child.set(position);
				parent.css('height', __.heights.max()+'px');
			}
		}
	}
	
	function ready(node){
		var __ = node.parentNode._jsRelocate_
		  , offset = this.offset(true)
			;
		node.style.top = offset.top-__.top+'px';
		node.style.left = offset.left-__.left+'px';
		node.style.transition = 'top 0.5s, left 0.5s';
	}
	
	function position(node){
		node.style.float = 'none';
		node.style.position = 'absolute';
		var parent = node.parentNode
		  , __ = parent._jsRelocate_
		  , width = __.width
		  , widths = __.widths
		  , heights = __.heights
		  , col = __.col
			;
		
		if(!heights[col[0]])
			heights[col[0]] = 0;
		
		this.css('top', heights[col[0]]+'px');
		this.css('left', widths[0]+'px');

		widths[0]+= this.fullSize('width');
		
		heights[col[0]]+= this.fullSize('height');
				
		if(widths[0]>=width){
			widths[0] = 0;
			col[0] = 0;
		}else{
			col[0]++;
		}
	}
})();

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
// change to offsetWidth
js.add.fullWidth = (function(){
	return function(){
		return this.get(get);
	};
	
	function get(node){
		return node.scrollWidth
		  + parseInt(size(this, 'border-left-width'))
		  + parseInt(size(this, 'border-right-width') || 0)
		  + parseInt(size(this, 'margin-left') || 0)
		  + parseInt(size(this, 'margin-right') || 0)
			;
	};
	

})();

js.add.fullHeight = (function(){
	return function(){
		return this.get(get);
	};
	
	function get(node){
		
		return node.scrollHeight
		  + parseInt(this.css('border-top-width'))
		  + parseInt(this.css('border-bottom-width'))
		  + parseInt(this.css('margin-top'))
		  + parseInt(this.css('margin-bottom'))
			;
	};
})();

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