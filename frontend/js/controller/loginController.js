mainApp.controller('loginController', function ($scope, boundle, domTree, bundleRequest, $window, utilitiesFactory, httpFactory, serviceNote) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest,
		dom					= domTree,
		TOKEN				= "token",
		USERNAME			= "username";

	$scope.dataModel = bIta;
	$scope.titleCard = "";
	
	$scope.initLogin = function(){
		console.log("ho inizializzato la index");
	};

	$scope.login = function(model){
		user 	= $("#user").val();
		pwd 	= $("#pwd").val();
		console.log(user, pwd)
		login({user:user, pwd:pwd})
	}
	
	$scope.showRegistrazione = function(model){
		dom.formRegistrazione.removeClass("d-none");
		dom.loginForm.addClass("d-none");
	}

	function login(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.getLogin,
			headers		: {"Content-Type": "application/x-www-form-urlencoded"},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				user	: opt.user,
				pwd		: opt.pwd,
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		utils.showLoading({domContainer:$("#bodyNoteSharing")});
		checkAuthPromise.success(function(response){
			console.log(response)
			if (response["status"] =="OK"){
				$window.sessionStorage.setItem(TOKEN, response[TOKEN])
				$window.sessionStorage.setItem(USERNAME, response[USERNAME])
				window.sessionStorage.removeItem("myVar")
				dom.loginForm.addClass("d-none")
				dom.mainDashboard.removeClass("d-none")
				dom.icoUser.text(response[USERNAME].charAt(0).toUpperCase())
				dom.containerNotePostit.empty();
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)});
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile effettuare il login. Inserire correttamente User e Password"
				}).show();
			}
			
		});
		checkAuthPromise.error(function(){
			utils.alertMessage().error({
				titleMessage:"Attenzione",
				texteMessage:"Impossibile effettuare il login. Si prega di riprovare più tardi"
			}).show();
			utils.hideLoading();
		});
	}
})
