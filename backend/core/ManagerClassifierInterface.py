from abc import ABC, abstractmethod

class ManagerClassifierInterface(object):
    __dictclassifier={}
    __fileIni = ""
    
    def __init__(self):
        self.__fileIni          = "configFiles/initConfig.ini"
        self.__dictclassifier   = {
            "AzureOpenAI"   : {
                    "file"  : "core.AzureOpenAIWrapper",
                    "module": "core.AzureOpenAIWrapper"
                }
        }
        
    
    def getFileIni(self): return self.__fileIni
    
    @abstractmethod
    def getClsssification(self):pass
   
        
    
        
    
    