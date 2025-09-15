mainApp.factory('utilitiesFactory', function($location) {

	var
		query 		= jQuery,
		regExEmail 	= /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		regUserName	= "/^[a-zA-Z0-9{0,40}-_]+$/",
		sizeFoto	= [250, 250, 3],
		extFoto		= ["jpg", "jpeg", "bmp", "gif", "png", "JPG", "JPEG", "BMP", "GIF", "PNG"];

	function isEmptyObjLocal(obj){
		return query.isEmptyObject(obj);
	};

	function isEmptyStrLocal(str){

		return (str==undefined || str=="" ? true : false);
	};

	return  {
		$$ : $,
		isEmptyObj : function(el){
			var obj = el || {};
			return isEmptyObjLocal(obj);
		},
		log:function(str){
			if(str) console.log(str);
			else console.log("Error!");
		},
		isEmptyArray : function(el){
			var arr = el || [];
			return arr.length==0?true:false;
		},

		isEmptyStr : function(str){
			return isEmptyStrLocal(str);
		},

		showPage : function(param){
			var par = param || {};
			if(isEmptyObjLocal(par) && isEmptyStrLocal(par.path)) return false;
			$location.path(par.path);
		},
		isFunction : function(functionToCheck) {
			 return typeof foo === "function"?true:false;
		},
		tablePagination : function(options){
			var
			opt 	= options || {};
			$tbody 	= $("<tbody>");



			for(var i = 0; i< opt.dataItams.length; i++){
				var $tr = $("tr");
				console.log(opt.dataItams[i]);
				for(item in opt.dataItams[i]){
					console.log(item);
					var $td = $("td").html(opt.dataItams[i][item]);
					$tr.append($td);
				}
				$tbody.append($tr);
			}

			return $tbody;

		},
		setCookies : function(options){
			var opt = options || {};
			if(!isEmptyObjLocal(opt)){
				$.cookie(opt.name, opt.value);
			}

		},
		getCookies : function(name){
			return $.cookie(name);
		},
		destroyCookie : function(name) {
			$.removeCookie(name);
		},


		checkTimeToken : function(options){
			var opt = options || {};
			var diff = ((new Date() - new Date(opt.data))/60000);
			return diff<opt.time?true:false;
		},

		convertXcleToJSON: function(options){

			var opt = options || {};

			var excel2json = require("excel-to-json");
			excel2json({
				input: opt.pathFileInput,
				output: opt.pathFileOutput
			}, function(err, result) {
				if(err) {
					console.error(err);
				} else {
					console.log(result);
				}
			});


		},

		formatMoney : function(options){

			var 
				opt = options || {},
				n 	= opt.value,
				c 	= opt.nDecimal,
				d 	= opt.dSepator,
				t 	= opt.tSeparator;


			c = isNaN(c = Math.abs(c)) ? 2 : c;
			d = d == undefined ? "." : d;
			t = t == undefined ? "," : t; 
			
			var s = n < 0 ? "-" : "";
			var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
			var j = (j = i.length) > 3 ? j % 3 : 0;

			return (s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));

		},

		fromImgToBase64Canvas : function(options){

			var
				opt 	= options || {},
				URL 	= window.URL || window.webkitURL,
				imgURL 	= URL.createObjectURL(opt.file),
				img 	= new Image();

		    img.onload = function() {
		      var
			      canvas = document.createElement('canvas'),
			      ctx = canvas.getContext('2d'),
			      w0 = img.width,
			      h0 = img.height,
			      w1 = Math.min(w0, 1000),
			      h1 = h0 / w0 * w1;
		      canvas.width = w1;
		      canvas.height = h1;
		      ctx.drawImage(img, 0, 0, w0, h0, 0, 0, canvas.width, canvas.height);
		      var data_src = canvas.toDataURL('image/jpeg', 0.5);
//		      opt.domResult[0].attributes.src=data_src;
		      document.getElementById(opt.idDomImg).setAttribute( 'src',data_src);
		      URL.revokeObjectURL(imgURL);
		    };
		    img.src = imgURL;
		},

		numberFormat : function(options){
			var opt = options || {};
  			return opt.num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, opt.char);
		},

		fromImgToBase64FileReade : function(options){
			var
				opt 	= options || {},
				reader 	= new FileReader();
			reader.onloadend = function() {
				console.log('RESULT', reader.result);
//				document.getElementById(opt.idDomImg).setAttribute( 'src',reader.result);
				return reader.result;
			};
			reader.readAsDataURL(opt.file);
		},

		encodeImageFileAsURL : function (options) {

			var opt = options || {};

		    var filesSelected = document.getElementById(opt.idDomFile).files;
		    if (filesSelected.length > 0) {
		      var fileToLoad = filesSelected[0];

		      var fileReader = new FileReader();

		      fileReader.onload = function(fileLoadedEvent) {
		        var srcData = fileLoadedEvent.target.result; // <--- data: base64

		        var newImage = document.createElement('img');
		        newImage.src = srcData;
		        document.getElementById(opt.idDomImg).src = srcData;
//		        document.getElementById(opt.idDomImg).innerHTML = newImage.outerHTML;
		        console.log("Converted Base64 version is " + srcData);
		      };
		      fileReader.readAsDataURL(fileToLoad);
		    }
		  },

		  isEmailValid : function(mail){
			  var regExEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			  mail = mail || "";
			  return regExEmail.test(mail);
		  },

		  checkPassStrength : function(options){
			  var
			  	opt = options || {},
			  	pass = opt.password || "";

			  return {
				  livello : scorePassword(pass),
				  esito	  : checkPassStrength(pass),
			  };

		  },
		  getUrlParameterByName : function(name, url) {
			  if (!url) url = window.location.href;
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url);
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
		  },

		  validaFoto : function(options){
			  var opt = options || {};
			  var sFileName = $("#"+opt.idFotoDom);
			  console.log(getExtension(sFileName.val()));
			  return jQuery.inArray(getExtension(sFileName.val()), extFoto)==0?true:false;
		  },

			encodeBase64 : function(a){
				var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
				if (!a) return a;
				do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e,
				f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
				return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
			},
			decodeBase64 : function(a){
				var b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length;
				for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
				for (c = 0; j > c; c++) for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
				return h;
			},

			hasClass : function(options) {
				var opt = options || {};
			    return (' ' + opt.element.className + ' ').indexOf(' ' + opt.class+ ' ') > -1;
			},

			export:{
				csv:function(options){
					var
						opt 			= options || {},
						JSONData 		= opt.items,
						ReportTitle 	= opt.title,
						ShowLabel 		= opt.label,
						arrData 		= typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData,
						CSV 			= '';

			    if (ShowLabel) {
			        var row = "";
			        for (var index in arrData[0]) {
			            row += index + ',';
			        }
			        row = row.slice(0, -1);
			        CSV += row + '\r\n';
			    }
			    for (var i = 0; i < arrData.length; i++) {
			        var row = "";
			        for (var index in arrData[i]) {
			            row += '"' + arrData[i][index] + '",';
			        }
			        row.slice(0, row.length - 1);
			        CSV += row + '\r\n';
			    }

			    if (CSV == '') {
			        alert("Invalid data");
			        return;
			    }

			    var fileName = "";
			    fileName += ReportTitle.replace(/ /g,"_");
			    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

			    // Now the little tricky part.
			    // you can use either>> window.open(uri);
			    // but this will not work in some browsers
			    // or you will not get the correct file extension

			    //this trick will generate a temp <a /> tag
			    var link = document.createElement("a");
			    link.href = uri;

			    //set the visibility hidden so it will not effect on your web-layout
			    link.style = "visibility:hidden";
			    link.download = fileName + ".csv";

			    //this part will append the anchor tag and remove it after automatic click
			    document.body.appendChild(link);
			    link.click();
			    document.body.removeChild(link);

				},
				excel:function(options){

					var
						opt 		= options || {},
						dataFile 	= opt.data,
				    	a 			= document.createElement('a'),
				    	dataType 	= 'data:application/vnd.ms-excel;charset=utf-8',
				    	tableHtml 	= $(opt.domTable)[0].outerHTML;
				    tableHtml = tableHtml.replace(/<tfoot[\s\S.]*tfoot>/gmi, '');
				    a.href = dataType + ',' + encodeURIComponent('<html><head></' + 'head><body>' + tableHtml + '</body></html>');
//				    a.href = dataType + ',' + encodeURIComponent('<html><head>' + opt.cssMeta || "" + '</' + 'head><body>' + tableHtml + '</body></html>');
				    a.download = opt.titolo + "_" + dataFile + '.xls';
				    a.click();
				    e.preventDefault();
				}
			},

			getGuastoFromLabel : function(options){
				var
					opt = options || {},
					tipiGuasti = opt.tipiGuasti;
				for(var i=0; i<tipiGuasti.length; i++){
					if(tipiGuasti[i].label === opt.guasto)
						return tipiGuasti[i];
				}
				return false;
			},


			// showLoading : function(options){
			// 	var opt = options || {},
			// 	$containerLoading = $("<div class='containerLoading'>"),
			// 	$loadLogo = $("<div class='loaderLogo'>");
			// 	$(opt.domContainer).append($containerLoading.append($loadLogo));
			// },

			// hideLoading : function(options){
			// 	var opt = options || {};
			// 	$(opt.domContainer.find(".containerLoading")[0]).remove();
			// },


			showLoading : function(options){
				var opt = options || {},
				$containerLoading = $("<div class='containerLoading'>"),
				$containerMask = $("<div class='containerMask'>"),
				$loadLogo = $("<div class='loaderLogo'>");
				$(opt.domContainer).append($containerMask.append($containerLoading.append($loadLogo)));
			},

			 hideLoading : function(options){
				var opt = options || {};
				$(opt.domContainer.find(".containerMask")[0]).remove();
			},


			alertMessage : function(){
				var $modalMessage = $("#modalMessage");
				$modalMessage.find(".modal-content")
					.removeClass("bg-danger")
					.removeClass("bg-cussess");
				$modalMessage.removeClass("text-danger")
					.removeClass("text-success");

				return {
					error : function(options){
						var opt = options || {};
						$modalMessage.addClass("text-white");
						$modalMessage.find(".modal-content").addClass("bg-danger");
						$("#headerMessage").empty().html(opt.titleMessage);
						$("#textMessage").empty().html(opt.texteMessage);
						return {
							show : function(){$modalMessage.modal('show');}
						}
					},
					success : function(options){
						var opt = options || {};
						$modalMessage.addClass("text-white");
						$modalMessage.find(".modal-content").addClass("bg-success");
						$("#headerMessage").empty().html(opt.titleMessage);
						$("#textMessage").empty().html(opt.texteMessage);
						return {
							show : function(){$modalMessage.modal('show');}
						}
					}
				}
			}

	};
	function getExtension(filename) {
	    var parts = filename.split('.');
	    return parts[parts.length - 1];
	};
	function scorePassword(pass) {
	    var score = 0;
	    if (!pass)
	        return score;

	    // award every unique letter until 5 repetitions
	    var letters = new Object();
	    for (var i=0; i<pass.length; i++) {
	        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
	        score += 5.0 / letters[pass[i]];
	    }

	    // bonus points for mixing it up
	    var variations = {
	        digits: /\d/.test(pass),
	        lower: /[a-z]/.test(pass),
	        upper: /[A-Z]/.test(pass),
	        nonWords: /\W/.test(pass),
	    };

	    variationCount = 0;
	    for (var check in variations) {
	        variationCount += (variations[check] == true) ? 1 : 0;
	    }
	    score += (variationCount - 1) * 10;

	    return parseInt(score);
	};

	function checkPassStrength(pass) {
	    var score = scorePassword(pass);
	    if (score > 66)
	        return "Ottima";
	    if (score > 33)
	        return "Buona";
	    if (score >= 30)
	        return "Scarsa";

	    return "";
	};

	function Validate(oForm) {
	    var arrInputs = oForm.getElementsByTagName("input");
	    for (var i = 0; i < arrInputs.length; i++) {
	        var oInput = arrInputs[i];
	        if (oInput.type == "file") {
	            var sFileName = oInput.value;
	            if (sFileName.length > 0) {
	                var blnValid = false;
	                for (var j = 0; j < _validFileExtensions.length; j++) {
	                    var sCurExtension = _validFileExtensions[j];
	                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
	                        blnValid = true;
	                        break;
	                    }
	                }

	                if (!blnValid) {
	                    alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
	                    return false;
	                }
	            }
	        }
	    }

	    return true;
	}

});
