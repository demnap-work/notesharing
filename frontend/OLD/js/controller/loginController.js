mainApp.controller('loginController', function ($scope, boundle, bundleRequest, $window, utilitiesFactory, httpFactory) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest;

	$scope.dataModel = bIta;
	$scope.titleCard = ""
	
	

	function checkLogin(options){
		
		if (localStorage.getItem("loginOk") === "true"){
			$window.location.href = req.redirect.dashboard;
		}else{
			$window.location.href = req.redirect.index;
		}
	}

	$scope.initLogin = function(){
		// console.log(localStorage);
		$("#alertCredential").hide();
	};

	$scope.init = function(){
		checkLogin({});
	};

	$scope.auth = function(){
		checkAuth({
			user:$("#user").val(),
			pwd:$("#pwd").val()
		})
	}

	function checkAuth(options){
		var opt = options || {},
			optcredentialb64 = window.btoa(opt.user+":"+opt.pwd); //utils.encodeBase64(opt.user)+utils.encodeBase64(opt.pwd);
		var checkAuthPromise = http.ajaxCall({
			method	: "GET",
			url		: req.getStatoCPS,
			headers	: {
				'Authorization': 'Basic '+optcredentialb64,
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#containerLogin")});
		checkAuthPromise.success(function(response){
			if(response["RC"]==="0" || response["RC"]===0){
				localStorage.setItem("loginOk", true);
				localStorage.setItem("credential", 'Basic '+optcredentialb64);
				localStorage.setItem("username", $("#user").val());
				$window.location.href = req.redirect.dashboard;
			}else{
				$("#alertCredential").show();
				
			}
			hideLoading({domContainer:$("#containerLogin")});
		});
		checkAuthPromise.error(function(){
			getAlert({
				msg:"Impossibile effettuare il login. Si prega di riprovare più tardi ",
				type:"error"
			}).show();
			hideLoading({domContainer:$("#containerLogin")}); 
		});
	}

	function showLoading(options){
		var opt = options || {},
		$containerLoading = $("<div class='containerLoading'>"),
		$containerMask = $("<div class='containerMask'>"),
		$loadLogo = $("<div class='loaderLogo'>");
		$(opt.domContainer).append($containerMask.append($containerLoading.append($loadLogo)));
	};

	function hideLoading(options){
		var opt = options || {};
		$(opt.domContainer.find(".containerMask")[0]).remove();
	};

	function getAlert(options){
		var opt = options || {},
		classAlert = "alert-info";
		switch (opt.type) {
			case "error": classAlert="alert-danger"; break;
			case "success": classAlert="alert-success"; break;
			case "info": classAlert="alert-info"; break;
			case "warning": classAlert="alert-warning"; break;
		}
		var $alertBox = $("<div class='alert "+classAlert+" alert-dismissible'></div>")
		.append($("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>"))
		.append($("<span>"+opt.msg+"</span>"));
		$("#container_body_application_alert").prepend($alertBox);
		return {
			show:function(){
				$alertBox.fadeTo(5000, 500).slideUp(500, function(){
					$alertBox.slideUp(5000);
				});

			}
		}

	}
	
})
