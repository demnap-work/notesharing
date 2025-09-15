mainApp.factory("httpFactory", function($http) {	
    return  {
		ajaxCall:function(options){
			
			var opt = options || {};
			
			return $http(opt).success(function(response){
					return response;
				}).error(function(response){
					return response;
				});
		},
		
		urlEncoded : function(obj) {
			var str = [];
			for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			return str.join("&");
		},
		
		httpModuleFactory : $http
	};
});