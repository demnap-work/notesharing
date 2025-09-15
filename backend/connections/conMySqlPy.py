import pymysql
from utils.FilePropertiesFactory import FilePropertiesFactory
from utils.ThrowableExcept import ThrowableExcept


# class SingletonMeta(type):
#     _instances = {}
    
#     def __call__(cls, *args, **kwargs):
#         if cls not in cls._instances:
#             cls._instances[cls] = super().__call__(*args, **kwargs)
#         return cls._instances[cls]

# class conMySqlPy():
    
#     def __init__(self, dbConnection):
#         self._dbConnection  = dbConnection
        
#         # self.fileProperties = FilePropertiesFactory("../configFiles/connectionsDB.properties")
#         self.fileProperties = FilePropertiesFactory("configFiles/connectionsDB.properties")
#         self._host          = self.fileProperties.get(self._dbConnection, "host")
#         self._database      = self.fileProperties.get(self._dbConnection, "database")
#         self._port          = self.fileProperties.get(self._dbConnection, "port")
#         self._username      = self.fileProperties.get(self._dbConnection, "username")
#         self._password      = self.fileProperties.get(self._dbConnection, "password")
        
#     # @ThrowableExcept(classType="conMySqlPy", method="getConnection")
#     def getConnection(self):
#         cnxn = pymysql.connect(user=self._username, password=self._password, host=self._host, database=self._database)
#         cursor = cnxn.cursor(pymysql.cursors.DictCursor)
#         return cnxn, cursor
     
#     def getDatabase(self):
#          return self._database
     

class conMySqlPy():
    
    _instance = None
    _connection = None
    _dbConnection = None
    
    def __new__(cls, dbConnection):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._dbConnection = dbConnection
            cls._instance._connection = cls._instance._create_connection(dbConnection)
        return cls._instance
    
    def _create_connection(self, dbConnection):
        self.fileProperties = FilePropertiesFactory("configFiles/connectionsDB.properties")
        host     = self.fileProperties.get(dbConnection, "host")
        database = self.fileProperties.get(dbConnection, "database")
        port     = self.fileProperties.get(dbConnection, "port")
        username = self.fileProperties.get(dbConnection, "username")
        password = self.fileProperties.get(dbConnection, "password")
        
        return pymysql.connect(
            host        = host,
            port        = int(port),
            user        = username,
            password    = password,
            database    = database,
            # charset     = 'utf8mb4',
            cursorclass = pymysql.cursors.DictCursor
        )
    
    def getConnection(self):
        try:
            self._connection.ping(reconnect=True)
        except pymysql.OperationalError:
            self._connection = self._create_connection(self._dbConnection)
        if not self._connection.open:
            self._connection = self._create_connection(self._dbConnection)
        return self._connection, self._connection.cursor()


