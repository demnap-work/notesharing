mainApp.factory('bundleRequest', function() {
	var 
		url 		= "http://172.16.3.199",
		// port 		= "80",
		port 		= "9876",
		baseUrl	 	= url+":"+port+"/",
		folderImg	= "prg";
    return {
		version		: "1.6",


		baseUrl 	: baseUrl,
		urlt 		: url+"/",
		pathAssImg 	: url+"/img/",
		redirect 	: {
			dashboard	: "dashboard.html",
			login		: "login.html",
			index		: "index.html",
		},
		getListProgram 		: baseUrl+"filemultiws?dir=PRGSTORE",
		getListFileStorage	: baseUrl+"filemultiws?dir=FILESTORE",
		getListBarcode 		: baseUrl+"filemultiws?dir=BARCODE",
		getListFileCPS 		: baseUrl+"filemultiws?dir=",
		getStatoCPS 		: baseUrl+"cpsstatus",
		getUserList 		: baseUrl+"userlist",
		getListModelAttivi 	: baseUrl+"models",
		downloadFile 		: baseUrl+"download?filename=",
		deleteFilestore 	: baseUrl+"delmultiws?filename=",
		uploadModel 		: baseUrl+"updprg?prgname=",
		uploadFile 			: baseUrl+"upload?filename=",
		rebootTurnOff 		: baseUrl+"shutdown?reboot=",
		getLogCps			: "http://partec:bustyen@172.16.3.199:9876/updlog?cps="
	};
});