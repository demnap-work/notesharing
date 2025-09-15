#from factory.logFactory import *
# from utils.FilePropertiesFactory import FilePropertiesFactory
from connections.conMongoDB import *
from connections.conSqlServer import *
from connections.conApiServices import *
from connections.conSqlServerMS import *
from connections.conMySqlPy import *


class mngrConnection():
    __instance = None
    __activeConnections = []

    def __init__(self):
        
        if mngrConnection.__instance == None:
            mngrConnection.__instance = self

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances: 
            cls._instances[cls] = super(mngrConnection, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
    
    @staticmethod
    def getInstance():
        if mngrConnection.__instance == None: 
            return mngrConnection()
        return mngrConnection.__instance
    
    # @ThrowableExcept(classType="mngrConnection", method="getConnection")
    def getConnection(self, typeDBMS=None, name=None, credentialSet=None, pandas=False):
        """
        Returns a connection object to the specified database

        Parameters
        ----------
        type : int
            The type of database to connect to (SQL Server, MongoDB...)
        name : str
            The name of the database, as specified in the connectionsDB.properties file
        pandas : bool, optional
            Whether the connection object will be used to store the query result in a built-in Python
            structure, or in a Pandas DataFrame. The two require different connection objects, hence the
            distinction (default is False)

        Returns
        ------
        connection object
            A connection object, depending on the type parameter
        
        """
        # verifico se esistono connessioni attive
        for connection in self.__activeConnections:
            if connection.get("name") == name: 
                try:
                    # se esiste una connessione attiva ma il cursore è chiuso
                    # l'assegnazione seguente lancera un eccezione,
                    # a questo punto proseguiamo nel creare una nuova connessione
                    cursor = connection.get("name").cursor()
                    return connection.get("connection")
                except Exception as e:
                        continue
                    
        if typeDBMS == 0 or typeDBMS == "sqlserver":
            connection = conSqlServer(credentialSet).getConnection()
            
        elif typeDBMS == 1: #mongodb 
            connection = conMongoDB(credentialSet)
        elif typeDBMS == 2: #api_lib 
            connection = conApiServices(credentialSet)
        
        elif typeDBMS == 3: #SQLServer
            if pandas: connection = conSqlServerMS(credentialSet).getConnectionNoCursor()
            else: connection = conSqlServerMS(credentialSet).getConnection()
            
        # elif typeDBMS == 4: #SQLAlchemy
        #     connection = conSqlAlchemy(credentialSet).getConnection()
        
        elif typeDBMS == 5 or typeDBMS == "mysql": #MySql
            connection = conMySqlPy(credentialSet).getConnection()
            
        else: return None

        self.__activeConnections.append({"name": name, "connection": connection})
        return connection

