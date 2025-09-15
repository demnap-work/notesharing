from factory.logFactory import *

class conRequestApiConf(object):
    def __init__(self): 
        self.log = LogUtil('log', str(__name__)).getInstance()
        self.configuration = {
            "artemide":{
                "baseUrl":"http://artemide:88", 
                "listServices":{
                    
                    # menu
                    "menu":"/users/menu",                                       #method post; param: [token, username, codMenuDashboard]
                    
                    # chart
                    "config":"/chart/config",                                   #method post; param: [token, codMenuDashboard, filtri, grafici]
                    "getConfigChart":"/chart/config/get",                       #method post; param: [token, codMenuDashboard, filtri, grafici]
                    "chartData":"/chart/data",                                  #method post; param: [token, dsb, datasourceCode, filter]
                    "chartFilterDomain":"/chart/filter/domain",                 #method post; param: [token, id, code]
                    "getDomainColumnType":"/chart/filter/domain",               #method post; param: [token]
                    
                    # domain
                    "getDomainDefaultvalue":"/domain/get/defaultvalue",         #method post; param: [token]
                    "getDomainFunctiontype":"/domain/get/functiontype",         #method post; param: [token]
                    "getDomainLayout":"/domain/get/layout",                     #method post; param: [token]
                    "getDomainOperatori":"/domain/get/operatori",               #method post; param: [token]
                    "getDomainTipods":"/domain/get/tipods",                     #method post; param: [token]
                    "getDomainTipografico":"/domain/get/tipografico",           #method post; param: [token]
                    "getDomainTipografico":"/domain/get/tipografico",           #method post; param: [token]

                    # datasource
                    "getDataSourceCodDescr":"/datasource/get/codDescr",         #method post; param: [token]
                    "getDatasource":"/datasource/get",                          #method post; param: [token]
                    "getDatasourcefilter":"/datasourcefilter/get",              #method post; param: [token]

                    # connection
                    "getAllConnection":"/connection/get/all",                   #method post; param: [token]

                    # monitor
                    "updateMonitorPosition":"/monitor/update/position",         #method post; param: [token, monitorStatus, monitorStatus{id}, codice, descrizione, stato, top, left]
                    "readMonitorPosition":"/monitor/read/position",             #method post; param: [token, ambito]
                    "readMonitorConfig":"/monitor/read/config",                 #method post; param: [token, ambito]

                }
            }
           
        }

    def getConfigurationRequestApi(self, conf):
        return (None, self.configuration[conf])[conf in self.configuration]


