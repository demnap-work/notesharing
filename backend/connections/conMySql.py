# import requests
import mysql.connector
from mysql.connector.cursor import *
from utils.FilePropertiesFactory import FilePropertiesFactory
#from factory.bundle import *
# import time
# from utils.ThrowableExcept import ThrowableExcept


class conMySql():
    def __init__(self, dbConnection):
        self._dbConnection  = dbConnection
        self.fileProperties = FilePropertiesFactory("configFiles/initConfig.ini")
        self._host           = self.fileProperties.get(self._dbConnection, "host")
        self._database      = self.fileProperties.get(self._dbConnection, "database")
        self._port          = self.fileProperties.get(self._dbConnection, "port")
        self._username      = self.fileProperties.get(self._dbConnection, "username")
        self._password      = self.fileProperties.get(self._dbConnection, "password")

    # @ThrowableExcept(classType="conMySql", method="getConnection")
    def getConnection(self):
        cnxn = mysql.connector.connect(user=self._username, password=self._password, host=self._host, database=self._database, pool_name="manager_pool", pool_size=20)
        cursor = cnxn.cursor(dictionary=True)
        return cnxn, cursor

    def getDatabase(self):
         return self._database


