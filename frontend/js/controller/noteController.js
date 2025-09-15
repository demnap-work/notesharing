mainApp.controller('noteController', function ($scope,  boundle, domTree, bundleRequest, $window, utilitiesFactory, httpFactory, serviceNote) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest,
		dom					= domTree,
		quill				= null,
		TOKEN				= "token";

	$scope.dataModel = bIta;
	$scope.titleCard = ""
	
	$scope.initEditor 		= function(options){initEditor()}
	$scope.exportHTML 		= function(options){exportHTML()}
	$scope.salvaNota 		= function(options){salvaNota({
		tags : dom.tagsText.val(),
		nota : exportHTML(),
		token:$window.sessionStorage.getItem(TOKEN) 
	})}
	$scope.updateNote = function(options){updateNote({
		tags	: dom.tagsText.val(),
		idNota	: dom.idNotaModify.html(),
		nota 	: exportHTML(),
		token	: $window.sessionStorage.getItem(TOKEN) 
	})}
	$scope.deleteNota		= function(options){deleteNota({
		idNota:dom.idNotaDel.html(),
		token:$window.sessionStorage.getItem(TOKEN)
	})}
	$scope.shareNota = function(options){
		var idUsers = $(".form-check-input:checked").map(function() {
			return $(this).attr("idUser");
		}).get();
		
		shareNota({
			idNota	: dom.idNotaShared.html(),
			idUsers	: idUsers.join(","),
			token	: $window.sessionStorage.getItem(TOKEN)
		});
	}

	function shareNota(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.sharedNota,
			headers		: {
				"Content-Type"	: "application/x-www-form-urlencoded",
				"token"			: opt.token
			},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				idNota	:	opt.idNota,
				idUser	:	opt.idUsers
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
			console.log(response)
			if(response["status"]=="OK"){
				console.log(response)
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)})
				utils.alertMessage().success({
					titleMessage:"Nota condivisa con successo"
				}).show();
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile condividere la nota"
				}).show();
			}
		});
		checkAuthPromise.error(function(){
			utils.alertMessage().error({
				titleMessage:"Attenzione",
				texteMessage:"Impossibile condividere la nota"
			}).show();
		});
	}

	function deleteNota(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.removeNote,
			headers		: {
				"Content-Type"	: "application/x-www-form-urlencoded",
				"token"			: opt.token
			},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				idNota	:	opt.idNota
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
			console.log(response)
			if(response["status"]=="OK"){
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)})
				utils.alertMessage().success({
					titleMessage:"Nota eliminata con successo"
				}).show();
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile eliminare la nota"
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

	function salvaNota(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.insertNota,
			headers		: {
				"Content-Type"	: "application/x-www-form-urlencoded",
				"token"			: opt.token
			},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				nota	:	opt.nota,
				tags	:	opt.tags
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
			if(response["status"]=="OK"){
				console.log(response)
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)});
				utils.alertMessage().success({
					titleMessage:"Nota inserita con successo"
				}).show();
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile inserire la nota"
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

	function updateNote(options){
		var opt = options || {}
		var checkAuthPromise = http.ajaxCall({
			method		: "POST",
			url			: req.updateNote,
			headers		: {
				"Content-Type"	: "application/x-www-form-urlencoded",
				"token"			: opt.token
			},
			dataType	: 'json',
			crossDomain	: true,
			xhrFields	: {withCredentials: true},
			data		: {
				notaNuova	: opt.nota,
				tags		: opt.tags,
				idNota		: opt.idNota
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
			console.log(response)
			if(response["status"]=="OK"){ 
				serviceNote.getAllNote({token:$window.sessionStorage.getItem(TOKEN)});
				utils.alertMessage().success({
					titleMessage:"Nota modificata con successo"
				}).show();
			}else{
				utils.alertMessage().error({
					titleMessage:"Attenzione",
					texteMessage:"Impossibile modificare la nota"
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

	function exportHTML(options){
		var htmlNota = quill.root.innerHTML;
		console.log(htmlNota)
		return htmlNota
	}

	function initEditor(options){
		quill = new Quill('#editor-container', {
			theme: 'snow',
			modules: {
				toolbar: '#toolbar'
			}
		});
	}

})
