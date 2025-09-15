import pymysql
# from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *

class conSqlServerMS():
    def __init__(self, dbConnection):
        # self.log            = LogUtil('log', "").getInstance()
        self._dbConnection  = dbConnection
        self.fileProperties = FilePropertiesFactory("configFiles/initConfig.ini")
        self._server        = self.fileProperties.get(self._dbConnection, "server")
        self._database      = self.fileProperties.get(self._dbConnection, "database")
        self._port          = self.fileProperties.get(self._dbConnection, "port")
        self._username      = self.fileProperties.get(self._dbConnection, "username")
        self._password      = self.fileProperties.get(self._dbConnection, "password")
    
        self.cnxn = pymysql.connect(server   = self._server
                                        ,user     = self._username 
                                        ,password = self._password 
                                        ,port     = self._port
                                        ,database = self._database
                                            )   
                

    def getConnection(self):
        try:
            return self.cnxn.cursor()
        except Exception as e: 
            error = 'conSqlServer - getConnection - impossibile connettersi al DB: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def getConnectionNoCursor(self):
        try:
            return self.cnxn
        except Exception as e: 
            error = 'conSqlServer - getConnection - impossibile connettersi al DB: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def getDatabase(self):
         return self._database


