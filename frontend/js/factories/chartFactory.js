mainApp.factory('chartFactory', function($location) {

	var query = jQuery;

	
	return  {
		rangeChart : function(options){
			var opt = options || {};

			Highcharts.chart('container', {
			    title: {text: 'July temperatures'},
			    xAxis: {type: 'datetime'},
			    yAxis: {title: {text: null}			    },
			    tooltip: {
			        crosshairs: true,
			        shared: true,
			        valueSuffix: '°C'
			    },
			    legend: {},

			    series: [{
			        name: 'Temperature',
			        data: averages,
			        zIndex: 1,
			        marker: {
			            fillColor: 'white',
			            lineWidth: 2,
			            lineColor: Highcharts.getOptions().colors[0]
			        }
			    },
			    {
			        name: 'Range',
			        data: ranges,
			        type: 'arearange',
			        lineWidth: 0,
			        linkedTo: ':previous',
			        color: Highcharts.getOptions().colors[0],
			        fillOpacity: 0.3,
			        zIndex: 0
			    }
			    ]
			});
			
		}

	};
});