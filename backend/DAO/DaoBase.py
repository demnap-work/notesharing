from connections.mngrConnection import *
#from factory.ThrowableExcept import *
# from utils.ThrowableExcept import *
import time

class DaoBase():

    __dictTypeDBMS = {
        "sqlserver" : 0,
        "mongodb"   : 1,
        "api"       : 2,
        # "sqlserver" : 3,
        "SQLAlchemy": 4,
        "mysql"     : 5,
        "oracle"    : 6
    }


    def __init__(self, typeDBMS=None, nameConnection=None):
        self.__typeDBMS = typeDBMS.lower() # type: ignore
        self.__nameConnection = str(nameConnection)

    #@ThrowableExcept(logErr=True, msgError="DaoBase - getCon", logfile="log/logErrDao.log", classType="daoBase")
    # @ThrowableExcept(classType="DaoBase", method="getCon")
    def getCon(self):
        # return mngrConnection().getConnection(
        return mngrConnection().getInstance().getConnection(
            self.__dictTypeDBMS[self.__typeDBMS], 
            self.__nameConnection+"_"+str(time.time()),
            self.__nameConnection
        )
    
    # @ThrowableExcept(logErr=True, msgError="DaoBase - getDBMS", logfile="log/logErrDao.log", classType="daoBase")
    # @ThrowableExcept(classType="DaoBase", method="getDBMS")
    def getDBMS(self):
        return self.__typeDBMS