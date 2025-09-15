mainApp.controller('consumiController', function ($scope, boundle, bundleRequest, $window, utilitiesFactory, httpFactory) {
	var
		http 				= httpFactory,
		bIta 				= boundle.ita,
		utils 				= utilitiesFactory,
		req					= bundleRequest;

	$scope.dataModel = bIta;
	$scope.titleCard = ""
	
	$('#toggleBroker').bootstrapToggle({
		on: 'Acceso',
		off: 'Spento'
	});


	$('#toggleBroker').change(function() {
		if($(this).prop('checked')){
			startStopBroker({request:req.startBroker});
			// getMessage4Log({});
		}else{
			startStopBroker({request:req.stopBroker});
		}
	})

	$tableBarcode = $("#containerBarcode").DataTable({
		"order"			: [[0, "asc"]],
		"scrollX"		: true,
		"language"		: bIta.itaDatatable,
		"lengthMenu"	: [[5, 10], [5, 10]]
	}).search("");

	$scope.init = function(){
		// renderChart({topic:"cyclestop", idDom:"containerChartCyclestop", valueData:["c"], typeChart:"area"})
		// renderChart({topic:"cyclestart", idDom:"containerChartCyclestart", valueData:["c"], typeChart:"column"})
		// renderChart({topic:"trim", idDom:"containerChartTrim", valueData:["c", "f", "t", "np"], typeChart:"line"})
		// renderTable({topic:"barcode", idDomBody:"containerBarcodeBody"})
	}
	$scope.startBroker = function(){startBroker({})}
	
	function renderChart(options){
		var renderChartPromise = http.ajaxCall({
			method	: "POST",
			url		: req.getMessage,
			headers	: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'apyKey':'1D4786FE7FE7389114D3DC49253D2'
			},
			data	: {
				topic:options.topic
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		
		renderChartPromise.success(function(response){
			console.log(response);
			items = response.items
			series = []
			dataValue = options.valueData
			for (v in dataValue){
				serieData = {
					"data":[],
					"name": "",
				}
				for (item in items){
					serieData["data"].push(parseInt(items[item].payload[dataValue[v]]));
					serieData["name"] = [dataValue[v]];
				}
				series.push(serieData)
			}
			$scope.titleCard = items[0].topic
			new Highcharts.chart(options.idDom, {
				chart		: {type: options.typeChart, defaultSeriesType: 'areaspline'},
				showInLegend: false,
				title		: "",
				subtitle	: "",
				credits		: {enabled: false},
				series: series
			});
		});
		renderChartPromise.error(function(response){
			
		});
	}

	function renderTable(options){
		var renderTablePromise = http.ajaxCall({
			method	: "POST",
			url		: req.getMessage,
			headers	: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'apyKey':'1D4786FE7FE7389114D3DC49253D2'
			},
			data	: {
				topic:options.topic
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		
		renderTablePromise.success(function(response){
			items = response.items
			serieData = {
				"data":[],
				"name": options.topic,
			}
			$scope.titleCard = items[0].topic
			var tBody = $("#"+options.idDomBody);
			$tableBarcode.clear();
			for (item in items){
				// console.log(items[item])
				$tr = $("<tr>");
				$tr.append($("<td>").html(items[item].gateway));
				$tr.append($("<td>").html(items[item].cps));
				$tr.append($("<td>").html(items[item].payload));
				$tr.append($("<td>").html(items[item].dateNow));
				$tableBarcode.row.add($tr);
			}
			$tableBarcode.draw();
		});
		renderTablePromise.error(function(response){
			
		});
	}


	function getMessage4Log(options){
		var getMessagePromise = http.ajaxCall({
			method	: "POST",
			url		: req.getMessage,
			headers	: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'apyKey':'1D4786FE7FE7389114D3DC49253D2'
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		
		getMessagePromise.success(function(response){
			items = response.items
			$("#logMessage").empty()
			for(log in items.reverse() ){
				$labelLog = $("<div>").html(items[log].dateNow+" "+items[log].gateway+" "+items[log].cps+" "+items[log].topic);
				$("#logMessage").prepend($labelLog);
			}
		});
		getMessagePromise.error(function(response){
			
		});
	}

	function startStopBroker(options){

		opt = options || {};

		var startStopBrokerPromise = http.ajaxCall({
			method	: "POST",
			url		: opt.request,
			headers	: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'apyKey':'1D4786FE7FE7389114D3DC49253D2'
			},
			data	: {},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		});
		
		startStopBrokerPromise.success(function(response){
			console.log(response);
			
		});
		startStopBrokerPromise.error(function(response){
			
		});
	}


})
