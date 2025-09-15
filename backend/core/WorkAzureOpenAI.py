from core.AzureOpenAIWrapper import AzureOpenAIWrapper
from core.PdfPlumberWrapper import PdfPlumberWrapper
from utils.FilePropertiesFactory import FilePropertiesFactory
from utils.XmlFactory import XMLParser
from utils.ThrowableExcept import ThrowableExcept
from factory.utilities import utilities
from DAO.DocumentDAO import DocumentDAO
from threading import Thread
from datetime import datetime
import os, json, time, random

class WorkAzureOpenAI(Thread):
    def __init__(self, idDocument):
        Thread.__init__(self)
        self.__idDocument = idDocument

    @ThrowableExcept(classType="WorkAzureOpenAI", method="run")
    def run(self):
        dDao        = DocumentDAO()
        pathIni     = "configFiles/initConfig.ini"
        
        # leggo il path del documento estratto da OCR
        resp = dDao.execute("getDocumentRecord", int(self.__idDocument))
        if len(resp) == 0: return {"result":"KO","result" : "Documento non trovato"}
        # with open(resp[0]["c_codex_document_path"], 'r') as file: contentDocText = file.read()
        ocrPDF = PdfPlumberWrapper().getInstance()
        resultOCR = ocrPDF.getOCR(resp[0]["c_original_document_path"])
    
        # ottengo le informazioni per costruire il prompt
        self._fileProp      = FilePropertiesFactory(fileProp=pathIni)
        self.__configXMLPath= self._fileProp.get("develop", "configPath")
        self.__configXML    = XMLParser(filePath=self.__configXMLPath)
        self.__config       = self.__configXML.getDict()
        
        # costruiscto il classifier
        classifierProp  = self.__config['inputs']['query']
        classifier = None
        if classifierProp['classifier'] == "AzureOpenAI":
            classifier = AzureOpenAIWrapper(
                    apiKey      = classifierProp["apiKey"],
                    endPoint    = classifierProp["endPoint"],
                    apiVersion  = classifierProp["apiVersion"]
                ).getInstance()
            
            
        prompt      = classifierProp['prompt']['prompt']
        topics      = classifierProp['features']['list'].split(', ')
        responseType= classifierProp['output']['responseType']
        queryMessage = prompt.format(example=responseType, topics=', '.join(topics), report=resultOCR)
        response = classifier.response(queryMessage)
        dictResponse = json.loads(json.loads(response.model_dump_json(indent=2))['choices'][0]['message']['content'])

        print(f"{dictResponse=}")

        newValues = ("Processed", datetime.now().strftime('%Y-%m-%d %H:%M:%S'), json.dumps(dictResponse), self.__idDocument)
        dDao.execute("updateDocumentRecord", newValues)

        utl = utilities()
        tts = f"{time.time()}_{str(random.randint(0, 9999)).zfill(4)}"
        txtPath = f"documentTxt/001/{tts}.txt"
        pathRes = utl.saveOCRResult(txtPath, resultOCR)

        params = (datetime.now().strftime('%Y-%m-%d %H:%M:%S'), txtPath, self.__idDocument)
        dDao.execute("updateDocumentPath", params)
