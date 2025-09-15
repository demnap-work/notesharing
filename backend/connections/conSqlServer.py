import pyodbc
# from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *
from utils.ThrowableExcept import ThrowableExcept
#from factory.LogUtil import *

class conSqlServer():
    # __instance = None
    def __init__(self, dbConnection):
        # if conSqlServer.__instance == None:
        #     conSqlServer.__instance = self
            # self.log            = LogUtil('log', "").getInstance()
            self._dbConnection  = dbConnection
            
            self.fileProperties = FilePropertiesFactory(".\config\connectionsDB.properties")
            # print("sono qui")
            self._server        = self.fileProperties.get(self._dbConnection, "server")
            self._database      = self.fileProperties.get(self._dbConnection, "database")
            self._port          = self.fileProperties.get(self._dbConnection, "port")
            self._username      = self.fileProperties.get(self._dbConnection, "username")
            self._password      = self.fileProperties.get(self._dbConnection, "password")
            self._driver        = self.fileProperties.get(self._dbConnection, "driver")

            #self._trustedConn   = self.fileProperties.get(self._dbConnection, "Trusted_Connection")
            #self._MARSConn      = self.fileProperties.get(self._dbConnection, "MARS_Connection")
            #self._multipleActiveResultSets      = self.fileProperties.get(self._dbConnection, "MultipleActiveResultSets")

            # self._driverCon     = str("DRIVER={0};Server={1};Port={2};Database={3};UID={4};PWD={5};Trusted_Connection={6};MARS_Connection={7};MultipleActiveResultSets={8}".format(
            #     self._driver,self._server,self._port,self._database,self._username,self._password, self._trustedConn, self._MARSConn,self._multipleActiveResultSets)
            # )
            
            self.bnd = bundle(lang="it").getBnd()
            self._lastCursor = None
    """"
            self._driverCon     = str("DRIVER={0};Server={1};Port={2};Database={3};UID={4};PWD={5}".format(
                self._driver,self._server,self._port,self._database,self._username,self._password)
            )

            self.cnxn = pyodbc.connect(self._driverCon)
            self.bnd = bundle(lang="it").getBnd()
            self._lastCursor = None
    """

    def getDriveConn(self):
        # self.log.write("conSqlServer - getDriveConn - query ")
        return self._driverCon  # type: ignore

    def __getConnection(self):
        try:
            return self.cnxn.cursor()
        except Exception as e: 
            error = 'conSqlServer - getConnection - impossibile connettersi al DB: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    # @ThrowableExcept(classType="conSqlServer", method="getConnection")
    def getConnection(self):
        _driverCon   = str("DRIVER={0};Server={1};Port={2};Database={3};UID={4};PWD={5}".format(
            self._driver,self._server,self._port,self._database,self._username,self._password)
        )

        cnxn = pyodbc.connect(_driverCon)
        return cnxn, cnxn.cursor()

    def getDatabase(self):
         return self._database

    def execute(self, sql, params=[]):
        # self.log.write("conSqlServer - execute - query {0}, condition, {1}".format( sql, str(params)))
        try:   
            self._lastCursor = self.getConnection()
            result = self._lastCursor.execute(sql, params)
            return result
        except Exception as e:
            error = 'conSqlServer - execute error: {0}'.format(e)
            #LogUtil().write(msg=f"{error=}", str='ERROR')
            print(f"{error=}")
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])
        


    def description(self):
        try:   
            return self._lastCursor.description
        except Exception as e:
            error = 'conSqlServer - description error: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def rowcount(self):
        try:   
            return self._lastCursor.rowcount
        except Exception as e:
            error = 'conSqlServer - rowcount error: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def commit(self):
        self.log.write("conSqlServer - commit")
        try:   
            self.getConnection().commit()
        except Exception as e:
            error = 'conSqlServer - commit error: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["prbTransazione"])