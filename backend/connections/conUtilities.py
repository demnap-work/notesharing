import pyodbc
# from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *
from utils.ThrowableExcept import ThrowableExcept
#from factory.LogUtil import *
from connections.conSqlServer import *
from connections.conMySql import *

#@ThrowableExcept(msgError="conUtilities - dbms_type_params", logfile="log/batchETL.log")
def dbms_type_params(dbms_type):
    params = {"dbms_type" : dbms_type}
    if dbms_type == "sqlserver":
        params["class_conn"] = conSqlServer
        params["condition"] = "iif"
        params["table_select"] = "TAD80_CLASSE"
        params["table_from"] = "TAD91_IMPORT"
        params["placeholder"] = "?"
    elif dbms_type == "mysql":
        params["class_conn"] = conMySql
        params["condition"] = "if"
        params["table_select"] = "partecdb.tad80_classi"
        params["table_from"] = "partecdb.tad91_import"
        params["placeholder"] = "%s"
    #else: Throw Exception
    return params

class conUtilities():
    def __init__(self):
        pass

    #@ThrowableExcept(msgError="conUtilities - getConn", logfile="log/batchETL.log")
    def get_conn(self, name_db, dbms_type):
        # params depending by dbms type:
        paramDb = dbms_type_params(dbms_type)
        # connection:
        db = paramDb["class_conn"](name_db)
        print(f"Connected to: {db.getDatabase()=}")
        #LogUtil.write(msg=f"Connected to: {db.getDatabase()}", level='INFO')
        conn, cursor = db.getConnection()
        return conn, cursor