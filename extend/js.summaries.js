/**
 * content toggle like faq style by title
 */
js.$.summaries = (function(){
	return function(option){
		option = Object.merge(option || {}, {
			'target': 'dl'
		  , 'title': 'dt'
		  , 'content': 'dd'
		});
		
		return this.set(set, [option]);
	}
	
	function set(option){
		var items = js.query(option['target'], this)
		  , i = items.length
		  , item
		  , title
		  , content
			;
		while(i--){
			item = items[i];
			// i wanted to find direct child.
			title = js(js.query(option['title'], item)[0]);
			content = js(js.query(option['content'], item)[0]);
			title.click(click);
			content.hide();
			
			title[0]._jsSummaries = {
				title: title
			  , content: content
			  , display: false
			}
		}
	}
	
	function click(){
		var _ = this._jsSummaries;
		if(_.display){
			_.title.stylex('open');
			_.content.hide();
		}else{
			_.title.style('open');
			_.content.show();
		}
		_.display = !_.display;
	}
})();
