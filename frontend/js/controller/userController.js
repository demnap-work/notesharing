mainApp.controller('userController', function ($scope,  boundle, domTree, bundleRequest, $window, utilitiesFactory, httpFactory) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest;
		dom					= domTree;

		TOKEN				= "token"

	$scope.dataModel = bIta;
	$scope.titleCard = ""

	$scope.showLogin = function(){
		console.log("sono qui")
		dom.formRegistrazione.addClass("d-none");
		dom.loginForm.removeClass("d-none");
	}

	$scope.addNewUser = function(){
		addNewUser({
			user	: dom.usernameText.val(),
			pwd		: dom.passwordText.val(),
			pwd2	: dom.password2Text.val(),
		})
	}

	function addNewUser(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.addUser,
			headers		: {"Content-Type"	: "application/x-www-form-urlencoded"},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				user	: opt.user,
				pwd 	: opt.pwd,
				pwd2 	: opt.pwd2,
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		// utils.showLoading({domContainer:$("#containerLogin")});
		checkAuthPromise.success(function(response){
			if (response["status"] =="OK"){
				utils.alertMessage().success({
					titleMessage:"Nuuovo utente inserito con successo",
				}).show(); 
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile inserire il nuovo utente, verificare che tutti i campi siano inseriti correttamente"
				}).show();
			}
			console.log(response)
		});
		checkAuthPromise.error(function(){
			utils.alertMessage().error({
				titleMessage:"Attenzione",
				texteMessage:"Si è verificato un errore imprevisto si prega di riprovare più tardi"
			}).show();  
		});
	}

})
