mainApp.factory('loadingGifFactory', function($scope) {
	

	function showLoading(options){
		var opt = options || {},
		$containerMask = $("<div class='containerMask'>"),
		$containerLoading = $("<div class='containerLoading'>"),
		$loadLogo = $("<div class='loaderLogo'>");
		$(opt.domContainer).append($containerMask.append($containerLoading.append($loadLogo)));
	};

	function showMaskError(options){
		var opt = options || {},
		$containerMask = $("<div class='containerMask'>"),
		$containerLoading = $("<div class='containerTextError'>"),
		$pText = $("<p>");
		$pText.html("Dati momentaneamente non disponibili, Riprovare pi&egrave; tardi.");
		$(opt.domContainer).append($containerMask.append($containerLoading.append($pText)));
	};
	
	function hideLoading(options){
		var opt = options || {};
		$(opt.domContainer.find(".containerLoading")[0]).remove();
	};
	
	return {
		showGifLoading	: function(options){showLoading(options);},
		hideGifLoading	: function(options){hideGifLoading(options)},
		showMaskError	: function(options){showMaskError(options)}
	}

});
