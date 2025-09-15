mainApp.controller('dashboardController', function ($scope,  boundle, domTree, bundleRequest, $window, utilitiesFactory, httpFactory, serviceNote) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest;
		dom					= domTree;
		TOKEN				= "token"

	$scope.dataModel = bIta;
	$scope.titleCard = ""
	
	$scope.logout 		= function(model){logout({token:$window.sessionStorage.getItem(TOKEN)})}
	$scope.initNote 	= function(model){}
	$scope.searchTag 	= function(model){searchTag()}
	$scope.deleteNotaShow = function(model){dom.deleteNotaModal.modal('show');}

	$scope.openEditorNota = function(model){
		$(".ql-editor").empty();
		dom.idNotaModify.html("");
		dom.exampleModalLongTitle.html("Aggiungi nuova nota ");
		dom.tagsText.val("");
		dom.salvaNotaButton.removeClass("d-none");
		dom.modificaNotaButton.addClass("d-none");
		dom.nuovaNotaModal.modal("show");
	}

	function searchTag(options){
		var value = ($scope.tagsText || "").toLowerCase().trim();
		$("#containerNotePostit .post-it").filter(function() {
			var tags = ($(this).attr("tags") || "").toLowerCase();
			$(this).toggle(tags.indexOf(value) > -1);
		});
	}


	function logout(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "GET",
			url			: req.getLogout,
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
			if (response["status"] =="OK"){
				$window.window.sessionStorage.setItem(TOKEN, "")
				dom.loginForm.removeClass("d-none")
				dom.mainDashboard.addClass("d-none")
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile effettuare il logout"
				}).show();
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
