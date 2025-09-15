mainApp.factory('xcelToJSONFactory', function($location) {

	var X = XLSX;

	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
			result[sheetName] = roa;
		});
		return result;
	};

	return  {
		fromExcelToJSON : function(options) {

			opt = options || {};

			console.log(opt);

			var file = opt.file;
			var reader = new FileReader();
			var jsonResult = "";

//			reader.onload = function(e) {
//				var data = e.target.result;
//				var wb = X.read(data, {type : 'binary'});
//
//				var jsonResult = "";
//				jsonResult = to_json(wb);
////				console.log(jsonResult);
//				return jsonResult; 
//
//			};
			reader.onload = function(e) {
				var data = e.target.result;
				var wb = X.read(data, {type : 'binary'});
				
				jsonResult = to_json(wb);
				console.log(jsonResult);
				return jsonResult; 
				
			};
			reader.onerror = function(ex){ return "KO"; };
			reader.readAsBinaryString(file);
			
			
			
			
		}
		
		
		
		
//		fromExcelToJSON : function(options) {
//
//			opt = options || {};
//
//			console.log(opt);
//
//			var file = opt.file;
//			var reader = new FileReader();
//
//			return {
//				success : function(){
//					var jsonResult = "";
//					reader.onload = function(e) {
//						var data = e.target.result;
//						var wb = X.read(data, {type : 'binary'});
//						jsonResult = to_json(wb);
//						return jsonResult; 
//					};
//				},
//				error:function(){
//					reader.onerror=function(ex){ return "KO"; };
//				}
//			};
//			
//			reader.readAsBinaryString(file);
//		}
	};
});