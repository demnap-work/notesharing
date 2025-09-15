mainApp.controller('cpsController', function ($scope, boundle, bundleRequest, $window, utilitiesFactory, httpFactory) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest;

	$scope.dataModel = bIta;
	$scope.titleCard = ""

	var $containerListFileCPS = $("#containerListFileCPS"),
	
	$tableBarcode = $("#containerStatoCPS").DataTable({
		// "order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[10, 20], [10, 20]],
		"columnDefs": [
			{ "orderable": false, "targets": 0 }
		  ]
	}).search("");

	$tableListProgrammi = $("#containerListProgrammi").DataTable({
		// "order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[10, 20], [10, 20]]
	}).search(""),

	$tableListFileCPS = $containerListFileCPS.DataTable({
		// "order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[5, 10], [5, 10]]
	}).search(""),

	$tableListFilestore = $("#containerListFilestore").DataTable({
		// "order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[5, 10], [5, 10]]
	}).search("");
	

	$tableListBarcode = $("#containerBarcode").DataTable({
		// "order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[5, 10], [5, 10]]
	}).search("");

	$("#closeModalFileCPS").on("click", function(){
		$tableListFileCPS.clear();
		$tableListFileCPS.draw();
		$('#modalFIleCPS').modal('hide');

	});
	
	
	$("#closeModalFileCPS_CROSS").on("click", function(){
		$tableListFileCPS.clear();
		$tableListFileCPS.draw();
		$('#modalFIleCPS').modal('hide');
	});

	$("#footer_listProgrammi").append($("#containerListProgrammi_info").addClass("float-left"));
	$("#footer_listProgrammi").append($("#containerListProgrammi_paginate").addClass("float-right"));
	
	$("#footer_statoCPS").append($("#containerStatoCPS_info").addClass("float-left"));
	$("#footer_statoCPS").append($("#containerStatoCPS_paginate").addClass("float-right"));

	$("#footer_listFilestore").append($("#containerListFilestore_info").addClass("float-left"));
	$("#footer_listFilestore").append($("#containerListFilestore_paginate").addClass("float-right"));

	$("#footer_listBarcode").append($("#containerBarcode_info").addClass("float-left"));
	$("#footer_listBarcode").append($("#containerBarcode_paginate").addClass("float-right"));

	$("#footer_listFilestore").hide();
	$("#footer_listBarcode").hide();

	$scope.init = function(){
		renderTableStatoCPS({idDomBody:"containerStatoCPSBody"});
		setInterval(function(){ renderTableStatoCPS({idDomBody:"containerStatoCPSBody"}) }, 30000);
		renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"});
		renderTableListFilestore({idDomBody:"containerListFilestoreBody"});
		renderTableListBarcode({idDomBody:"containerBarcodeBody"});
		$("#nomeUser").html(localStorage.getItem("username"));
		$('[data-toggle="tooltip"]').tooltip();
		$(".custom-file-input").on("change", function() {
			var fileName = $(this).val().split("\\").pop();
			$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
			$("#contentFile").attr("nomeFile", fileName);
			var files = event.target.files; 
			var output = document.getElementById("result");

			for (var i = 0; i < files.length; i++) { 
				var file = files[i]; 
				var parsedFile = new FileReader(); 
				var  $contentElem = $("#containerTabFile").find("li.active").find("a");
				if ($contentElem .attr("typeFile") === "PRGSTORE"){
					parsedFile.readAsBinaryString(file); 
				}else{
					parsedFile.readAsText(file); 
				}
				parsedFile.addEventListener("load", function(event) { 
					// if ($contentElem .attr("typeFile") === "PRGSTORE"){
					// 	var reader = new FileReader();
					// 	reader.readAsDataURL(textFile.result); 
					// 	reader.onloadend = function() {
					// 		var base64data = reader.result;                
					// 		console.log(base64data);
					// 	}
					// }else{
						var textFile = event.target; 
						localStorage.setItem("contentFile", window.btoa(textFile.result));
						$("#contentFile").html(window.btoa(textFile.result));
					// }
					hideLoading({domContainer:$("body")});
				});
 
			}
			
			
		});
		// $("#iconUploadFile").addClass("iconDisabled").addClass("cursorDefault");
		// window.alert = function(txt) {
			// 	createCustomAlert(txt);
			// }
			
		$scope.version = req.version;
	}

	$scope.adjustTableFilestore = function(){
		$("#iconUploadFile").removeClass("iconDisabled").removeClass("cursorDefault");
		$("#footer_listProgrammi").hide();
		$("#footer_listBarcode").hide();
		$("#footer_listFilestore").show();
		
		renderTableListFilestore({idDomBody:"containerListFilestoreBody"});
		showLoading({domContainer:$("#widgetListProgrammi")});
		setTimeout(function(){
			$tableListFilestore.draw();
			hideLoading({domContainer:$("#widgetListProgrammi")});
		}, 500);
	}

	$scope.adjustTableProgrammi = function(){
		$("#footer_listFilestore").hide();
		$("#footer_listBarcode").hide();
		$("#footer_listProgrammi").show();
		renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"});
		showLoading({domContainer:$("#widgetListProgrammi")});
		setTimeout(function(){
			$tableListProgrammi.draw();
			hideLoading({domContainer:$("#widgetListProgrammi")});
		}, 500);
	}

	$scope.adjustTableBarcode = function(){
		$("#iconUploadFile").removeClass("iconDisabled").removeClass("cursorDefault");
		$("#footer_listFilestore").hide();
		$("#footer_listProgrammi").hide();
		$("#footer_listBarcode").show();
		renderTableListBarcode({idDomBody:"containerBarcodeBody"});
		showLoading({domContainer:$("#widgetListProgrammi")});
		setTimeout(function(){
			$tableListBarcode.draw();
			hideLoading({domContainer:$("#widgetListProgrammi")});
		}, 500);
	}

	$scope.refresh = function(widget){
		switch (widget) {
			case "cps":renderTableStatoCPS({idDomBody:"containerStatoCPSBody"});break;
			case "programmi":
				renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"});
				renderTableListFilestore({idDomBody:"containerListFilestoreBody"});
				renderTableListBarcode({idDomBody:"containerBarcodeBody"});
			break;
			default: break;
		}
	}

	$scope.deleteFilestore = function(){
		deleteFilestore({
			fileName:$("#nomeFileDelete").html(),
			typeFile : $("#modalAlertDeleteModel").attr("typeFile")
		})
	}

	$scope.uploadModel = function(model){
		model = $("#nomeModelloUpload").html();
		uploadModel({modelName:model});
	}

	$scope.redirectLogin = function(){
		$window.location.href = req.redirect.index;
	}

	$scope.uploadFile = function(){
		var  $contentElem = $("#containerTabFile").find("li.active").find("a");

		// if ($contentElem .attr("typeFile") != "PRGSTORE"){
			$("#typeFileTitle").html($contentElem.html());
			$("#contentFile").attr("typeFile",$contentElem .attr("typeFile"));
			$(".custom-file-input").val("");
			$("#modalUploadFilel").modal();
		// }

	}

	$scope.caricaFile = function(){
		var $datiFile = $("#contentFile");
		// upoadFile({
		// 	nomeFile:$datiFile.attr("nomeFile"),
		// 	typeFile:$datiFile.attr("typeFile"),
		// 	// contentFile:$datiFile.html()
		// 	contentFile:localStorage.getItem("contentFile")
		// });

		uploadFileMultiPart({
			// file:
			nomeFile:$datiFile.attr("nomeFile"),
			typeFile:$datiFile.attr("typeFile"),
			contentFile:localStorage.getItem("contentFile")
		});

	}

	$scope.logout = function(){
		localStorage.setItem("loginOk", "");
		localStorage.setItem("credential", "");
		localStorage.setItem("username", "");
		localStorage.clear();
		$window.location.href = req.redirect.index;
	}


	$scope.rebootTurnOff = function(value){
		$("#rebootTurnOffTitle").html(value);
		$("#modalAlertReboot").modal();
		
	}

	$scope.executeTurnOff = function(){
		var value = $("#rebootTurnOffTitle").html();
		rebootTurnOff({
			value : (value==="riavviare"?1:0),
			title : value
		});
	}

	function rebootTurnOff(options){
		var opt = options || {};
		var rebootTurnOffPromise = http.ajaxCall({
			method	: "GET",
			url		: req.rebootTurnOff+opt.value,
			headers	: {
				'Authorization': localStorage.getItem("credential"),
				'Content-Type': 'application/octet-stream',
			}
		});
		showLoading({domContainer:$("body")});
		rebootTurnOffPromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){
			}else{
				getAlert({
					msg:"Errore, impossibile  " +opt.title + " la macchina.",
					type:"error"
				}).show();
			}
			$("#modalAlertReboot").modal("hide");
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("body")});
			$window.location.href = req.redirect.index;
		});
		rebootTurnOffPromise.error(function(response){
			getAlert({
				msg:"Errore, si prega di riprovare più tardi",
				type:"error"
			}).show();
			$("#modalAlertReboot").modal("hide");
			hideLoading({domContainer:$("body")});
		});
	}

	function upoadFile(options){
		var opt = options || {};
		var upoadFilePromise = http.ajaxCall({
			method	: "POST",
			url		: req.uploadFile+opt.typeFile+"/"+opt.nomeFile,
			headers	: {
				'Authorization': localStorage.getItem("credential")
				// 'Content-Type': 'application/octet-stream',
			},
			data : opt.contentFile,
			// dataType: "text",
			// "processData": false,
			// transformRequest: function(obj) {
			// 	var str = [];
			// 	for(var p in obj)
			// 		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			// 	return str.join("&");
			// }
		});
		showLoading({domContainer:$("body")});
		upoadFilePromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){



				switch (opt.typeFile) {
					case "PRGSTORE": renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"}); break;
					case "FILESTORE": renderTableListFilestore({idDomBody:"containerListFilestoreBody"});break;
					case "BARSTORE": renderTableListBarcode({idDomBody:"containerBarcodeBody"}); break;
				}
				hideLoading({domContainer:$("body")});
			}else{
				getAlert({
					msg:"Errore nel caricamento del file " +opt.nomeFile,
					type:"error"
				}).show();
			}
			$("#modalUploadFilel").modal("hide");
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("body")});
			localStorage.setItem("contentFile", "");
		});
		upoadFilePromise.error(function(response){
			hideLoading({domContainer:$("body")});
		});
	}

	function renderTableStatoCPS(options){
		var renderTablePromise = http.ajaxCall({
			method	: "GET",
			url		: req.getStatoCPS,
			headers	: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#cardRecapNumCPS")});
		// showLoading({domContainer:$("#cardRecapNumCPSDisp")});
		showLoading({domContainer:$("#cardRecapNumIstanze")});
		showLoading({domContainer:$("#widgetStatoCPS")});
		renderTablePromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){
				delete response["RC"]
				$tableBarcode.clear();
				var numCPS = 0,
					numCPSATT = 0,
					numCPSnoATT = 0
					numIstanze_recap = 0;


				for (item in response){
					var 
						istanze = response[item].istanze,
						allRed = false,
						stato = "",
						dataTick = getFormatDate(new Date(response[item].lasttick)),
						$tr = $("<tr>");

					for (ist in istanze){
						var
							nowSecond = new Date().getTime(),
							secondCps = new Date(istanze[ist].lasttick*1000).getTime(),
							diff = Math.abs(nowSecond - secondCps) / 1000;
						allRed = (diff>120 )?true:false
						stato=(diff<=120 )?"G":"Y";	
					}
					response[item]["statoIstanze"]=(allRed?"R":stato);

					numCPS ++;
					$tr.append($("<td>").html(response[item].IP));
					
					var $linkModalFIleCPS = $("<div cps='"+item+"'></div>").html(item)
					if (response[item].FS != 0){
						$linkModalFIleCPS = $("<div cps='"+item+"' class='linkCPS'></div>").html(item).on("click", function(){
							getListFileCPS({cps:$(this).attr("cps")});
						});
					}
					$tr.append($("<td>").append($linkModalFIleCPS));
					
					if (response[item].FS === 0){
						$tr.append($("<td>").html("<img width='16' src='"+req.pathAssImg+"cross.png'>"));
						numCPSnoATT++;
					}else{
						$tr.append($("<td>").html("<img width='20' src='"+req.pathAssImg+"check.png'>"));
						numCPSATT++;
					}

					$tr.append($("<td>").html(dataTick));
					var $istanzaContainer = $("<span class='label label-default dotBadge'>");
					var numIstanze=0;
					for(istanza in response[item].istanze){
						numIstanze_recap++;
						numIstanze++;
					}
					var $openIstance = $("<img nomeCps='"+item+"' data='"+JSON.stringify(response[item].istanze)+"' width='20' class='cursorPointer marginLeft10px' src='"+req.pathAssImg+"open.png'>");
					
					$openIstance.off().on("click", function(){
						$("#titleListIstanzeModal").html($(this).attr("nomeCps"));
						var dataIstanze = JSON.parse($(this).attr("data"));
						var $istanzaContainerCPS = $("<span></span>");
						var groupIstanzaCPS = "";
						for(istanza in dataIstanze){
							var istanzaDiv = "<b>istanza </b>"+istanza+"<br/>";
							for (elem in dataIstanze[istanza]){
								if(elem === "lasttick"){
									istanzaDiv+="<b>"+elem+" </b>"+getFormatDate(new Date(dataIstanze[istanza][elem]))+"<br/>";
								}else{
									istanzaDiv+="<b>"+elem+" </b>"+dataIstanze[istanza][elem]+"<br/>";
								}
							}
							groupIstanzaCPS+=istanzaDiv+"<br/>";
							$istanzaContainerCPS.html(groupIstanzaCPS);
						}
						$("#containerIstanzeCPS").empty().append($istanzaContainerCPS)
						$("#modalLIstaIstanze").modal();
					});

					$istanzaContainer.html(numIstanze)
					$tr.append($("<td>").append($openIstance).append($istanzaContainer));

					var 
						$semaforo = $("<div class='semaforo'></div>"),
						stato = response[item]["statoIstanze"];
					$semaforo.addClass((stato=="G"?"bgGreen":(stato=="R"?"bgRed":"bgYellow")));

					$tr.append($("<td class='text-center'>").append($semaforo));
					$tableBarcode.row.add($tr);
				}

				$("#numeoCPS_recap").html(numCPS);
				$("#numeoIstanze_recap").html(numIstanze_recap);
				
				$tableBarcode.draw();
			}else if( response["RC"] == "9"){
				$("#modalRedirect").modal();
			}else{
				getAlert({
					msg:"Errore nel recupero dello stato dei CPS",
					type:"error"
				}).show();
			}
			hideLoading({domContainer:$("#cardRecapNumCPS")});
			// hideLoading({domContainer:$("#cardRecapNumCPSDisp")});
			hideLoading({domContainer:$("#cardRecapNumIstanze")});
			hideLoading({domContainer:$("#widgetStatoCPS")});
		});
		renderTablePromise.error(function(response){
			getAlert({
				msg:"Errore nel recupero dello stato dei CPS",
				type:"error"
			}).show();
			$("#numeoCPS_recap").html("0");
			// $("#fsdisp_recap").html("0");
			// $("#fsNodisp_recap").html("0");
			$("#numeoIstanze_recap").html("0");
			hideLoading({domContainer:$("#cardRecapNumCPS")});
			// hideLoading({domContainer:$("#cardRecapNumCPSDisp")});
			hideLoading({domContainer:$("#cardRecapNumIstanze")});
			hideLoading({domContainer:$("#widgetStatoCPS")});
		});
	}

	function renderTableListProgrammiAttivi(options){
		var renderTableListProgrammiPromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListModelAttivi,
			headers	: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#cardRecapNumProgrammi")});
		showLoading({domContainer:$("#widgetListProgrammi")});
		renderTableListProgrammiPromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){
				delete response["RC"];
				var newObjModel = {};
				for(item in response){
					newObjModel[response[item]]=item
				}

				renderTableListProgrammi({modelAttivi:newObjModel})
			}else{
				getAlert({
					msg:"Errore nel recupero dei programmi attivi ",
					type:"error"
				}).show();
				hideLoading({domContainer:$("#cardRecapNumProgrammi")});
				hideLoading({domContainer:$("#widgetListProgrammi")});
			}
		});
		renderTableListProgrammiPromise.error(function(response){
			getAlert({
				msg:"Errore nel recupero dei programmi attivi ",
				type:"error"
			}).show();
			hideLoading({domContainer:$("#cardRecapNumProgrammi")});
			hideLoading({domContainer:$("#widgetListProgrammi")});
		});
	}

	function downloadFile(options){
		var opt = options || {};
		var downloadFilePromise = http.ajaxCall({
			method	: "GET",
			url		: req.downloadFile+opt.pathFile,
			headers	: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("body")});
		downloadFilePromise.success(function(response){
            // if (window.navigator.msSaveOrOpenBlob) {
			// 	$("#downlaodFileLink").attr("download", response.filename.split("/")[1]).attr("href", req.baseUrl+response.filename).html("clicca qui per scaricare "+response.filename);
			// 	$("#modalDownloadFile").modal();
			// 	// window.open(req.baseUrl+response.filename);
            // }else {
			// 	window.open(req.baseUrl+response.filename);
			// 	// simulateDownload(req.baseUrl+response.filename, response.filename);
            // }
			window.open(req.baseUrl+response.filename);
			hideLoading({domContainer:$("body")});
		});
		downloadFilePromise.error(function(response){
			getAlert({
				msg:"Impossibile scaricare il file "+opt.pathFile,
				type:"error"
			}).show();
			hideLoading({domContainer:$("#widgetListProgrammi")});
		});
	}

	function uploadModel(options){
		var opt = options || {};
		var uploadModelPromise = http.ajaxCall({
			method	: "GET",
			url		: req.uploadModel+opt.modelName,
			headers	: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("body")});
		uploadModelPromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){

			}else{
				getAlert({
					msg:"Errore nel caricamento del programma "+opt.modelName,
					type:"error"
				}).show();
			}

			$('#modalAlertUploadModel').modal('hide');
			hideLoading({domContainer:$("body")});
		});
		uploadModelPromise.error(function(response){
			getAlert({
				msg:"Errore nel caricamento del programma "+opt.modelName,
				type:"error"
			}).show();
			$('#modalAlertUploadModel').modal('hide');
			hideLoading({domContainer:$("body")});
		});
	}

	function renderTableListProgrammi(options){
		var opt = options || {};
		var renderTableListProgrammiPromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListProgram,
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		
		renderTableListProgrammiPromise.success(function(response){
			if (response["RC"] == "0" || response["RC"] == 0){
				delete response["RC"]
				$tableListProgrammi.clear();
				var numeoProgrammi = 0;
				for (elem in response){
					numeoProgrammi++;
					fileProgram = response[elem];
					$tr = $("<tr>");
					var $divOper = $("<div></div>");
					var $delFile = $("<img nomeFile='"+fileProgram[0]+"' class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>").on("click", function(){
						$("#nomeFileDelete").html($(this).attr("nomeFile"));
						$("#modalAlertDeleteModel").attr("typeFile", "PRGSTORE");
						$("#modalAlertDeleteModel").modal();
					});
					var $modelloAttivo = $("<img width='20' programma='"+fileProgram[0]+"' nomeModello='"+fileProgram[5]+"' src='' width='20' class='cursorPointer marginLeft10px'></img>")
					if (opt.modelAttivi[fileProgram[5]]!=undefined){
						$modelloAttivo.attr("src", ""+req.pathAssImg+"upload.png").on("click", function(){
							$("#programmaUploadName").html($(this).attr("programma"));
							$("#nomeModelloUpload").html($(this).attr("nomeModello"));
							$("#modalAlertUploadModel").modal();
						});
					}else{
						$modelloAttivo.attr("src", ""+req.pathAssImg+"cross.png");
						$modelloAttivo.attr("width", "16");
					}

					var $fileDowbload = $("<img width='20' path='PRGSTORE"+"/"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"files.png'>")
						.on("click", function(){
							downloadFile({
								pathFile:$(this).attr("path")
							});
					});

					$divOper.append($delFile);
					$divOper.append($modelloAttivo);
					$divOper.append($fileDowbload);

					$tr.append($("<td>").append($divOper));
					$tr.append($("<td>").html(fileProgram[0]));
					$tr.append($("<td>").html(getFormatDate(fileProgram[1])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[2])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[3])));
					$tr.append($("<td>").html(fileProgram[4]));
					$tr.append($("<td>").html(fileProgram[5]));
					$tableListProgrammi.row.add($tr);
				}
				$tableListProgrammi.draw();
				$("#numeoProgrammi_recap").html(numeoProgrammi);
			}else{
				getAlert({
					msg:"Errore nel recupero della lista dei programmi",
					type:"error"
				}).show();
			}
			hideLoading({domContainer:$("#cardRecapNumProgrammi")});
			hideLoading({domContainer:$("#widgetListProgrammi")});
		});
		renderTableListProgrammiPromise.error(function(){
			getAlert({
				msg:"Errore nel recupero della lista dei programmi",
				type:"error"
			}).show();
			$("#numeoProgrammi_recap").html("0");
			hideLoading({domContainer:$("#cardRecapNumProgrammi")});
			hideLoading({domContainer:$("#widgetListProgrammi")});
		});
	}





	function renderTableListFilestore(options){
		var opt = options || {};
		var renderTableListFilestorePromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListFileStorage,
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#widgetListProgrammi")});
		showLoading({domContainer:$("#cardRecapNumFilestore")});
		renderTableListFilestorePromise.success(function(response){
			if (response["RC"] == "0" || response["RC"] == 0){
				delete response["RC"]
				
				$tableListFilestore.clear();
				var numeroFilestore = 0;
				for (elem in response){
					numeroFilestore++;
					fileProgram = response[elem];
					$tr = $("<tr>");
					var $divOper = $("<div></div>");
					var $delFile = $("<img nomeFile='"+fileProgram[0]+"' class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>").on("click", function(){
						$("#nomeFileDelete").html($(this).attr("nomeFile"));
						$("#modalAlertDeleteModel").attr("typeFile", "FILESTORE");
						$("#modalAlertDeleteModel").modal();
					});
					if (fileProgram[6]==="dir"){
						$divOper.append($("<img width='20' class='iconDisabled' src='"+req.pathAssImg+"trash.png'>"));
						var $fileDowbload = $("<img width='20' path='FILESTORE/"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"folder.png'>")
							.on("click", function(){
								getListFileCPS({cps:$(this).attr("path")});
								// downloadFile({
								// 	pathFile:$(this).attr("path")
								// });
						});

					}else{
						$divOper.append($delFile);
						var $fileDowbload = $("<img width='20' path='"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"folder.png'>")
							.on("click", function(){
								// getListFileCPS({cps:$(this).attr("path")});
								downloadFile({
									pathFile:$(this).attr("path")
								});
						});
					}


					$divOper.append($fileDowbload);

					$tr.append($("<td>").append($divOper));
					$tr.append($("<td>").html(fileProgram[0]));
					$tr.append($("<td>").html(getFormatDate(fileProgram[1])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[2])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[3])));
					$tr.append($("<td>").html(fileProgram[4]));
					$tr.append($("<td>").html(fileProgram[5]));
					$tableListFilestore.row.add($tr);
				}
				$tableListFilestore.draw();
				// $("#numeoFilestore_recap").html(numeroFilestore);
			}else{
				getAlert({
					msg:"Errore nel recupero della lista dei dati macchina",
					type:"error"
				}).show();
			}
			hideLoading({domContainer:$("#widgetListProgrammi")});
			hideLoading({domContainer:$("#cardRecapNumFilestore")});
			cardRecapNumFilestore
		});
		renderTableListFilestorePromise.error(function(){
			getAlert({
				msg:"Errore nel recupero della lista dei dati macchina",
				type:"error"
			}).show();
			$("#numeoProgrammi_recap").html("0");
			// $("#numeoFilestore_recap").html("0");
			$("#numeoBarcode_recap").html("0");
			hideLoading({domContainer:$("#widgetListProgrammi")});
			hideLoading({domContainer:$("#cardRecapNumFilestore")});
		});
	}




	function renderTableListBarcode(options){
		var opt = options || {};
		var renderTableListBarcodePromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListBarcode,
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#widgetListProgrammi")});
		showLoading({domContainer:$("#cardRecapNumFilestore")});
		renderTableListBarcodePromise.success(function(response){
			if (response["RC"] == "0" || response["RC"]==0){
				delete response["RC"]
				
				$tableListBarcode.clear();
				var numeroFilestore = 0;
				for (elem in response){
					numeroFilestore++;
					fileProgram = response[elem];
					$tr = $("<tr>");
					var $divOper = $("<div></div>");
					var $delFile = $("<img nomeFile='"+fileProgram[0]+"' class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>").on("click", function(){
						$("#nomeFileDelete").html($(this).attr("nomeFile"));
						$("#modalAlertDeleteModel").attr("typeFile", "BARCODE");
						$("#modalAlertDeleteModel").modal();
					});
					var $fileDowbload = $("<img width='20' path='BARCODE"+"/"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"files.png'>")
						.on("click", function(){
							downloadFile({
								pathFile:$(this).attr("path")
							});
					});

					$divOper.append($delFile);
					$divOper.append($fileDowbload);

					$tr.append($("<td>").append($divOper));
					$tr.append($("<td>").html(fileProgram[0]));
					$tr.append($("<td>").html(getFormatDate(fileProgram[1])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[2])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[3])));
					$tr.append($("<td>").html(fileProgram[4]));
					$tr.append($("<td>").html(fileProgram[5]));
					$tableListBarcode.row.add($tr);
				}
				$tableListBarcode.draw();
				$("#numeoBarcode_recap").html(numeroFilestore);
			}else{
				getAlert({
					msg:"Errore nel recupero della lista dei barcode",
					type:"error"
				}).show();
			}
			hideLoading({domContainer:$("#widgetListProgrammi")});
			hideLoading({domContainer:$("#cardRecapNumFilestore")});
			cardRecapNumFilestore
		});
		renderTableListBarcodePromise.error(function(){
			getAlert({
				msg:"Errore nel recupero della lista dei barcode",
				type:"error"
			}).show();
			$("#numeoProgrammi_recap").html("0");
			// $("#numeoFilestore_recap").html("0");
			$("#numeoBarcode_recap").html("0");
			hideLoading({domContainer:$("#widgetListProgrammi")});
			hideLoading({domContainer:$("#cardRecapNumFilestore")});
		});
	}


	function deleteFilestore(options){
		var opt = options || {};
		var deleteFilestorePromise = http.ajaxCall({
			method	: "GET",
			url		: req.deleteFilestore+opt.fileName,
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			data : {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("body")});
		deleteFilestorePromise.success(function(response){
			if(response["RC"]=="0" || response["RC"]==0){
				switch (opt.typeFile) {
					case "PRGSTORE": renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"}); break;
					case "FILESTORE": renderTableListFilestore({idDomBody:"containerListFilestoreBody"});break;
					case "BARSTORE": renderTableListBarcode({idDomBody:"containerBarcodeBody"}); break;
				}
				hideLoading({domContainer:$("body")});
			}else{
				getAlert({
					msg:"Impossibile eliminare il file "+opt.fileName,
					type:"error"
				}).show();
			}
			$('#modalAlertDeleteModel').modal('hide');
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("body")});
			renderTableListFilestore({idDomBody:"containerListFilestoreBody"});
		});
		deleteFilestorePromise.error(function(){
			getAlert({
				msg:"Impossibile eliminare il file "+opt.fileName,
				type:"error"
			}).show();
			$('#modalAlertDeleteModel').modal('hide');
			hideLoading({domContainer:$("body")});
		});
	}

	function getListFileCPS(options){
		var opt = options || {};
		var getListFileCPSPromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListFileCPS+opt.cps+(opt.dir!= undefined?"/"+opt.dir:""),
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("body")});
		showLoading({domContainer:$("#modalConainerFIleCPS")});
		getListFileCPSPromise.success(function(response){
			$("#modalFIleCPS").modal({
				backdrop: 'static',
				keyboard: false
			}).off().on('shown.bs.modal', function () {
				$tableListFileCPS.clear();
				$tableListFileCPS.draw();

				var $linkCpaFile=$("<small class='linkCPS'></small>").html(opt.cps).on("click", function(){
					getListFileCPSDIR({cps:opt.cps});
				});

				$("#titleCPSModal").empty().append($linkCpaFile);

				if (response["RC"] == "0" || response["RC"] == 0){
					delete response["RC"]
					if (response["errtxt"] != undefined)
						delete response["errtxt"]
					

					for (elem in response){
						fileProgram = response[elem];
						$tr = $("<tr>");
						var $delFile = $("<img nomeFile='"+fileProgram[0]+"' class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>").on("click", function(){
							$("#nomeFileDelete").html($(this).attr("nomeFile"));
							$('#modalFIleCPS').modal('hide');
							$("#modalAlertDeleteModel").attr("typeFile", "CPS");
							$("#modalAlertDeleteModel").modal();
						});

						var $divOper = $("<div></div>");
						if (fileProgram[6]==="dir"){
							$divOper.append($("<img width='20' class='iconDisabled' src='"+req.pathAssImg+"trash.png'>"));
							var $folder = $("<img dir='"+fileProgram[0]+"' class='cursorPointer marginLeft10px' width='20' src='"+req.pathAssImg+"folder.png'>");
							$folder.on("click", function(){
								getListFileCPSDIR({cps:opt.cps,dir:$(this).attr("dir")});
							});
							$divOper.append($folder);
						}else{
							$divOper.append($delFile);
							var $folder = $("<img width='20' path='"+opt.cps+(opt.dir!= undefined?"/"+opt.dir:"")+"/"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"files.png'>")
							.on("click", function(){
								downloadFile({
									pathFile:$(this).attr("path")
								});
							});
							$divOper.append($folder);
						}
						$tr.append($("<td>").append($divOper));
						$tr.append($("<td>").html(fileProgram[0]));
						$tr.append($("<td>").html(getFormatDate(fileProgram[1])));
						$tr.append($("<td>").html(getFormatDate(fileProgram[2])));
						$tr.append($("<td>").html(getFormatDate(fileProgram[3])));
						$tr.append($("<td>").html(fileProgram[4]));
						$tableListFileCPS.row.add($tr);
					}
					$tableListFileCPS.draw();
					hideLoading({domContainer:$("body")});
				}else{
					getAlert({
						msg:"Impossibile recuperare i CPS ",
						type:"error"
					}).show();
					hideLoading({domContainer:$("body")});
				}
			});
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("#modalConainerFIleCPS")});
			hideLoading({domContainer:$("#modalConainerFIleCPS")});
			
		});
		getListFileCPSPromise.error(function(response){
			getAlert({
				msg:"Impossibile recuperare i CPS ",
				type:"error"
			}).show();
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("#modalConainerFIleCPS")});
		});
	}

	function getListFileCPSDIR(options){
		var opt = options || {};
		var getListFileCPSPromise = http.ajaxCall({
			method	: "GET",
			url		: req.getListFileCPS+opt.cps+(opt.dir!= undefined?"/"+opt.dir:""),
			headers	: {
				'Authorization': localStorage.getItem("credential"),
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		showLoading({domContainer:$("#modalConainerFIleCPS")});
		getListFileCPSPromise.success(function(response){
			$tableListFileCPS.clear();
			$tableListFileCPS.draw();
			if (response["RC"] == "0" || response["RC"]==0){
				delete response["RC"]
				var $linkCpaFile=$("<small class='linkCPS'></small>").html(opt.cps).on("click", function(){
					getListFileCPSDIR({cps:opt.cps});
				});
				$("#titleCPSModal").empty().append($linkCpaFile).append($("<small></small>").html((opt.dir!=undefined?"/"+opt.dir:"")));

				for (elem in response){
					fileProgram = response[elem];
					$tr = $("<tr>");
					// var $delFile = $("<img class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>");
					var $delFile = $("<img nomeFile='"+opt.dir+"/"+fileProgram[0]+"' class='cursorPointer' width='20' src='"+req.pathAssImg+"trash.png'>").on("click", function(){
						$("#nomeFileDelete").html($(this).attr("nomeFile"));
						$('#modalFIleCPS').modal('hide');
						$("#modalAlertDeleteModel").attr("typeFile", "CPS");
						$("#modalAlertDeleteModel").modal();
					});
					var $divOper = $("<div></div>");
					if (fileProgram[6]==="dir"){
						$divOper.append($("<img width='20' class='iconDisabled' src='"+req.pathAssImg+"trash.png'>"));
						var $folder = $("<img dir='"+fileProgram[0]+"' class='cursorPointer marginLeft10px' width='20' src='"+req.pathAssImg+"folder.png'>");
						$folder.on("click", function(){
							getListFileCPSDIR({cps:opt.cps,dir:$(this).attr("dir")});
						});
						$divOper.append($folder);
					}else{
						$divOper.append($delFile);
						var $folder = $("<img width='20' path='"+opt.cps+(opt.dir!= undefined?"/"+opt.dir:"")+"/"+fileProgram[0]+"' class='marginLeft10px cursorPointer' src='"+req.pathAssImg+"files.png'>")
						.on("click", function(){
							downloadFile({
								pathFile:$(this).attr("path")
							});
						});
						$divOper.append($folder);
					}

					$tr.append($("<td>").append($divOper));
					$tr.append($("<td>").html(fileProgram[0]));
					$tr.append($("<td>").html(getFormatDate(fileProgram[1])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[2])));
					$tr.append($("<td>").html(getFormatDate(fileProgram[3])));
					$tr.append($("<td>").html(fileProgram[4]));
					$tableListFileCPS.row.add($tr);
				}
				$tableListFileCPS.draw();
				hideLoading({domContainer:$("body")});
				hideLoading({domContainer:$("#modalConainerFIleCPS")});
			}else{
				getAlert({
					msg:"Impossibile recuperare i CPS ",
					type:"error"
				}).show();
			}
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("#modalConainerFIleCPS")});
			
		});
		getListFileCPSPromise.error(function(response){
			getAlert({
				msg:"Impossibile recuperare i CPS ",
				type:"error"
			}).show();
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("#modalConainerFIleCPS")});
		});
	}

	function getFormatDate(dateInt){
		var d = new Date(1000*dateInt);
		if (dateInt == undefined){
			d = new Date();
		}
    	dformat = [
					d.getFullYear(),
					("0" + (d.getMonth() + 1)).slice(-2),
					("0" + d.getDate()).slice(-2)
				].join('-')+' '+
               [	
				   	d.getHours(),
               		d.getMinutes(),
					d.getSeconds()
					// d.getMilliseconds()
				].join(':');
		return dformat
	}

	function getFormatDateSecond(dateInt){
		d = new Date(1000*dateInt)
		return d.getSeconds();
	}

	function showLoading(options){
		var opt = options || {},
		$containerLoading = $("<div class='containerLoading'>"),
		$containerMask = $("<div class='containerMask'>"),
		$loadLogo = $("<div class='loaderLogo'>");
		var findContainerMask = $(opt.domContainer).find(".containerMask").length;
		if (findContainerMask!=undefined && findContainerMask===0)
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

	function encode( s ) {
		var out = [];
		for ( var i = 0; i < s.length; i++ ) {
			out[i] = s.charCodeAt(i);
		}
		return new Uint8Array( out );
	}

	function convertDataURIToBinary(dataURI) {
		var BASE64_MARKER = ';base64,';
		var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
		var base64 = dataURI.substring(base64Index);
		var raw = window.atob(base64);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));
	  
		for(i = 0; i < rawLength; i++) {
		  array[i] = raw.charCodeAt(i);
		}
		return array;
	}

	function uploadFileMultiPart(options){

		var opt = options || {};
		var file = document.getElementById("customFile").files[0];
		var form = new FormData();
		form.append("file", file);

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": req.uploadFile+opt.typeFile+"/"+opt.nomeFile,
			"method": "POST",
			"processData": false,
			"contentType": false,
			// "mimeType": "multipart/form-data",
			"mimeType": "form-data",
			"data": form
		};
		showLoading({domContainer:$("body")});
		$.ajax(settings).done(function (response) {
			console.log(response);
			switch (opt.typeFile) {
				case "PRGSTORE": renderTableListProgrammiAttivi({idDomBody:"containerListProgrammiSBody"}); break;
				case "FILESTORE": renderTableListFilestore({idDomBody:"containerListFilestoreBody"});break;
				case "BARSTORE": renderTableListBarcode({idDomBody:"containerBarcodeBody"}); break;
			}
			$("#modalUploadFilel").modal("hide");
			hideLoading({domContainer:$("body")});
			localStorage.setItem("contentFile", "");
			hideLoading({domContainer:$("body")});
			hideLoading({domContainer:$("body")});
		})
		.fail(function() {
			getAlert({
				msg:"Errore nel caricamento del file "+opt.nomeFile,
				type:"error"
			}).show();
			hideLoading({domContainer:$("body")});
		});



		// var opt = options || {};
		// var uploadModelPromise = http.ajaxCall({
		// 	method	: "GET",
		// 	url		: req.uploadModel+opt.modelName,
		// 	headers	: {
		// 		// 'Content-Type': 'application/x-www-form-urlencoded',
		// 		'Authorization': localStorage.getItem("credential"),
		// 	},
		// 	data	: {},
		// 	// transformRequest: function(obj) {
		// 	// 	var str = [];
		// 	// 	for(var p in obj)
		// 	// 		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		// 	// 	return str.join("&");
		// 	// }
		// });
		// showLoading({domContainer:$("body")});
		// uploadModelPromise.success(function(response){
		// 	if (response["RC"] == "0" || response["RC"]==0){

		// 	}else{
		// 		getAlert({
		// 			msg:"Errore nel caricamento del programma "+opt.modelName,
		// 			type:"error"
		// 		}).show();
		// 	}

		// 	$('#modalAlertUploadModel').modal('hide');
		// 	hideLoading({domContainer:$("body")});
		// });
		// uploadModelPromise.error(function(response){
		// 	getAlert({
		// 		msg:"Errore nel caricamento del programma "+opt.modelName,
		// 		type:"error"
		// 	}).show();
		// 	$('#modalAlertUploadModel').modal('hide');
		// 	hideLoading({domContainer:$("body")});
		// });
	}




function createCustomAlert(txt) {
    d = document;

    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}


	function saveFile(options){
		var opt = options || {};
		
		var data = window.atob(opt.text);
		console.log(typeof data);
		
		var blob = new Blob( [ data ], {
			type: 'application/octet-stream'
		});

		url = URL.createObjectURL( blob );
		var link = document.createElement( 'a' );
		link.setAttribute( 'href', url );
		link.setAttribute( 'download', opt.nomeFile );
		
		var event = document.createEvent( 'MouseEvents' );
		event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent( event );
		hideLoading({domContainer:$("body")});

	}

	function simulateDownload(uri, name) {
		var link = document.createElement("a");
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		delete link;
	  }

	BinaryReader = function (data) {
		this._buffer = data;
		this._pos = 0;
	};
	
	BinaryReader.prototype = {
		readInt8:	function (){ return this._decodeInt(8, true); },
		readUInt8:	function (){ return this._decodeInt(8, false); },
		readInt16:	function (){ return this._decodeInt(16, true); },
		readUInt16:	function (){ return this._decodeInt(16, false); },
		readInt32:	function (){ return this._decodeInt(32, true); },
		readUInt32:	function (){ return this._decodeInt(32, false); },
	
		readFloat:	function (){ return this._decodeFloat(23, 8); },
		readDouble:	function (){ return this._decodeFloat(52, 11); },
		
		readChar:	function () { return this.readString(1); },
		readString: function (length) {
			this._checkSize(length * 8);
			var result = this._buffer.substr(this._pos, length);
			this._pos += length;
			return result;
		},
	
		seek: function (pos) {
			this._pos = pos;
			this._checkSize(0);
		},
		
		getPosition: function () {
			return this._pos;
		},
		
		getSize: function () {
			return this._buffer.length;
		},
	
	
		/* Private */
		
		_decodeFloat: function(precisionBits, exponentBits){
			var length = precisionBits + exponentBits + 1;
			var size = length >> 3;
			this._checkSize(length);
	
			var bias = Math.pow(2, exponentBits - 1) - 1;
			var signal = this._readBits(precisionBits + exponentBits, 1, size);
			var exponent = this._readBits(precisionBits, exponentBits, size);
			var significand = 0;
			var divisor = 2;
			var curByte = 0; //length + (-precisionBits >> 3) - 1;
			do {
				var byteValue = this._readByte(++curByte, size);
				var startBit = precisionBits % 8 || 8;
				var mask = 1 << startBit;
				while (mask >>= 1) {
					if (byteValue & mask) {
						significand += 1 / divisor;
					}
					divisor *= 2;
				}
			} while (precisionBits -= startBit);
	
			this._pos += size;
	
			return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
				: (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
				: Math.pow(2, exponent - bias) * (1 + significand) : 0);
		},
	
		_decodeInt: function(bits, signed){
			var x = this._readBits(0, bits, bits / 8), max = Math.pow(2, bits);
			var result = signed && x >= max / 2 ? x - max : x;
	
			this._pos += bits / 8;
			return result;
		},
	
		//shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
		_shl: function (a, b){
			for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
			return a;
		},
		
		_readByte: function (i, size) {
			return this._buffer.charCodeAt(this._pos + size - i - 1) & 0xff;
		},
	
		_readBits: function (start, length, size) {
			var offsetLeft = (start + length) % 8;
			var offsetRight = start % 8;
			var curByte = size - (start >> 3) - 1;
			var lastByte = size + (-(start + length) >> 3);
			var diff = curByte - lastByte;
	
			var sum = (this._readByte(curByte, size) >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1);
	
			if (diff && offsetLeft) {
				sum += (this._readByte(lastByte++, size) & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight; 
			}
	
			while (diff) {
				sum += this._shl(this._readByte(lastByte++, size), (diff-- << 3) - offsetRight);
			}
	
			return sum;
		},
	
		_checkSize: function (neededBits) {
			if (!(this._pos + Math.ceil(neededBits / 8) < this._buffer.length)) {
				throw new Error("Index out of bound");
			}
		}
	};

})
