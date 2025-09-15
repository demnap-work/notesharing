from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from utils.ThrowableExcept import *
import extract_msg

class MsgWrapper(object):
    
    __instance  = None
    
    # def __init__(self, pathMsg):
    #     if MsgWrapper.__instance is None:
    #         MsgWrapper.__instance = self
    #     self.pathMsg = pathMsg
    #     self.extractor = extract_msg.Message(self.pathMsg)
    
    def __init__(self, pathMsg):
        self.pathMsg = pathMsg
        self.extractor = extract_msg.Message(self.pathMsg)
    
    # @classmethod
    # @ThrowableExcept(classType="MsgWrapper", method="getInstance")
    # def getInstance(cls):
    #     if cls.__instance is None: cls.__instance = cls()
    #     return cls.__instance

    @ThrowableExcept(classType="MsgWrapper", method="getObject")
    def getObject(self):
        return self.extractor.subject
    
    @ThrowableExcept(classType="MsgWrapper", method="getTextBody")
    def getTextBody(self):
        return self.extractor.body
    
    @ThrowableExcept(classType="MsgWrapper", method="getAttachments")
    def getAttachments(self):
        return self.extractor.attachments
    
    @ThrowableExcept(classType="MsgWrapper", method="getAttachmentsWithFilename")
    def getAttachmentsWithFilename(self):
        attachments = self.extractor.attachments
        filenames = []
        for att in attachments:
            filenames.append(att.getFilename())
        return attachments, filenames

    @ThrowableExcept(classType="MsgWrapper", method="saveAttachments")
    def saveAttachments(self, outputDir):
        attachments = self.extractor.attachments
        for attachment in attachments:
            attachment.save(customPath=outputDir)
        self.extractor.close()
        
    @ThrowableExcept(classType="MsgWrapper", method="getSender")
    def getSender(self):
        return self.extractor.sender
    