
# from DAO.UserDao import *
# from DAO.TokenDao import *

class TokenController:
    def __init__(self): pass
    
    def checkTokenAlive(self, args, header):
        return {
                "status"    : "OK",
                "result"    : self._controller["msg"]["tokenKO"],
                "username"  : self._controller["userInfo"]["user"]
            }