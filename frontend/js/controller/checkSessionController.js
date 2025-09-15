mainApp.controller('checkSessionController', function ($scope,  boundle, domTree, bundleRequest, $window, utilitiesFactory, httpFactory, serviceNote) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest,
		dom					= domTree;
		TOKEN				= "token",
		USERNAME			= "username";

	$scope.dataModel = bIta;
	$scope.titleCard = ""
	
	$scope.checkSession = function(options){
		if ($window.sessionStorage.getItem(TOKEN) !== null) {
			console.log("La variabile 'token' esiste:", $window.sessionStorage.getItem(TOKEN));
			checkIsTokenAlive({token:$window.sessionStorage.getItem(TOKEN)})
		} else {
			console.log("La variabile 'token' NON esiste");
			dom.loginForm.removeClass("d-none");
			dom.mainDashboard.addClass("d-none")
		}
	}

	function checkIsTokenAlive(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "GET",
			url			: req.checkTokenAlive,
			headers		: {
				"Content-Type"	: "application/x-www-form-urlencoded",
				"token"			: opt.token
			},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		// utils.showLoading({domContainer:$("#containerLogin")});
		checkAuthPromise.success(function(response){
			console.log(response)
			dom.mainDashboard.addClass("d-none");
			dom.loginForm.removeClass("d-none");
			if(response["status"] == "OK"){
				dom.mainDashboard.removeClass("d-none");
				dom.loginForm.addClass("d-none");
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)});
				dom.icoUser.text(response[USERNAME].charAt(0).toUpperCase())
			}else{
				// utils.alertMessage().error({
				// 	titleMessage:"Attenzione",
				// 	texteMessage:"Sessione scaduta!"
				// }).show();
			}
		});
		checkAuthPromise.error(function(){
			utils.alertMessage().error({
				titleMessage:"Attenzione",
				texteMessage:"Si è verificato un errore imprevisto si prega di riprovare più tardi"
			}).show(); 
		});
	}

})
