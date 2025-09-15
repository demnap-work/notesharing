mainApp.factory('domTree', function() {
	return {
		  
		// login
		 loginForm			: $("#formLogin")
		,formRegistrazione	: $("#formRegistrazione")
		 
		// user
		,usernameText	: $("#username")
		,passwordText	: $("#password")
		,password2Text	: $("#password2")
				 
		// dashboard
		,icoUser		: $("#icoUser")
		,mainDashboard	: $("#mainDashboard")
		,cercaTagsText	: $("#cercaTagsText")
		,deleteNotaModal: $("#deleteNotaModal")
		,shareNotaModal	: $("#shareNotaModal")
		,idNotaDel		: $("#idNotaDel")
		,listUsers		: $("#listUsers")
		
		
		
		
		
		
		// note
		
		,exampleModalLongTitle	: $("#exampleModalLongTitle")
		,containerNotePostit	: $("#containerNotePostit")
		
		,editorContainer	: $("#editor-container")
		,containerCardNote	: $("#containerCardNote")
		,nuovaNotaModal		: $("#nuovaNotaModal")
		,tagsText			: $("#tags")
		,idNotaShared		: $("#idNotaShared")
		,idNotaModify		: $("#idNotaModify")
		,salvaNotaButton	: $("#salvaNotaButton")
		,modificaNotaButton	: $("#modificaNotaButton")
		// ,cardNotaMain		: $('<div>', {class: 'col-md-3 col-lg-2'})
		// ,cardNota 			: $('<div>', {class: 'card'})
		// ,cardNotaBody		: $('<div>', {class: 'card-body'})
		
		
	};
});