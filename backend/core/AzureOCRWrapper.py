from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from utils.ThrowableExcept import *
class AzureOCRWrapper(object):
    
    __instance  = None
    __ENDPOINT  = "https://partecocr.cognitiveservices.azure.com/"
    __KEY       = "8948ac7c7c0f48e1a7b3431b3a87d9ad"
    
    def __init__(self):
        if AzureOCRWrapper.__instance is None:
            AzureOCRWrapper.__instance = self
    
    @classmethod
    @ThrowableExcept(classType="AzureOCRWrapper", method="getInstance")
    def getInstance(cls):
        if cls.__instance is None: cls.__instance = cls()
        return cls.__instance
    
    @ThrowableExcept(classType="AzureOCRWrapper", method="getOCR")
    def getOCR(self, pathDpcument):
        credential = AzureKeyCredential(self.__KEY)
        document_client = DocumentAnalysisClient(self.__ENDPOINT, credential)
        with open(pathDpcument, "rb") as image_fd:
            poller = document_client.begin_analyze_document("prebuilt-document", image_fd)
            # print(f"{poller=}")
            # print(f"{type(poller)=}")
            result = poller.result()
            # print(f"{result=}")
            # print(f"{type(result)=}")
        recognized_text = ""
        for page in result.pages:
            for line in page.lines:
                recognized_text += line.content + "\n"

        return recognized_text