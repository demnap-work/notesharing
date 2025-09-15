
from DAO.UserDao import *
from DAO.TokenDao import *

class UserController:
    def __init__(self): pass
    
    def login(self, args, header):
        msg         = self._controller["msg"]
        response    = dict()
        user        = self._controller["utils"].validateParamValue("user", args)
        pwd         = self._controller["utils"].validateParamValue("pwd", args)
        result      = UserDao().execute("get_login", (user, pwd, ))
        
        if result == False or len(result)>1 or len(result)==0:
            response["status"]  = "KO"
            response["msg"]     = msg["loginKO"]
        else:
            token = self._controller["utils"].getToken(result[0]["user"])
            TokenDao().execute("put", (result[0]["id"] , token))
            response["status"]      = "OK"
            response["token"]       = token
            response["username"]    = user
        return response
    
    def logout(self, args, header):
        msg         = self._controller["msg"]
        response    = dict()
        idUser      = int(self._controller["userInfo"]["id_user"])
        TokenDao().execute("delete", (idUser, ))
        response["status"]  = "OK"
        response["result"]  = msg["logouOK"]
        return response
    
    def getAllUsers(self, args, header):
        msg         = self._controller["msg"]
        response    = dict()
        idUser      = int(self._controller["userInfo"]["id_user"])
        result      = UserDao().execute("getAll", (idUser, ))
        response["status"]  = "OK"
        response["result"]  = result
        return response
    
    def addUser(self, args, header):        
        response      = dict()
        msg           = self._controller["msg"]
        user          = self._controller["utils"].validateParamValue("user", args)
        pwd           = self._controller["utils"].validateParamValue("pwd", args)
        pwd2          = self._controller["utils"].validateParamValue("pwd2", args)
        
        statusKO       = "" 
        
        response["status"]  = "KO"
        isPWDValid = self._controller["utils"].checkPWD(pwd)
        if not isPWDValid: statusKO = statusKO + msg["pwdWrong"] + ". "
        if pwd != pwd2: statusKO = statusKO + msg["pwdDifferent"] + ". "
        
        userPWDValid = self._controller["utils"].checkUser(user)
        if not userPWDValid : statusKO = statusKO + msg["userWrong"] + ". "
        checkuser = UserDao().execute("check_user", (user, ))
        print(checkuser)
        if checkuser : statusKO = statusKO + msg["userExist"] + ". "
        
        response["result"] = statusKO
        if len(statusKO)>1: return response
        
        UserDao().execute("insert_user", (user, pwd, ))
        response["status"]  = "OK"
        response["result"]  = msg["userInsertOK"]
        return response