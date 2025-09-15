import xml.etree.ElementTree as ET

class XmlFactory():
    __instance = None
    __tree = None
    __fileName = None
    __xmlDict = dict()
    __resourcing = dict()

    @staticmethod
    def getIstance():
        if XmlFactory.__instance == None:
            XmlFactory()
        return XmlFactory.__instance

    def __init__(self, fileName):
        if XmlFactory.__instance == None:
            XmlFactory.__instance = self
            XmlFactory.__fileName = fileName
            XmlFactory.__tree = ET.parse(XmlFactory.__fileName)
  
    def getResourcing(self):
        for child in XmlFactory.__tree.getroot():
            privilege = list()
            header = list()
            param = list()
            paramDict = dict()
            headerDict = dict()
            for item in child:
                if item.tag == "privilege": privilege.append(item.attrib)
                if item.tag == "header": header.append(item.attrib)
                if item.tag == "param": str(param.append(item.attrib))
            
            if len(param) > 0:
                for par in param:
                    paramDict[str(par["name"])] = {
                        "type":par["type"],
                        "required":par["required"]
                    }

            if len(header) > 0:
                for head in header:
                    headerDict[str(head["name"]).lower()] = {"required":head["required"]}

            self.__xmlDict[child.attrib["path"]] = {
                "method"                : child.attrib["method"],
                "classNameController"   : child.attrib["classNameController"],
                "methodController"      : child.attrib["methodController"],
                "param"                 : paramDict,
                "header"                : headerDict,
                "privilege"             : [priv["typeUser"] if "typeUser" in priv else priv for priv in privilege]
            }
        
        return self.__xmlDict
    