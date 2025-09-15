import requests
from factory.logFactory import *
from dao.connections.conRequestApiConf import *

class conRequestApi(conRequestApiConf):
    __instance = None
    def __init__(self, apiServices):
        if conRequestApi.__instance == None:
            conRequestApi.__instance = self
            self.log = LogUtil('log', str(__name__)).getInstance()
            
            self.__conf = conRequestApiConf()
            self._servicesApi = self.__conf.getConfigurationRequestApi(apiServices)
            self._header = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}

            

    def __call__(cls, *args, **kwargs):
        if cls not in cls.__instance: 
            cls.__instance[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls.__instance[cls]
    
    @staticmethod
    def getInstance():
        if conRequestApi.__instance == None: 
            return conRequestApi()
        return conRequestApi.__instance

    def getServicesApi(self):
        return self._servicesApi

    def request(self, serivcesParam = None, payload = {}, method = "GET"):
        if serivcesParam == None: return {"status":"2","msg":"nessun servizio in ingresso"}
        services = serivcesParam
        if services == None: return {"status":"3","msg":"nome servizio non presente in configurazione"}
        try:
            resp = (requests.get(services, data=payload, headers=self._header, ),requests.post(services, data=payload, headers=self._header))[method == "POST"]
            if resp.status_code == 200:
                return {"status":"0", "response":resp.json()}
            elif resp.status_code == 404:
                return {"status":"1", "msg":"servizio non trovato"}
        except:
            return {"status":"4","msg":"errore nella richiesta a " + str(services)}
