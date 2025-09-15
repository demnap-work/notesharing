

$("#click").on("click", function(){
//	var day = "08";
//	var dataTemp = "2017/05/"+day;
//	
//	
//	console.log("<p>chiamata "+dataTemp+" </p>");
//	$.ajax({
//		type: "POST",url: "http://localhost:8181/CTEE_BE/rest/UserService/readPunDayBL",
//		data:{
//			file:"MGPPrezzi.xml",
//			data:dataTemp
//		},
//		success: function(result){
//			console.log("<p>aggiunto " + dataTemp +" </p>");
//		},
//		error: function() {
//			$("#result").append("<p style='color:red;'>ERRORE " + dataTemp + "</p>");
//		}
//	});

//	var readPunDayBL = "readPun";
////	var readSimplePunDay = "readSimplePunDay";
//	
//	
//	
//	var anno = $("#select_anno").val();
//	dataMGP = new Date(anno+"/01/01");
//	var datMGPstr = anno+"/01/01";
//	var i=1;
//	
//	var conditions = true;
//	
//	while (conditions) {
//
//		datMGPstr = (""+anno +"/"+ ( ((dataMGP.getMonth()+1)<10) ?  ("0" + (dataMGP.getMonth()+1)):(dataMGP.getMonth()+1)) +"/"+ (dataMGP.getDate()<10? ("0"+dataMGP.getDate()):dataMGP.getDate()));
//		
//		console.log("tentativo #"+i+" - "+anno +" anno selezionato - aggiunto il " + datMGPstr);
//		
//		$.ajax({
//			type: "POST",url: "http://localhost:8181/CTEE_BE/rest/UserService/"+readPunDayBL,
//			data:{
//				file:"MGPPrezzi.xml",
//				data:datMGPstr
//			},
//			success: function(result){
//				console.log("Success");
////				$("#result").append("<p>"+anno +" anno selezionato - aggiunto il " + datMGPstr + "</p>");
//			},
//			error: function() {
//				console.log("ERRORE #"+i+" - "+anno +" anno selezionato - aggiunto il " + datMGPstr);
//				$("#result").append("<p style='color:red;'>ERRORE " + anno +" cod error = "+ i +"anno selezionato - aggiunto il " + datMGPstr + "</p>");
//			}
//		});
//		dataMGP.setDate(dataMGP.getDate()+1);
//		
//		conditions = (datMGPstr==(anno+"/12/31")?false:true);
//		
//		i++;
//	}
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//READ TEE
	
	
	var readPunDayBL = "readTeeMercato";
//	var readSimplePunDay = "readSimplePunDay";
	
	
	
	var anno = $("#select_anno").val();
	dataMGP = new Date(anno+"/01/01");
	var datMGPstr = anno+"/01/01";
	var i=1;
	
	var conditions = true;
	
	while (conditions) {

		datMGPstr = (""+anno +"/"+ ( ((dataMGP.getMonth()+1)<10) ?  ("0" + (dataMGP.getMonth()+1)):(dataMGP.getMonth()+1)) +"/"+ (dataMGP.getDate()<10? ("0"+dataMGP.getDate()):dataMGP.getDate()));
		
		console.log("tentativo #"+i+" - "+anno +" anno selezionato - aggiunto il " + datMGPstr);
		
		$.ajax({
			type: "POST",url: "http://localhost:8181/CTEE_BE/rest/UserService/"+readPunDayBL,
			data:{
				file:"TEESintesiTee.xml",
				data:datMGPstr
			},
			success: function(result){
				console.log("Success");
//				$("#result").append("<p>"+anno +" anno selezionato - aggiunto il " + datMGPstr + "</p>");
			},
			error: function() {
				console.log("ERRORE #"+i+" - "+anno +" anno selezionato - aggiunto il " + datMGPstr);
				$("#result").append("<p style='color:red;'>ERRORE " + anno +" cod error = "+ i +"anno selezionato - aggiunto il " + datMGPstr + "</p>");
			}
		});
		dataMGP.setDate(dataMGP.getDate()+1);
		
		conditions = (datMGPstr==(anno+"/12/31")?false:true);
		
		i++;
	}
	
	
});
 
