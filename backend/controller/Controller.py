from factory.utilities import utilities
# from factory.ThrowableExcept import *
from DAO.TokenDao import *

class Controller():
    def __init__(self): pass

    def getControllerBase(self):
        mexPregMore = "si prega di riprovare più tardi"
        return {
            "msg":{
                "error"         : "Errore imprevisto "+mexPregMore
                ,"methodOK"     : "Qualcosa è andato storto, "+mexPregMore
                ,"privilegesKO" : "Non hai i privilegi per effettuare questa operazione"
                
                ,"tokenKO"      : "Sessione ancora attiva"
                
                #gestione users
                ,"loginKO"      : "Login fallita Username o password errata"
                ,"logouOK"      : "Logout effettuato con successo"
                ,"logoutOK"     : "Logout avvenuto con sucesso"
                ,"pwdWrong"     : "La pasword non è corretta, inserire una password comprea tra i 5 e 10 caratte e che contenga lettere e numeri"
                ,"pwdDifferent" : "La pasword ripetura non è orretta"
                ,"userExist"    : "Utente già esistente"
                ,"userWrong"    : "Utente non valido, inserire un utente compreso fra i 5 e i 10 caratteri"
                ,"userInsertOK" : "Utente inserito con successo"
                
                
                
                #gestione note
                ,"insertNotaOK" : "Nota inserita con sucesso"
                ,"removedNotaOK": "Nota eliminata con sucesso"
                ,"notaSharedOK" : "Nota condivisa con sucesso"
                ,"notaUpdateOK" : "Nota modificata con successo"
                
                
                ,"Authorization_RequestDenied": "Authorization_RequestDenied - Insufficient privileges to complete the operation."
               
            },
            "utils" : utilities().getInstance()
        }
    
    # @ThrowableExcept(logErr=True, msgError="Controller - checkToken", logfile="log/logErrDao.log")
    def checkToken(self, token):
        infoUserByToken = TokenDao().execute("get", (token, ))
        return infoUserByToken
    
    def updateToken(self, token): TokenDao().execute("update", (token, ))


if __name__ == '__main__':
    # print(0)
    c = Controller()
    c.getControllerBase()
