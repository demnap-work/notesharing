import smtplib
import mimetypes
import email
import configparser

from argparse import ArgumentParser
from email.message import EmailMessage
from email.policy import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# from utilities.filePropertiesUtils import *

class filePropertiesSingleton():
    __instance = None
    def __init__(self, fileProp):
        if filePropertiesSingleton.__instance == None:
            filePropertiesSingleton.__instance = self
            self.fileProp = fileProp
            self._config = configparser.ConfigParser(defaults=None, strict=False)
            self._config.read(self.fileProp)

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances: 
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

    @staticmethod
    def getInstance():
        if filePropertiesSingleton.__instance == None: 
            return filePropertiesSingleton()
        return filePropertiesSingleton.__instance

    def get(self, group, key):
        try: 
            value = self._config.get(group, key) 
            return value
        except Exception as e:
            msg = "fileProperties - get - Problema nella lettura"\
                " della properties con gruppo {0} chiave = {1}"\
                " nel file {2}".format(group, key,self.fileProp)
            return False

class fileProperties():
    def __init__(self, fileProp):
        self.fileProp = fileProp
        self._config = configparser.ConfigParser(defaults=None, strict=False)
        self._config.read(self.fileProp)

    def get(self, group, key):
        try: 
            value = self._config.get(group, key) 
            return value
        except Exception as e:
            msg = "fileProperties - get - Problema nella lettura"\
                " della properties con gruppo {0} chiave = {1}"\
                " nel file {2}".format(group, key,self.fileProp)
            print(str(msg))
            return False

class MailUtil:
    __instance = None
    @staticmethod
    def getInstance():
        if MailUtil.__instance == None:
            MailUtil()
        return MailUtil.__instance


    def __init__(self, fileConf = None, configName = None):
        if MailUtil.__instance == None:
            MailUtil.__instance = self

            self.fileProperties = filePropertiesSingleton(fileConf)
            self.__smtpMail     = self.fileProperties.get(configName, "smtpMail")
            self.__portMail     = self.fileProperties.get(configName, "portMail")
            self.__userMail     = self.fileProperties.get(configName, "userMail")
            self.__pwdMail      = self.fileProperties.get(configName, "pwdMail")
            self.__senderMail   = self.fileProperties.get(configName, "senderMail")


            self.__server = smtplib.SMTP(self.__smtpMail, int(self.__portMail))
            self.__server.ehlo()
            self.__server.starttls()
            self.__server.ehlo()
            self.__server.login(self.__userMail, self.__pwdMail)


    def send(self, mailTo = None, textObject = None, textMail = None):
        sendStatus = True
        try:
            msg = MIMEMultipart()
            msg['From'] = self.__senderMail
            msg['To'] = mailTo
            msg['Subject'] = str(textObject)
            msg.attach(MIMEText(str(textMail), 'plain'))
            multipartMail = msg.as_string()
            self.__server.sendmail(self.__senderMail, mailTo, multipartMail)
        except Exception as e:
            sendStatus = False
        return sendStatus

# if __name__ == '__main__':
#     ml =  MailUtil(fileConf = "mailConf.properties", configName = "no-replay").getInstance()
#     status = ml.send(mailTo = "giuseppe.demartino@par-tec.it", textObject = "test email", textMail = "questa è una email di test")
#     print(status)