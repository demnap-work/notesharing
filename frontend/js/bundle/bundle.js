mainApp.factory('boundle', function() {
	return {
		ita:{
			itaDatatable	: {
				"sEmptyTable":     "Nessun elemento trovato",
				"sInfo":           "_START_ a _END_ di _TOTAL_",
				"sInfoEmpty":      "0 Record",
				"sInfoFiltered":   "(filtrati da _MAX_ elementi totali)",
				"sInfoPostFix":    " ",
				"sInfoThousands":  ".",
				"sLengthMenu":     "Vis. _MENU_",
				"sLoadingRecords": "Caricamento...",
				"sProcessing":     "Elaborazione...",
				"sSearch":         "Cerca:",
				"sZeroRecords":    "La ricerca non ha portato alcun risultato.",
				"oPaginate": {
					"sFirst":      "Inizio",
					"sPrevious":   "<<",
					"sNext":       ">>",
					"sLast":       "Fine"
				},
				"oAria": {
					"sSortAscending":  ": attiva per ordinare la colonna in ordine crescente",
					"sSortDescending": ": attiva per ordinare la colonna in ordine decrescente"
				}
			}
		}

	};
});
