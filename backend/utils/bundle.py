class bundle():
    def __init__(self, lang="it"):
        self.lang = lang 
        self.bnd = {
            "it" : {
                "noPermission"  : "Non hai i permessi per questa operazione", 
                "noPrivileges"  : "Impossibile recuperare i privilegi utenti", 
                "dbError"       : "Impossibile connettersi al DB",
                "authFail"      : "Autenticazione fallita",
                "authError"     : "Autenticazione fallite, Username o Password errata",
                "tokenScaduto"  : "Token scaduto",
                "tokenOK"       : "Token ancora attivo",
                "utenteNotLog"  : "Utente non loggato",
                "noToken"       : "Nessun token attivo presente in sessione",
                "tokenUpd"      : "Token aggiornato",
                "logoutMsg"     : "Utente slogato con successo",
                "impUpToken"    : "Impossibile aggiornare il token",
                "impLog"        : "Impossibile effettuare il logout",
                "qlcStr"        : "Qualcosa è andato storto",
                "pwdStoraged"   : "La password è stata già utilizzata in passato",
                
                "datiNoDisp"    : "Dati al momento non disponibili",
                "modificaOK"    : "Modifica avvenuta con successo",  
                "updError"    : "Aggiornamento dati non riuscito",

                "isFirstLogin"  : {"status":"KO", "pwdToChange":"true", "msg":"Primo login"},
                "isPwdExpired"  : {"status":"KO", "pwdToChange":"true", "msg":"Password scaduta"},
                
                "syntax"        : "Sintassi comando non corretta",
                "dupKey"        : "Dato già presente. Aggiornamneto fallito.",
                "missingValue"        : "Mancano campi obbligatori",
                "updMissing"        : "Dato da aggiornare non trovato",
                
                # esiti json
                "esitoTokenScadutoOBJ"  : {
                    "status" : "KO",
                    "msg"   : "Token scaduto o non valido"
                },
                "esitoDaoErrorOBJ"  : {
                    "status" : "KO",
                    "msg"   : "Dati al momento non disponibili"
                }

            }
        }
        

    def getBnd(self):
        return self.bnd[self.lang]
