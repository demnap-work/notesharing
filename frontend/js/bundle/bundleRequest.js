mainApp.factory('bundleRequest', function() {
	var 
		url 		= "http://192.168.1.14",
		port 		= "5050",
		baseUrl	 	= url+":"+port+"/api/"
    return {
		getLogin		: baseUrl+"login",
		checkTokenAlive	: baseUrl+"checkTokenAlive",
		getLogout		: baseUrl+"logout",
		addUser			: baseUrl+"addUser",
		insertNota		: baseUrl+"insertNota",
		getAllNotes		: baseUrl+"getAllNotes",
		removeNote		: baseUrl+"removeNote",
		getAllUsers		: baseUrl+"getAllUsers",
		sharedNota		: baseUrl+"sharedNota",
		updateNote		: baseUrl+"updateNote",
		
	};
});