from utils.FilePropertiesFactory import FilePropertiesFactory
from DAO.DaoBase import *

class TokenDao(DaoBase):
    def __init__(self):        
        strDBMS=FilePropertiesFactory("configFiles/connectionsDB.properties").get("notesharingDBMS", "DBMS") # type: ignore
        super(TokenDao, self).__init__(typeDBMS=strDBMS, nameConnection='notesharingDBMS')
        self.typeDBMS = self.getDBMS()
        self.__con, self.__cursor = self.getCon()  # type: ignore
        
        self.__insertToken      = "INSERT INTO tokens (id_user, token) VALUE (%s, %s);"
        self.__checkToken       = "SELECT t.token, u.user, u.id AS id_user, convert(t.last_access, char) AS last_access FROM tokens t JOIN users u ON u.id = t.id_user WHERE t.token = %s and t.state = 1;"
        self.__updateToken      = "UPDATE tokens SET last_access = CURRENT_TIMESTAMP WHERE token = %s and state = 1"
        self.__deleteALLToken   = "UPDATE tokens SET state = 0 WHERE id_user = %s;"
        
    
    def execute(self, operation, bindigParam=()):
        if str(operation).lower() not in ("get", "put", "update", "delete"):
            return False

        if str(operation).lower() == "get":
            self.__cursor.execute(self.__checkToken, bindigParam)
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "put"      : self.__cursor.execute(self.__insertToken, bindigParam)        
        if str(operation).lower() == "update"   : self.__cursor.execute(self.__updateToken, bindigParam)        
        if str(operation).lower() == "delete"   : self.__cursor.execute(self.__deleteALLToken, bindigParam)
            
          
        
        self.__con.commit()
        self.__closeSecreConn()
        
        return True

    def __closeSecreConn(self):
        if self.__cursor: self.__cursor.close()
        self.__con.close()
    


