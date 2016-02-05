/**
 * falling things
 * @version 0.4.151026
 * @todo redesign for crossbrowser 
 */
'use static';

js.$.falling = (function(window, document, Math, js, undefined){
	var $parents = []
	  , $transTime = 0.033
	  , $windTime = 0.33
	  , $increaseTime = 1
		;
		
	js.resize($resize);
	
	return function(prefs){ 
		if(Array.test(prefs)){
			prefs = {things: prefs};
		}
		
		prefs = Object.merge(prefs, {
			things: []
		  , min: 1
		  , max: null
		  , increaseMax: null
		  , weight: 1
		  , maxWeight: null 
		  , minScale: 0.1
		  , maxScale: 1
		  , wind: 1
		  , windDir: 1
		  , windMax: 30
		  , windChangeChance: 30
		  , windIncreaseChance: 50
		  , updraft: null
		  
		  , speed: 1
		  
		  , src: null
		  , size: null
		  
		  , active: []
		  , deactive: []
		});
		
		if(!prefs.max || prefs.max < prefs.min)
			prefs.max = prefs.min;

		if(!prefs.maxWeight)
			prefs.maxWeight = prefs.size || prefs.things.length;
		
		if(!prefs.increaseMax)
			prefs.increaseMax = Math.round((prefs.max - prefs.min) * 0.1) + 1;
		
		if(!prefs.updraft)
			prefs.updraft = Math.round(prefs.windMax* 0.8);
		
		if(prefs.src){
			var things = []
			  , i = prefs.size
				;
			while(i-->0)
				things.push('<img src="'+prefs.src.replace('$no', i+1)+'">');
			delete prefs.src, prefs.size;	
			prefs.things = things;
		}
		
		if(prefs.wind=='rand')
			prefs.wind = Math.rand(-prefs.windMax, prefs.windMax);

		prefs.minScale *= 10;
		prefs.maxScale *= 10;
		
		return this.set($set, [prefs]);
	};
	
	function $set(node, prefs){
		var container = this.appended('<div/>')
				.css(
					'position', 'absolute'
				  , 'top', 0
				  , 'left', 0
				  , 'width', '100%'
				  , 'height', '100%'
				  , 'overflow', 'hidden'
				)
		  , width = container[0].scrollWidth
		  , height = container[0].scrollHeight
		  , min = prefs.min
		  , max = prefs.max
		  , weight = prefs.weight
		  , maxWeight = prefs.maxWeight
		  , minScale = prefs.minScale
		  , wind = prefs.wind
		  , i = max
		  , things = prefs.things
		  , active
			;
		
		prefs.container = container[0];
		prefs.width = width;
		prefs.height = height;
		if(node == document.body){
			container.css('min-height', height);
		}else{
			this.css('position', 'relative');
		}

		while(i-->0){
			thing = container.appended('<div/>')
				.html(things.rand());
			
			thing = thing[0];
			
			active = i < min;
			
			thing.weight = Math.rand(weight, maxWeight);
			thing.scale = Math.rand(prefs.minScale, prefs.maxScale)/10;			
			thing.speed = thing.scale*10;
			
			thing.style.position = 'absolute';
			thing.style.top = 0;
			thing.style.left = 0;
			thing.style.visibility = active ?
				'visible' :
				'hidden';
			thing.style.zIndex = 800+(thing.scale*10);
			
			thing.top = -height*0.5;
			thing.left = Math.rand(-thing.scrollWidth, width);
			
			thing.rotate = Math.rand(-360, 360);
			thing.rotateDir = node.rotate < 0 ?
				-1 :
				1;
			
			thing.rotateKeep = wind * 10;
			$trans(thing);
			container.append(thing);
			prefs[active ? 'active' : 'deactive'].push(thing);
		}
		js.interval($animate, 1, $transTime);
		js.interval($wind, 1, $windTime);
		js.interval($increase, 1, $increaseTime);
		
		node._jsFalling = prefs;
		
		$parents.push(node);		
	}
	
	function $increase(){
		var i = $parents.length
		  , prefs
		  , j
		  , k
		  , thing
		  	;
		
		while(i-->0){
			prefs = $parents[i]._jsFalling;
			j = prefs.deactive.length;
			if(!j)
				continue;
			
			k = Math.rand(0, prefs.increaseMax);
			if(k>j)
				k = j;
			while(k-->0){
				thing = prefs.deactive.pop();
				thing.style.visibility = 'visible';
				prefs.active.push(thing);
			}
		}
	}
	
	function $animate(){
		var i = $parents.length
		  , j
		  , wind
		  , windAbs
		  , width
		  , height
		  , thing
			;
		while(i-->0){
			prefs = $parents[i]._jsFalling;
			width = prefs.width;
			height = prefs.height;

			wind = prefs.wind;
			windAbs = Math.abs(prefs.wind);
			up = wind - prefs.updraft
			j = prefs.active.length;
			while(j-->0){
				thing = prefs.active[j];
				
				thing.top+= (thing.speed) * prefs.speed;
				if(thing.top > height){
					thing.top = -thing.scrollHeight;	
				}else if(thing.top < -thing.scrollHeight){
					thing.top = height;
				}
				
				//left = wind * Math.round(prefs.maxWeight - thing.weight);
				thing.left+= Math.rand(wind/2, wind);
				if(thing.left > width){
					thing.left = -thing.scrollWidth;
				}else if(thing.left < -thing.scrollWidth){
					thing.left = width;
				}
				
				rotate = (prefs.maxWeight - thing.weight) + 1;
				if(Math.rand(10)<2 && thing.rotateKeep--<0){
					thing.rotateDir = thing.rotateDir < 0 ?
						1 :
						-1;
					thing.rotateKeep = windAbs;
				}else{
					if(wind > prefs.updraft){
						thing.top-= Math.rand(1, up);
					}
				}
				
				thing.rotate += thing.rotateDir < 0 ?
					-rotate :
					rotate;
				
				$trans(thing);
			}
			break;
		}
	}
	
	function $trans(thing){
		thing.style.transform = 'translate3d('+thing.left+'px, '+thing.top+'px, 0px) rotate('+thing.rotate+'deg) scale('+thing.scale+')';
	}

	function $wind(){
		
		var i = $parents.length
		  , chance = Math.rand(100)
			;
			
		while(i-->0){
			prefs = $parents[i]._jsFalling;
			if(chance<prefs.windIncreaseChance){
				prefs.wind += prefs.windDir < 0 ?
					-1 :
					1;
			}

			if(Math.abs(prefs.wind) == prefs.windMax || chance < prefs.windChangeChance){
				prefs.windDir = prefs.windDir < 0 ?
					1 :
					-1;
			}
		}
		
	}
	
	function $resize(){
		var i = $parents.length
		  , parent
		  , prefs
			;
		while(i-->0){
			parent = $parents[i];
			prefs = parent._jsFalling;
			prefs.width = prefs.container.scrollWidth;
			prefs.height = prefs.container.scrollHeight;
		}
	}
})(window, document, Math, js);