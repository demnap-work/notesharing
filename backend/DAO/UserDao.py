from datetime import datetime
# from utils.FilePropertiesFactory import FilePropertiesFactory
# from numpy import true_divide
from factory.filePropertiesUtils import filePropertiesSingleton 
from DAO.DaoBase import *

class UserDao(DaoBase):
    def __init__(self):  
        
        strDBMS=filePropertiesSingleton("configFiles/connectionsDB.properties").get("notesharingDBMS", "DBMS")
        super(UserDao, self).__init__(typeDBMS=strDBMS, nameConnection='notesharingDBMS')
        self.typeDBMS = self.getDBMS()
        
        self.__con, self.__cursor = self.getCon()
        self.__checkLogin       = "SELECT * from users where user = %s and pwd = sha1(%s)"
        self.__checkUser        = "SELECT id from users where user = %s"
        self.__insertUser       = "INSERT into users (user, pwd) value (%s, SHA1(%s))"
        self.__getAllUsers      = "SELECT id, user as username from users where state = 1 and id <> %s"
        



    
    # @ThrowableExcept(logErr=True, msgError="UserDao - execute", logfile="log/logErrDao.log", classType="dao")
    def execute(self, operation, bindigParam=()):
        self.__con, self.__cursor = self.getCon()      # type: ignore
        if str(operation).lower() not in ("get_login", "check_user", "insert_user", "getall"):
            print("NOT IN IT ", str(operation).lower())
            return False

        if str(operation).lower() == "get_login":
            self.__cursor.execute(self.__checkLogin, bindigParam)
            self.__con.commit()
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "getall":
            self.__cursor.execute(self.__getAllUsers, bindigParam)
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "check_user":
            self.__cursor.execute(self.__checkUser, bindigParam)
            self.__con.commit()
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "insert_user":
            self.__cursor.execute(self.__insertUser, bindigParam)
            self.__con.commit()
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp

        
        # if str(operation).lower() == "insert":
        #     self.__cursor.execute(self.__insertNota, bindigParam)
        #     self.__con.commit()
        #     lastId = self.__cursor.lastrowid
        #     self.__closeSecreConn()
        #     return lastId
        
        self.__con.commit()
        return True

    def login(self, email, password):
        try:
            self.__cursor.execute(self.__checkLogin, (email, password, ))
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            if (len(resp) == 0): return False
            return (False, resp[0])[len(resp) == 1]
        except Exception as e:
            print("[UserDao - login] error = {0}".format(str(e)))
            return False
    

    # @ThrowableExcept(logErr=True, msgError="UserDao - __closeSecreConn", logfile="log/logErrDao.log", classType="dao")
    def __closeSecreConn(self):
        if self.__cursor: self.__cursor.close()
        self.__con.close()
        # pass