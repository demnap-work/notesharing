#from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *
from urllib.parse import quote_plus as urlquote
from sqlalchemy import text, create_engine  
import pymssql

class conSqlAlchemy():
    def __init__(self, dbConnection):
        
        self._dbConnection  = dbConnection
        self.fileProperties = FilePropertiesFactory("configFiles/initConfig.ini")
        self._server        = self.fileProperties.get(self._dbConnection, "server")
        self._database      = self.fileProperties.get(self._dbConnection, "database")
        self._port          = self.fileProperties.get(self._dbConnection, "port")
        self._username      = self.fileProperties.get(self._dbConnection, "username")
        self._password      = self.fileProperties.get(self._dbConnection, "password")

        self.engine = create_engine(f"mssql+pymssql://{self._username}:" + "%s" % urlquote(self._password) + f"@{self._server}:{self._port}/{self._database}")

    def getConnection(self):
        try:
            return self.engine
        except Exception as e: 
            error = 'conSqlServer - getConnection - impossibile connettersi al DB: {0}'.format(e)
            self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def getDatabase(self):
         return self._database

