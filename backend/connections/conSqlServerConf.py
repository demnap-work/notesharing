from factory.logFactory import *

class conSqlServerConf(object):
    def __init__(self): 
        self.log = LogUtil('log', str(__name__)).getInstance()
        self.configuration = {
            "dashboard":{
                "server":"dssdbpoc.par-tec.it", #172.16.2.101:1433 #dssdbpoc.par-tec.it
                "database":"I4L_DB",
                "username":"webusr",
                "password":"p@r-tEc!2017"
            },
            "A2B_DB":{
                "server":"dssdbpoc.par-tec.it", #172.16.2.101:1433 #dssdbpoc.par-tec.it
                "database":"A2B_DB",
                "username":"webusr",
                "password":"p@r-tEc!2017",
                "port":"1433"
            },
            "grafici":{
                "server":"dssdbpoc.par-tec.it",
                "database":"KIM_WINGA",
                "username":"webusr",
                "password":"p@r-tEc!2017"
            }
        }
        
        self._driverCon = '' 

    def getConfigurationCon(self, conf):
        return (None, self.configuration[conf])[conf in self.configuration]

    def getDriverCon(self):
        return self._driverCon
    
    def setDriverCon(self, conf):
        self._driverCon = 'DRIVER={SQL Server};Server='+conf["server"]+';Port='+conf["port"]+';Database='+conf["database"]+';UID='+conf["username"]+';PWD='+ conf["password"]
        return self._driverCon

