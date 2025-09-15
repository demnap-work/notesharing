from factory.xmlFactory import XmlFactory
from datetime import datetime
from zoneinfo import ZoneInfo
# from utils.ThrowableExcept import ThrowableExcept
# from factory.ThrowableExcept import ThrowableExcept
import controller, json, importlib

class Handler:
    __istance = None
    __resources = None
    __pathNameResourcing = None
    __errorService = {
        "status"    : "KO",
        "errCode"   : "-2",
        "result"       : "Qualcosa e' andato storto, si prega di riprovare più tardi"
    }
    __errorUnexpected = {
                    "status"    : "KO",
                    "result"       : "Errore imprevisto si prega di riprovare più tardi",
                    "errorCode" : "-2"
                }
    __dictMsg = {
         "noRes"        : "Risorsa non esistente"
        ,"noMethod"     : "Metodo errato"
        ,"errType"      : "Errore nel tipo di dato"
        ,"emptyVal"     : "Alcuni parametri sono vuoti"
        ,"notVal"       : "Alcuni parametri sono vuoti"
        ,"tokenKO"      : {"status": "KO","result": "Token o sessione scaduta"}
        ,"tokenOK"      : {"status": "OK","result": "Token o sessione ancora attiva"}
        ,"privilegeKO"  : {"status": "KO","result": "Non hai i privilegi per eseguire questa funzione"}
    }
    
    def __init__(self, pathNameResourcing):
        Handler.__istance = Handler
        Handler.__pathNameResourcing = pathNameResourcing
        Handler.__resources = XmlFactory(self.__pathNameResourcing).getIstance().getResourcing()
        

    @staticmethod
    def getIstance():
        if Handler.__istance == None:
            return Handler
        return Handler.__istance

    @classmethod
    def validRequest(cls, requestAttribute):
        path        = requestAttribute["path"]
        method      = requestAttribute["method"]
        param       = requestAttribute["param"]
        header      = requestAttribute["header"]
        ltToken     = requestAttribute["ltToken"]
        resources   = Handler.__resources
        controllerClass = None
        methodClass     = None
        args            = {}
        headerArgs      = {}
        paramErr        = {}
        privileges      = []
        msgErr          = None
        if path in resources:
            privileges = ([], resources[path]["privilege"])["privilege" in resources[path]]
            if resources[path]["method"] == method:
                controllerClass = resources[path]["classNameController"]
                methodClass = resources[path]["methodController"]
                paramReq = ((), resources[path]["param"])["param" in resources[path]]
                headerReq = ((), resources[path]["header"])["header" in resources[path]]
                
                for paramRead in paramReq:
                    p = str(paramRead)
                    try:
                        if paramReq[p]["required"] == "true" and p not in param: paramErr[p] = Handler.__dictMsg["notVal"] 
                        if paramReq[p]["required"] == "true" and p in param and param[p]=="": paramErr[p] = Handler.__dictMsg["emptyVal"]
                        if paramReq[p]["required"] == "false" and p not in param: args[p] = None

                        # check type parameter request
                        if paramReq[p]["type"] == "int" and p in param and param[p].lstrip().rstrip() != '' and param[p].lstrip().rstrip().lower() != 'null': args[p] = int(param[p])
                        if paramReq[p]["type"] == "float" and p in param and param[p].lstrip().rstrip() != '' and param[p].lstrip().rstrip().lower() != 'null': args[p] = float(param[p])
                        if paramReq[p]["type"] == "json" and p in param and param[p].lstrip().rstrip() != '': args[p] = json.loads(param[p])
                        else: 
                            if p in param: args[p] = param[p]
                        
                    except Exception as e:
                        print("[Handler - validRequest] Errore {0}".format(str(e)))
                        if not bool(paramErr): paramErr[p] = Handler.__dictMsg["errType"] + " need " + paramReq[p]["type"]
                
                for headerRead in headerReq:
                    p = str(headerRead).lower()
                    try:
                        if headerReq[p]["required"] == "true" and p not in header: paramErr[p] = Handler.__dictMsg["notVal"]
                        if headerReq[p]["required"] == "true" and p in header and header[p]=="": paramErr[p] = Handler.__dictMsg["emptyVal"]
                        if headerReq[p]["required"] == "false" and p not in header: headerArgs[p] = None
                        else: 
                            if p in header: headerArgs[p] = header[p]
                    except Exception as e:
                        if not bool(paramErr): paramErr[p] = Handler.__dictMsg["errType"]

            else: msgErr = Handler.__dictMsg["noMethod"]
        else: msgErr = Handler.__dictMsg["noRes"]        
        
        return {
            "args"              : args,
            "header"            : headerArgs,
            "paramErr"          : paramErr, 
            "msgErr"            : msgErr,
            "controllerClass"   : controllerClass,
            "methodClass"       : methodClass,
            "privileges"        : privileges,
            "ltToken"           : ltToken
        }

    
    @classmethod
    # @ThrowableExcept(classType="Handler", method="runServices")
    # @ThrowableExcept(logErr=True, msgError="Hundler - runServices", logfile="log/logErr.log")
    def runServices(cls, requestAttribute):
        exod = Handler.validRequest(requestAttribute)
        if exod["msgErr"] is not None:return {"status":"KO","result":exod["msgErr"]}
        if bool(exod["paramErr"]): return {"status":"KO","result":exod["paramErr"]}
        if "controllerClass" in exod and exod["controllerClass"] is not None:
            '''Estendo l'handler con il controller base'''
            moduleController        = __import__(str("controller.Controller"))
            moduleController        = getattr(moduleController, "Controller")
            moduleControllerClass   = getattr(moduleController, "Controller")
            selfControllerInit      = getattr(moduleControllerClass, "getControllerBase")
            cls._controller         = selfControllerInit("")
            
            if "token" in exod["header"]:
                checkTokenInfo  = getattr(moduleControllerClass, "checkToken")
                UpdateTokenInfo = getattr(moduleControllerClass, "updateToken")
                userInfo = checkTokenInfo("", exod["header"]["token"])
                if len(userInfo)==1:
                    ts          = datetime.strptime(userInfo[0]["last_access"].strip(), "%Y-%m-%d %H:%M:%S")
                    now         = datetime.strptime(datetime.now(ZoneInfo("Europe/Rome")).strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
                    diff        = int((now - ts).total_seconds() / 60)
                    if diff > int(exod["ltToken"]): return Handler.__dictMsg["tokenKO"]
                    UpdateTokenInfo("", exod["header"]["token"])
                    cls._controller["userInfo"] = userInfo[0]
                else:
                    return Handler.__dictMsg["tokenKO"]
            try:
                module      = __import__(str("controller."+str(exod["controllerClass"])))
                module      = getattr(module, exod["controllerClass"])
                my_class    = getattr(module, exod["controllerClass"])
                func        = getattr(my_class, str(exod["methodClass"]))
                funcResp    = func(cls, exod["args"], exod["header"])
            except Exception as e:
                print("[Handler - runServices] error {0}".format(str(e)))
                return Handler.__errorUnexpected

            if funcResp == None:
                return Handler.__errorService
            return funcResp