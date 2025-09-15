mainApp.factory('dom', function() {
    return  {
		$$ : $,
		hide : function(el, options){
			var opt = options || {};
			$(el).hide();
		},
		show : function(el, options){
			var opt = options || {};
			$(el).show();
		}
	};
});