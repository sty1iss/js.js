/*
 * create multi drop-down navigation with responsible style.
 * @version 0.4
 */
js.$.nav = (function(mobile){
	var _roots = []
	  , _parents = []
	  , _outTimer
	  , _outDelay = 300
	;
	
	js.ready(bridge, '[nav-target]');
	js.resize(resize);
	js.root().over(out);
	
	return bridge;
	
	function bridge(option){
		option = Object.merge(option || {}, {
			'fold': 'close'
		  , 'unfold': 'open'
		  , 'transform': null
		  , 'shortcut': null
		  , 'mobile': null
		  , 'mobile-width': 500
		});
		
		return this.set(set, [option]);
	};
	
	function set(node, option){
		option = js.merge('nav', node, option);
		option['transform'] = Number(option['transform']);
		
		node._jsNav_ = {
			root: this
		  , option: option
		}
		
		var dot = this;
		if(node.tagName!='UL'){
			dot = js(node.getElementsByTagName('ul')[0]);
			node = dot[0];
		}
		
		if(option['transform']){
			_roots.push(this);
			transform(this);
		}
		
		if(option['shortcut']){
			var shortcut = js(option['shortcut']);
			shortcut[0]._jsNav_ = this;
			shortcut.click(shortcutClick);
			//this.hide();
		}
		
		if(option['mobile']){
			var icon = js(option['mobile']);
			icon[0]._jsNav_ = this;
			icon.click(mobileClick);
			if(widthTest(this, 'mobile-width'))
				this.hide();
		}
		
		this
			.style('navApplied')
			.stylex('pure');
		
		publish(dot, node, this);
	}
	
	function publish(dot, parent, root, depth){
		if(!parent._jsNav_){
			parent._jsNav_ = {
				root: root
			}
		}
		
		depth = depth || 0;
		
		parent.className+= ' nav'+depth;
		_parents.push(parent);
		var option = root[0]._jsNav_.option
		  , items = dot.child().filter('li')
		  , item
		  , child
		  , link
		  , sub
		  , i = items.length
			;
			
		while(i--){
			item = js(items[i]);
			item[0].className+= ' navLi'+depth;
			item.over(stop);
			child = item.child();
			if(!child)
				continue;
			link = child.filter('a');
			sub = child.filter('ul');
			if(link){
				link[0]._jsNav_ = {
					parent: parent
				  , item: item
				};
				link[0].className+= ' navA'+depth;
				
				(!option['transform'] &&
					mobile &&
						sub &&
							link.click(click)
				) ||
					link.over(over);

				if(sub){
					expand = js('<span.navExpand>'+option['unfold']+'</span>').click(expandClick);
					expand[0]._jsNav_ = link[0];
					item.append(expand);
					sub.style('navFold');
					
					link[0].className+= ' navAWithSub';
					link[0]._jsNav_.sub = sub;
					sub[0].className+= ' navSub';
					publish(sub, sub[0], root, depth+1);
				}									
			}
		}
	}
	
	function over(event){
		hideCancel();

		var _ = this._jsNav_
		  , item = _.item
		  , sub = _.sub
		  , __ = _.parent._jsNav_
		  , prev = __.prev
		  ;
		
		if(transformTest(__.root))
			return;
			
		if(prev){
			hide(prev);
		}
		
		if(sub){
			show(this);
		}	
		return event.stop();
	}
	
	function expandClick(event, node){
		var _ = node._jsNav_._jsNav_
		  , sub = _.sub
		  , option = _.parent._jsNav_.root[0]._jsNav_.option
			;
		if(node.clicked){
			node.clicked = false;
			node.innerHTML = option['unfold'];
			this.stylex('ed');
			sub
				.style('navFold')
				.stylex('navUnfold');
			
		}else{
			node.clicked = true;
			node.innerHTML = option['fold'];
			this.style('ed');
			sub
				.stylex('navFold')
				.style('navUnfold');
		}
		return event.stop();
	}
	
	function click(event){
		if(this.clicked){
			hide(this);
			return true;				
		}
		over.call(this, event);
		return false;
	}
	
	function show(a){
		a.clicked = true;
		var store = a._jsNav_;
		store.parent._jsNav_.prev = a;
		store.item.style('navLiOpen');
		a.className+= ' navAOpen';
		if(store.sub){
			a.className += ' navAWithSubOpen';
			store.sub.style('navSubOpen');
		}
	}
	
	function hide(a){
		a.clicked = false;
		var store = a._jsNav_;
		a = js('a');
		store.item.stylex('navLiOpen');
		a.stylex('navAOpen');
		if(store.sub){
			js(a).stylex('navAWithSubOpen');
			store.sub.stylex('navSubOpen');
		}
		
	}
	
	function stop(event){
		hideCancel();
		return event.stop();
	}
	
	function out(event){
		hideCancel();
		_outTimer = setTimeout(hideAll, _outDelay);
	}
	
	function hideCancel(){
		if(_outTimer){
			clearTimeout(_outTimer);
		}
	}
		
	function hideAll(){
		var i = _parents.length
		  , parent
		  , prev
		  ;
		while(i--){
			parent = _parents[i];
			prev = parent._jsNav_.prev;
			prev &&
				hide(prev);
		}
	}
	
	function resize(){
		var i = _roots.length;
		var root;
		while(i-->0){
			transform(_roots[i]);
			
			root = _roots[i];
			if(widthTest(root, 'mobile-width')){
				root.hide();
			}else{
				root.show();
			}
		}
	}
	
	function widthTest(root, target){
		return root[0]._jsNav_.option[target] >= document.body.scrollWidth;
	}
	
	function transformTest(root){
		return root[0]._jsNav_.option['transform'] >= document.body.scrollWidth;
	}
	
	
	
	function transform(root){
		root[transformTest(root) ?
			'style' :
			'stylex'	
		]('navTransform');
	}
	
	function shortcutClick(event){
		var root = this._jsNav_;
		root.toggle();
	}
	
	function mobileClick(event){
		var root = this._jsNav_;
		root.toggle();
	}	
})(js.user.mobile);