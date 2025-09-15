mainApp.factory('serviceNote', function (domTree, $window, bundleRequest,httpFactory) {
	var
		http 				= httpFactory,
		req					= bundleRequest;
		dom					= domTree;
		TOKEN				= "token";
		USERNAME			= "username";
	

	function initEditor(options){
		quill = new Quill('#editor-container', {
			theme: 'snow',
			modules: {
				toolbar: '#toolbar'
			}
		});
	}

	function getAllUsers(options){
			var opt = options || {}
			var checkAuthPromise = http.ajaxCall({
				method		: "POST",
				url			: req.getAllUsers,
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
				users = response["result"]
				dom.listUsers.empty()
				$.each(users, function(index, user) {
					var $userContainer = $("<div>", {class:'form-check form-switch'});
					var $label = $("<label>", {class:"form-check-label"}).html(user["username"]);
					var $checkBox = $('<input>', {type: 'checkbox',value: '1',class: 'form-check-input', role: 'switch'}).attr("idUser", user["id"]);
					$userContainer.append($checkBox).append($label);
					dom.listUsers.append($userContainer);
				});
				return response;
				
			});
			checkAuthPromise.error(function(){});
		}
	// function movePostit(options){

	// 	var $box = $("#box");
	// 	var offsetX = 0, offsetY = 0;
	// 	var dragging = false;
	  
	// 	$box.on("mousedown", function(e) {
	// 	  dragging = true;
	// 	  offsetX = e.clientX - $box.position().left;
	// 	  offsetY = e.clientY - $box.position().top;
	// 	  e.preventDefault(); // evita selezione testo
	// 	});
	  
	// 	$(document).on("mousemove", function(e) {
	// 	  if (dragging) {
	// 		$box.css({
	// 		  left: (e.clientX - offsetX) + "px",
	// 		  top:  (e.clientY - offsetY) + "px"
	// 		});
	// 	  }
	// 	});
	  
	// 	$(document).on("mouseup", function() {
	// 	  dragging = false;
	// 	});

	// }
	function getMaxZindex($elements) {
		return Math.max.apply(null, $elements.map(function() {
			return parseInt($(this).css("z-index")) || 0;
		}).get());
	}

	function getCenterDiv($container, $postitBox) {
		var 
			offset 			= $container.offset(),
			widthContainer  = $container.outerWidth(),
			heightContainer = $container.outerHeight(),

			widthPostit  = $postitBox.outerWidth(),
			heightPostit = $postitBox.outerHeight();
	  
		// return {
		//   x: (offset.left + widthContainer / 2) - (widthPostit/2),
		//   y: (offset.top  + heightContainer / 2) (heightPostit/2)
		// };

		return {
			x: (offset.left + widthContainer / 2) - (250/2),
			y: (offset.top  + heightContainer / 2) - (240/2)
		  };

	  }

	return {
		editorNote : function(options){
			
		},
		getAllNote : function(options){
			var opt = options || {}
			var checkAuthPromise = http.ajaxCall({
				method		: "GET",
				url			: req.getAllNotes,
				// async		: false, 
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
				notes = response["result"]
				dom.containerCardNote.empty();
				dom.containerNotePostit.empty()
				var
					maxR	= 400,
					step	= 60,
					angleStep = Math.PI / 6; 

				$.each(notes, function(index, nota) {
	
					typeOwner = nota.isOwner == 1 ? "Propetario": "Condiviso";
	
					cardHeader = $('<div>',  {class:"post-it-header"})
					cardHeader.append("Nota " +nota.idNota +" del "+ nota.dataLastModify).css({"font-size":"12px"})
					cardHeader.append($('<br/>'))
					// cardHeader.append($("<span>").addClass("me-3").html("Nota "+nota.idNota));

					var 
						angle 	= index * angleStep + (Math.random() * (Math.PI / 6) - Math.PI / 12);
						radius 	= Math.min(index * step + (Math.random() * 40 - 20), maxR);
						offsetX = Math.round(radius * Math.cos(angle));
						offsetY = Math.round(radius * Math.sin(angle));

					if(nota.isOwner == 1){
						cardHeader.append($('<i class="fa-solid fa-pen-to-square me-2 cursor-pointer"></i>').on("click", function(){
							dom.idNotaModify.html(nota.idNota);
							dom.exampleModalLongTitle.html("Modifica Nota ");
							// dom.editorContainer.html(nota.note);
							$(".ql-editor").html(nota.note);
							dom.tagsText.val(nota.tags);
							dom.salvaNotaButton.addClass("d-none");
							dom.modificaNotaButton.removeClass("d-none");
							dom.nuovaNotaModal.modal("show");
						}));
						cardHeader.append($('<i class="fa-solid fa-share-from-square me-2 cursor-pointer"></i>').on("click", function(){
							dom.idNotaShared.html(nota.idNota);
							getAllUsers({token:$window.sessionStorage.getItem(TOKEN)})
							dom.shareNotaModal.modal("show");
						}));
						cardHeader.append($('<i class="fa-solid fa-trash-can cursor-pointer"></i>').attr("idNota", nota.idNota).on("click", function(){
							console.log($(this).attr("idNota"));
							dom.idNotaDel.html(nota.idNota);
							dom.deleteNotaModal.modal("show");
						}));
					}//else cardHeader.append("Nota "+nota.idNota)
					
					// cardNotaBody = $('<div>', {class: 'card-body'}).css({'height': '150px','overflow': 'auto'});
					// cardNotaBody.append(nota.note);
	
					// cardNota = $('<div>', {class: 'card'});
					// cardNota.append(cardHeader);
					// cardNota.append(cardNotaBody);
	
					// cardNotaMain = $('<div>', {class: 'col-md-3 col-lg-2'});
					// cardNotaMain.append(cardNota);
					// cardNotaMain.attr('tags', nota.tags).attr('idNota', nota.idNota);
	
					// dom.containerCardNote.append(cardNotaMain).addClass("d-none");
					// offsetpositionR  = Math.floor(Math.random() * 600) - 450;
					postit = $('<div>', {class: 'post-it'})
									.css({
											"z-index"	: index,
											"top"		: "calc(40% + " + offsetY + "px)",
											"left"		: "calc(50% + " + offsetX + "px)"
										})
									.attr('tags', nota.tags)
									.attr('idNota', nota.idNota)
									.append(cardHeader);
					// postit.draggable().resizable();
					bodyPostit = $('<div>', {class: 'body-post-it'}).append(nota.note);
					// bodyPostit = $('<div>', {class: 'body-post-it'}).append($(nota.note).clone());
					dom.containerNotePostit.append(postit.append(bodyPostit));
	
				});

				var $currentBox = null;
				var offsetX = 0, offsetY = 0;

				$(".post-it").on("mousedown", function(e) {
					$currentBox = $(this);

					maxZindex = getMaxZindex($(".post-it"));
					maxZindex++;
					$currentBox.css("z-index", maxZindex);

					offsetX = e.clientX - $currentBox.position().left;
					offsetY = e.clientY - $currentBox.position().top;
					e.preventDefault();

					$(document).on("mousemove.drag", function(e) {
					if ($currentBox) {
						$currentBox.css({
								left: (e.clientX - offsetX) + "px",
								top:  (e.clientY - offsetY) + "px"
							});
						}
					});

					$(document).on("mouseup.drag", function() {
						$currentBox = null;
						$(document).off(".drag"); 
					});
				});

			});
			checkAuthPromise.error(function(){});
		}
	}
		

})
