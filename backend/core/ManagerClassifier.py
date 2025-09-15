from utils.FilePropertiesFactory import FilePropertiesFactory
from utils.ThrowableExcept import ThrowableExcept
from utils.XmlFactory import XMLParser
from core.AzureOpenAIWrapper import AzureOpenAIWrapper
from core.ManagerClassifierInterface import ManagerClassifierInterface
from core.WorkAzureOpenAI import WorkAzureOpenAI
from DAO.DocumentDAO import DocumentDAO
from datetime import datetime
import os, time, random

class ManagerClassifier(ManagerClassifierInterface):
    __istance = None
    __listWorkThread = {}
    
    def __new__(cls, *args, **kwargs):
        if cls.__istance is None:
            cls.__istance = super().__new__(cls)
        return cls.__istance
    
    def __init__(self, fileProp="", env="", client=""):
        super().__init__()
        self.__fileProp  = fileProp
        self.__env       = env
        self.__client    = client
        
        self._fileProp          = FilePropertiesFactory(fileProp=self.getFileIni())
        self.__configXMLPath    = self._fileProp.get(self.__env, "configPath")
        
        self.__configXML    = XMLParser(filePath=self.__configXMLPath)
        self.__config       = self.__configXML.getDict()
        
        
    @ThrowableExcept(classType="ManagerClassifier", method="getConfigVal")
    def getConfigVal(self, queryN: int, classifierType: str):
        # print(self.__config, "\n")
        # for k, v in self.__config.items():
        #     print(f"{k} : {v}")
        # print(f"\n{'-' * 20}\n")
        
        res = None
        listQuery = self.__config['inputs']['query'][queryN]
        if classifierType == "typeDoc":
            res = listQuery['typeDoc']
        elif classifierType == "classifier":
            res = listQuery['classifier']
        elif classifierType == "apiKey":
            res = listQuery['apiKey']
        elif classifierType == "endPoint":
            res = listQuery['endPoint']
        elif classifierType == "apiVersion":
            res = listQuery['apiVersion']
        elif classifierType == "topics":
            res = listQuery['features']['list'].split(', ')
        elif classifierType == "prompt":
            res = listQuery['prompt']['prompt']
        elif classifierType == "source":
            res = listQuery['source']['path']
        elif classifierType == "responseType":
            res = listQuery['output']['responseType']

        return res
    
    @ThrowableExcept(classType="ManagerClassifier", method="getClassifier")
    def getClassifier(self, classifierType: str):
        res = None
        # classifierProp = self.__config['inputs']['query'][0]
        classifierProp = self.__config['inputs']['query']
        
        if classifierType == "AzureOpenAI":
            res = AzureOpenAIWrapper(
                        apiKey      = classifierProp["apiKey"],
                        endPoint    = classifierProp["endPoint"],
                        apiVersion  = classifierProp["apiVersion"]
                    ).getInstance()
        # elif classifierType == "":
        #     pass
            
        return res
    
    @ThrowableExcept(classType="ManagerClassifier", method="loadDocument")
    def loadDocument(self): # load document # previously flowConfiguration
        # classifierProp = self.__config['inputs']['query'][0]
        classifierProp = self.__config['inputs']['query']
        txtDirPath = classifierProp['source']['path']
        
        aoaiW = self.getClassifier(classifierProp['classifier'])
    
        docDao = DocumentDAO()

        if classifierProp['typeDoc'] == "document":
            txtList = os.listdir(txtDirPath)

            for txtFile in txtList:
                relPath = f"{txtDirPath}/{os.path.relpath(txtFile)}"
                # MySql: insert query -> (inserire dati di ogni file txt nella directory) value in fields: "c_name_file", "c_process_status" = In process, "c_date_start", "c_codex_document_path"
                values = (txtFile, "In process", datetime.now().strftime('%Y-%m-%d %H:%M:%S'), relPath)
                docDao.execute("addDocumentRecord", values)

            # TODO: da richiamare da un'altra parte con Lutezio (importato) servizio runProcess di tipo get all'interno della classe Process (senza usare WorkAzureOpenAI class)
            # for txtFile in txtList:
            #     tts = f"{time.time()}_{str(random.randint(0, 9999)).zfill(4)}"
            #     self.__listWorkThread[tts] = WorkAzureOpenAI(
            #                                     aoaiW       = aoaiW,
            #                                     txtFile     = txtFile,
            #                                     txtFolder   = txtDirPath,
            #                                     prompt      = classifierProp['prompt']['prompt'],
            #                                     topics      = classifierProp['features']['list'].split(', '),
            #                                     responseType= classifierProp['output']['responseType']
            #                                 )
            #     self.__listWorkThread[tts].start()
                
                # # MySql: update query -> where "c_name_file" = ...txt update "c_process_status", "c_date_end" and "c_processing_result"
                # updateQuery = "UPDATE t_document_process SET c_process_status = %s, c_date_end = %s, c_processing_result = %s WHERE c_name_file = %s"
                # newValues = ("Processed", datetime.now().strftime('%Y-%m-%d %H:%M:%S'), res, txtFile)
                # docProcessDAO.update(updateQuery, values)

                # TODO: importare tutte le classi di Lutezio in questo progetto
                # TODO: secondo servizio da fare è: prendere dalla tabella il "c_codex_path" del file di testo tramite l'id e ritornare il contenuto del file
    
        
    
    