import pathlib
import ssl
# from factory.ThrowableExcept import *

from flask import Flask, request, render_template, url_for, redirect
from flask_cors import CORS, cross_origin
# from flask_notifications import Notifications

from factory.jsonDecorator import JsonDecorator
from handler import Handler
from factory.filePropertiesUtils import filePropertiesSingleton 
from factory.xmlFactory import XmlFactory
from factory.logFactory import LogUtil


class dispatcher():

    __istance = None
    
    jsonDec             = JsonDecorator().getIstance()
    fileProperties      = filePropertiesSingleton("configFiles/init.properties")
    methodsEnabled      = fileProperties.get("initConfiguration", "methodEnabled").split(",")
    resourcingServices  = fileProperties.get("initConfiguration", "resourcingServices")
    
    logFile     = fileProperties.get("initConfiguration", "logFile")
    appName     = fileProperties.get("initConfiguration", "appName")
    version     = fileProperties.get("initConfiguration", "version")
    baseUrl     = fileProperties.get("initConfiguration", "baseUrl")
    dateLast    = fileProperties.get("initConfiguration", "dateLast")
    ltToken     = fileProperties.get("initConfiguration", "liveTimeSessionToken")
    
    
    host    = fileProperties.get("initConfiguration", "host")
    port    = int(fileProperties.get("initConfiguration", "port"))

    
    app     = Flask(__name__)
    CORS(app, support_credentials=True)
    
    # parser del parametro di configurazione per l'abilitazione della trasmissione in HTTPS
    sslContext  = True
    if  fileProperties.get("initConfiguration", "sslContext").lower() == "false":
        sslContext = False
    
    debug   = (False, True)[str(fileProperties.get("initConfiguration", "debuging")).lower()=="true"]
    resour  = XmlFactory(fileName=str(pathlib.Path(__file__).parent.absolute())+resourcingServices).getIstance().getResourcing()
       
    def __init__(self, initConfiguration=None):
        
        if dispatcher.__istance == None:
            dispatcher.__istance = self
            print("\t -> Start with\n\t -> host:{0}\n\t -> port:{1}\n\t -> ssl_context:{2}\n\t -> debug:{3}\n".format(dispatcher.host, dispatcher.port, dispatcher.sslContext ,dispatcher.debug))


    @staticmethod
    def getIstance():
        if dispatcher.__istance == None: 
            return dispatcher()
        return dispatcher.__istance


    @staticmethod
    @app.route("/<p>/<s>", methods=methodsEnabled)
    @cross_origin(supports_credentials=True)
    @jsonDec.toJson
    def handler(p, s):
        path = request.path
        form = dict(request.form)
        method = request.method
        try: 
            if method=="GET":
                param = {**form, **request.args}
            elif method=="POST":
                paramT = request.form
                param = {**form, **paramT}
        except Exception as e: 
            print("handler: ", e)
            param = form
        
        log = LogUtil(fileName=dispatcher.logFile, appName=dispatcher.appName).getInstance()
        handlerReq = Handler(pathNameResourcing=dispatcher.resour).getIstance()
        try:
            response = handlerReq.runServices({"path":path,"method":method,"param":{str(p):param[p] for p in param}, "ltToken":dispatcher.ltToken, "header":{str(p).lower():dict(request.headers)[p] for p in dict(request.headers)}})
            return response
        except Exception as error:
            log = LogUtil(fileName=dispatcher.logFile, appName=dispatcher.appName).getInstance()
            log.write("Errore nell'esecuzione del servizio {0}".format(str(error)))

    
    @staticmethod
    @app.errorhandler(400)
    @jsonDec.toJson
    def page_not_found(e): return {"status":"KO","result":str(e)}

    @staticmethod
    @app.errorhandler(404)
    @jsonDec.toJson
    def page_not_found(e): return {"status":"KO","result":"Risorsa o pagina non trovata"}

    @staticmethod
    @app.errorhandler(500)
    @jsonDec.toJson
    def resource_error(e): return {"status":"KO","result":"Errore imprevisto si prega di riprovare più tardi"}

    @staticmethod
    @app.errorhandler(405)
    @jsonDec.toJson
    def method_forbidden(e): return {"status":"KO","result":"Impossibile utilizzare il metodo {0}".format(request.method)}

    def start(self):
        if (dispatcher.sslContext == False):
            return self.app.run(debug=dispatcher.debug, host=dispatcher.host, port=dispatcher.port)
        elif (dispatcher.sslContext == True):
            return self.app.run(debug=dispatcher.debug, host=dispatcher.host, port=dispatcher.port, ssl_context = 'adhoc')
            