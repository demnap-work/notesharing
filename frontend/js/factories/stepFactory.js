mainApp.factory('teeFactory', function($scope, boundle, dom, bundleRequest, utilitiesFactory, $location, httpFactory) {
	var
	bIta 				= boundle.ita,
	http				= httpFactory;

//	$scope.itemTable = bIta.teeItems;
//	$scope.panelItem = bIta.panelName;

	function progressBar(options){
		var 
		opt 			= options || {},
		$progContent 	= $("<div class='progress'>");
		$progBar		= $("<div class='progress-bar' role='progressbar'>");
		varPerc			= Math.round((opt.perc * opt.resr)/opt.tot); 

		$progBar.attr("aria-valuenow",varPerc);
		$progBar.attr("aria-valuemin","0");
		$progBar.attr("aria-valuemax",opt.perc);
		$progBar.css({"width":varPerc+"%"});
		$progBar.html(varPerc+"%");
		$progContent.append($progBar);

		return $progContent; 

	};

	function findTeebyRVC(options){
		var 
		opt = options || {},
		rvc = opt.rvc || "";

		
		var findTeePromise = http.ajaxCall({
			method	: "POST", 
			url		: bundleRequest.tee.findTeebyRvc, 
			headers	: {'Content-Type': 'application/x-www-form-urlencoded'},
			data	: {rvc : rvc,},
			transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		});
		findTeePromise.success(function(response){
			console.log(response);
		});
		findTeePromise.error(function(){
			
		});
		
	};
	
	function findTeebyIdTee(options){
		var 
		opt = options || {},
		idTee = opt.idTee || "";
		
		
		var findTeePromise = http.ajaxCall({
			method	: "POST", 
			url		: bundleRequest.tee.findTeeByIdTee, 
			headers	: {'Content-Type': 'application/x-www-form-urlencoded'},
			data	: {"idTee" : idTee,},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
		});
		findTeePromise.success(function(response){
			if(response !=undefined && response.length == 1){
				$scope.detailTee 	=  response[0];
				
				
				
				getSpeeTee({perc:Math.round((100 * response[0].teeMaturati)/response[0].teeApprovati)});
			}
				
			
		});
		findTeePromise.error(function(){
			
		});
		
	}
	
	function getSpeeTee(options){
		
		var opt = options || {};
		
		var gaugeOptions = {

			    chart: {type: 'solidgauge'},
			    title: null,

			    pane: {
			        center: ['50%', '85%'],
			        size: '140%',
			        startAngle: -90,
			        endAngle: 90,
			        background: {
			            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
			            innerRadius: '60%',
			            outerRadius: '100%',
			            shape: 'arc'
			        }
			    },

			    tooltip: {
			        enabled: false
			    },

			    // the value axis
			    yAxis: {
			        lineWidth: 0,
			        minorTickInterval: null,
			        tickAmount: 2,
			        title: {
			            y: -70
			        },
			        labels: {
			            y: 16
			        }
			    },

			    plotOptions: {
			        solidgauge: {
			            dataLabels: {
			                y: 5,
			                borderWidth: 0,
			                useHTML: true
			            }
			        }
			    }
			};

			// The speed gauge
			var chartSpeed = Highcharts.chart('cwc-container-speedTee', Highcharts.merge(gaugeOptions, {
			    yAxis: {
			        min: 0,
			        max: 100,
			        title: {
			            text: ''
			        }
			    },

			    credits: {
			        enabled: false
			    },

			    series: [{
			        name: '',
			        data: [opt.perc||100],
			        dataLabels: {
			            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
			                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span>' +
			                   '<span style="font-size:25px;color:silver"> %</span></div>'
			        }
			    }]

			}));


	}

	return{
		
		getAllTee : function(options){
			
			var opt = options || {};
			
			dom.show(opt.idPanel);
			
			
			
			var 
			getAllTEEPromise = http.ajaxCall({
				method	: "GET", 
				url		: bundleRequest.tee.getAllTEE, 
				data	: {
					user : $scope.userNameInput,
					pwd  : $scope.passwordInput,
				},
			}),
			$panelConent = $("#cwc-id-tee-table-panel"),
			totApprovati	= 0,
			totMaturati		= 0;
			getAllTEEPromise.success(function(response){
				
				if(response!=undefined && response.length>0){
					for(var i =0; i<response.length; i++){
//					totApprovati += parseInt(response[i].teeApprovati.replace(".", ""));
//					totMaturati += parseInt(response[i].teeMaturati.replace(".", ""));
						
						totApprovati += Math.round(parseInt(response[i].teeApprovati));
						totMaturati += Math.round(parseInt(response[i].teeMaturati));
						var 
						$percBar = progressBar({
							perc	: 100,
							resr	: response[i].teeMaturati,
							tot		: response[i].teeApprovati
						}),
						$tdPerc 	= $("<td class='cwc-textAlign-cener'></td>"),
						$tdOpt 		= $("<td class='cwc-textAlign-cener'></td>"),
						$icoView 	= $("<div class='cwc-ico-view cwc-ico-table cwc-icon-marginRitgh' cwc-data-tee-idTee='"+response[i].idTee+"'></div>"),
						$icoModify 	= $("<div class='cwc-ico-mod cwc-ico-table cwc-icon-marginRitgh'></div>"),
//					$icoModify 	= $('<span class="glyphicon glyphicon-pencil"></span>'),
						$icoDelete 	= $("<div class='cwc-ico-del cwc-ico-table'></div>");
						
						$icoView.on("click", function(){
							
							var idTee = $(this).attr("cwc-data-tee-idTee");
//						findTeebyRVC({rvc:cosVrc});
							findTeebyIdTee({"idTee":idTee});
							$("#cwc-modal-detail-tee").modal();
						});
						
						$tdPerc.append($percBar);
						$tdOpt.append($icoView);
						$tdOpt.append($icoModify);
						$tdOpt.append($icoDelete);
						
						var $tr =$("<tr>");
//					$tr.append("<td class='cwc-textAlign-left'>"+response[i].idTee+"</td>");
						$tr.append("<td class='cwc-textAlign-left'>"+response[i].codRvc+"</td>");
						$tr.append("<td class='cwc-textAlign-left'>"+response[i].comune+"</td>");
						$tr.append("<td cwc-data-teeApprovati='"+response[i].teeApprovati+"' cwc-data-teeMaturati='"+response[i].teeMaturati+"' class='cwc-tee-approvatiMaturati cwc-textAlign-rigth'><span>"+response[i].teeApprovati+"</span><br/><span>"+response[i].teeMaturati+"</span></td>");
						$tr.append($tdPerc);
//					$tr.append("<td class='cwc-textAlign-cener'>"+response[i].dataRichiesta+"<br/>"+response[i].dataApprovazione+"</td>");
//					$tr.append("<td class='cwc-textAlign-rigth'>"+response[i].quotaSemestrale+"<br/>"+response[i].quotaTrimestrale+"</td>");
//					$tr.append("<td class='cwc-textAlign-rigth'>"+response[i].conguaglio+"</td>");
						$tr.append($tdOpt);
						$("#id-body-tee-table").append($tr);
					}
					$('#id-table-TEE').DataTable();
					var 
					$percBarTot = progressBar({
						perc	: 100,
						resr	: totMaturati,
						tot		: totApprovati
					});
					$(".cwc-tot-teeApprovati").html(totApprovati);				
					$(".cwc-tot-teeMaturati").html(totMaturati);				
					$(".cwc-tot-percTee-monitor").append($percBarTot);				
					$panelConent.find('input[type="search"]').on("input",function(){
						
						var 
						parzTotTeeAprovati = 0,
						parzTotTeeMaturati = 0,
						
						$bodyTableTee = $("#id-body-tee-table");
						var $domTee =  $bodyTableTee.find(".cwc-tee-approvatiMaturati");
						$($domTee).each(function(elem) {
							parzTotTeeAprovati += parseInt($(this).attr("cwc-data-teeApprovati").replace(".", ""));
							parzTotTeeMaturati += parseInt($(this).attr("cwc-data-teeMaturati").replace(".", ""));
							
							
						});
						var $percBarParziale = progressBar({
							perc	: 100,
							resr	: parzTotTeeMaturati,
							tot		: parzTotTeeAprovati
						});
						
						$(".cwc-tot-teeApprovati").html(parzTotTeeAprovati);				
						$(".cwc-tot-teeMaturati").html(parzTotTeeMaturati);				
						$(".cwc-tot-percTee-monitor").empty().append($percBarParziale);	
						
						if($panelConent.find('input[type="search"]').val() == undefined || $panelConent.find('input[type="search"]').val()==""){
							var 
							$percBarTot = progressBar({
								perc	: 100,
								resr	: totMaturati,
								tot		: totApprovati
							});
							$(".cwc-tot-teeApprovati").html(totApprovati);				
							$(".cwc-tot-teeMaturati").html(totMaturati);				
							$(".cwc-tot-percTee-monitor").empty().append($percBarTot);	
						}
						
					});
					
				}
			});
			getAllTEEPromise.error(function(response){
				
			});
			
		},
		getRecapTeeAppMat : function(options){
			
			var opt = options || {};
			
			dom.show(opt.idPanel);
			var 
			getRecapTeePromise = http.ajaxCall({
				method	: "GET", 
				url		: bundleRequest.tee.getRecapTee
			});

			getRecapTeePromise.success(function(response){
				var 
				totApprovati = 0,
				totMaturati	 = 0;
				if(response!=undefined){
					totApprovati = response.totTeeApprovati || 0;
					totMaturati  = response.totTeematurati || 0;
				}


				var 
				$recapSpallaSx = $("#cwc-id-tee-recapTeeppMat-panel"),
				$percBarTot 	= progressBar({
					perc		: 100,
					resr		: totMaturati,
					tot			: totApprovati
				});
				$recapSpallaSx.find(".cwc-tot-recapTeeApprovati").html(totApprovati);				
				$recapSpallaSx.find(".cwc-tot-recapTeeMaturati").html(totMaturati);				
				$recapSpallaSx.find(".cwc-tot-percTeeRecap-monitor").empty().append($percBarTot);	

			});
			getRecapTeePromise.error(function(response){

			});


		}
	};
	
	

	


});
