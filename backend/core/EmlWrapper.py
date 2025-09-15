from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from utils.ThrowableExcept import *
# from __future__ import print_function
# from collections import defaultdict
from email.parser import Parser
import email, re, pprint, sys, os, os.path

class EmlWrapper(object):
    
    __instance  = None
    
    # def __init__(self, pathEml):
    #     if EmlWrapper.__instance is None:
    #         EmlWrapper.__instance = self
    #     self.pathEml = pathEml
    #     # self.extractor = extract_msg.Message(self.pathMsg)
    
    def __init__(self, pathEml):
        self.pathEml = pathEml
        # self.extractor = extract_msg.Message(self.pathMsg)
    
    # @classmethod
    # @ThrowableExcept(classType="EmlWrapper", method="getInstance")
    # def getInstance(cls):
    #     if cls.__instance is None: cls.__instance = cls()
    #     return cls.__instance
    
    @ThrowableExcept(classType="EmlWrapper", method="parseEml")
    def parseEml(self):
        if isinstance(self.pathEml, str):
            with open(self.pathEml, 'r', encoding='utf-8') as eml_file:
                eml_content = eml_file.read()
            msg = email.message_from_string(eml_content)        
        elif isinstance(self.pathEml, bytes):
            msg = email.message_from_bytes(self.pathEml)
        else:
            return {"error" : f"invalid input format in EmlWrapper: {type(self.pathEml)}"}

        sender          = msg.get('From')
        recipient       = msg.get('To')
        subject         = msg.get('Subject')
        body            = ""
        attachments     = []
        links           = []
        email_headers   = {}

        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == 'text/plain': body += part.get_payload(decode=True).decode('utf-8', 'ignore')
            elif content_type == 'text/html': pass # If you want to extract HTML content, handle it accordingly
            elif content_type == 'multipart/alternative': pass # Handle alternative content types
            elif content_type.startswith('multipart'): pass # Handle multipart content types
            elif content_type.startswith('application'):
                attachment = {}
                attachment['filename'] = part.get_filename()
                attachment['content_type'] = part.get_content_type()
                attachments.append(attachment)
            elif content_type == 'message/rfc822': pass # Handle nested emails
            else: pass # Handle other content types

        # Extract links from the email body using regex
        links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', body)
        # Extract email headers
        for key, value in msg.items():
            email_headers[key] = value

        return {
            'sender': sender,
            'recipient': recipient,
            'subject': subject,
            'body': body,
            'attachments': attachments,
            'links': links,
            'email_headers': email_headers
        }
    

    @ThrowableExcept(classType="EmlWrapper", method="getObject")
    def getObject(self):
        return self.parseEml()['subject']
    
    @ThrowableExcept(classType="EmlWrapper", method="getTextBody")
    def getTextBody(self):
        return self.parseEml()['body']
    
    @ThrowableExcept(classType="EmlWrapper", method="findAttachments")
    def findAttachments(self, message):
        found = []
        for part in message.walk():
            if 'content-disposition' not in part:
                continue
            cdisp = part['content-disposition'].split(';')
            cdisp = [x.strip() for x in cdisp]
            if cdisp[0].lower() != 'attachment':
                continue
            parsed = {}
            for kv in cdisp[1:]:
                key, _, val = kv.partition('=')
                if val.startswith('"'):
                    val = val.strip('"')
                elif val.startswith("'"):
                    val = val.strip("'")
                parsed[key] = val
            found.append((parsed, part))
        return found
    
    @ThrowableExcept(classType="EmlWrapper", method="parseMessage")
    def parseMessage(self, filename):
        with open(filename) as f:
            return Parser().parse(f)

    @ThrowableExcept(classType="EmlWrapper", method="getAttachments")
    def getAttachments(self, output_dir=''):
        msg = self.parseMessage(self.pathEml)
        attachments = self.findAttachments(msg)
        attachmentList = []
        for cdisp, part in attachments:
            attachmentList.append(part)
        return attachmentList
    
    @ThrowableExcept(classType="EmlWrapper", method="getAttachmentsWithFilename")
    def getAttachmentsWithFilename(self, output_dir=''):
        msg = self.parseMessage(self.pathEml)
        attachments = self.findAttachments(msg)
        attachmentList = []
        filenameList = []
        for cdisp, part in attachments:
            attachmentList.append(part)
            filenameList.append(cdisp['filename'])
        return attachmentList, filenameList

    @ThrowableExcept(classType="EmlWrapper", method="saveAttachments")
    def saveAttachments(self, outputDir):
        msg = self.parseMessage(self.pathEml)
        attachments = self.findAttachments(msg)
        # print("Found {0} attachments...".format(len(attachments)))
        if not os.path.isdir(outputDir):
            os.mkdir(outputDir)
        for cdisp, part in attachments:
            cdisp_filename = os.path.normpath(cdisp['filename'])
            # prevent malicious crap
            if os.path.isabs(cdisp_filename):
                cdisp_filename = os.path.basename(cdisp_filename)
            towrite = os.path.join(outputDir, cdisp_filename)
            with open(towrite, 'wb') as fp:
                data = part.get_payload(decode=True)
                fp.write(data)
        
    @ThrowableExcept(classType="EmlWrapper", method="getSender")
    def getSender(self):
        return self.parseEml()['sender']
    
if __name__ == 'main':
    # Example usage:
    eml_path = 'sample.eml'  # Path to the .eml file
    # eml_path = 'RINGRAZIAMENTO - _CPS non si collega alla macchina_.eml'  # Path to the .eml file
    # eml_path = 'validazione Timesheet mensile.eml'  # Path to the .eml file
    parsed_email = EmlWrapper().parseEml(eml_path)
    print(type(parsed_email))
    # print(parsed_email)
    pprint.pprint(parsed_email)
