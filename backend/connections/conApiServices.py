#from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *
import requests

class conApiServices():
    '''
        Auth: Giuseppe De Martino 22/07/2019
    '''
    def __init__(self, paramsConnection):
        self.paramsConnection = paramsConnection
        #self.log = LogUtil('log', "").getInstance()
        self.bnd = bundle(lang="it").getBnd()
        self.timeout = 3
  

    def request(self, apiConnection, service, params, method="GET"):
        self.log.write("conApiServices - request - start request to service {0} params {1} method {2}".format(service, params, method))
        try:
            url = "http://"+apiConnection["baseUrl"]+":"+apiConnection["port"]+"/"+service
            if method.upper() == "GET":
                return self.get(url, params)
            elif method.upper() == "POST":
                return self.post(url, params)
            else:
                error = 'conApiServices - request - impossibile chiamare il servizio errore nel metodo: {0}'.format(method)
                self.log.write(error,'ERROR')
                raise ValueError(self.bnd["datiNoDisp"])
        except Exception as e:
            error = 'conApiServices - request - impossibile chiamare il servizio: {0}'.format(e)
            self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])


    def get(self, url, payloads):
        self.log.write("conApiServices - request - start request get params url {0}, payload {1}".format(url, payloads))
        r = requests.get(url,params=payloads)
        self.log.write("conApiServices - request - get result",'DEBUG')
        return r.json()
    
    def post(self, url, payloads):
        self.log.write("conApiServices - request - start request post params url {0}, payload {1}".format(url, payloads))
        r = requests.post(url, params=payloads)
        self.log.write("conApiServices - request - post result",'DEBUG')
        return r.json()