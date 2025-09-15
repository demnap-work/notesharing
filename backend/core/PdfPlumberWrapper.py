from utils.ThrowableExcept import *
import pdfplumber

class PdfPlumberWrapper(object):
    __instance  = None
    __response  = None
    
    
    
    def __init__(self, apiKey="", apiVersion="", endPoint="", model="gpt35"):
        if PdfPlumberWrapper.__instance is None:
            PdfPlumberWrapper.__instance = self

    
    @classmethod
    @ThrowableExcept(classType="PdfPlumberWrapper", method="getInstance")
    def getInstance(cls):
        if cls.__instance is None: cls.__instance = cls()
        return cls.__instance
    
    @ThrowableExcept(classType="PdfPlumberWrapper", method="getOCR")
    def getOCR(self, path=""):
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text()
        return text
        



import os

def lista_nomi_file(directory):
    if not os.path.isdir(directory):
        print(f"Il percorso '{directory}' non esiste.")
        return []

    try:
        nomi_file = os.listdir(directory)
        return nomi_file
    except Exception as e:
        print(f"Si è verificato un errore: {str(e)}")
        return []
    
    
    
if __name__ == '__main__':
    ocrPDF = PdfPlumberWrapper().getInstance()
    
    nomiFile = lista_nomi_file("C:\devOps\document-classifier\document-classifier\code\document_pdf\\001")
    print("Lista dei nomi dei file nella directory:")
    for nomeFile in nomiFile:
        result = ocrPDF.getOCR(path="C:\devOps\document-classifier\document-classifier\code\document_pdf\\001\\"+nomeFile)
        print(nomeFile)
        print(result)
    
    
    
    
