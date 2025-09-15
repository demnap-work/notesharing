import logging
import logging.config
import logging.handlers

class log:
    __logger = logging.getLogger(__name__)
    __instance = None
    
    def __init__(self, fileName, appName = 'logFactory'):
        if log.__instance == None:
            log.__instance = self
            log.__logger.setLevel(logging.INFO)

            self.levelLog =	{
                    "CRITICAL":logging.CRITICAL,
                    "ERROR":logging.ERROR,
                    "WARNING":logging.WARNING,	
                    "INFO":logging.INFO,
                    "DEBUG":logging.DEBUG,
                    "NOTSET":logging.NOTSET
                }
                
            self.levelChosen = ""
            self.fileName = fileName+'.log'
            self.appName = appName
            self.handler = logging.FileHandler(self.fileName)
            self.handler.setLevel(logging.INFO)
            self.formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
            self.handler.setFormatter(self.formatter)
            self.logger.addHandler(self.handler)
            LogUtil.__handler = RotatingFileHandler(logFile, mode='a', maxBytes=5*1024*1024, backupCount=10000, encoding=None, delay=0)

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances: 
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
    
    @staticmethod
    def getInstance():
        if log.__instance == None:
            log()
        return log.__instance


    # inizio funzioni LogUtil
    @classmethod
    def write(self, msg, level = 'INFO'):
        levelLocal = level
        if (self.levelChosen!=''):
            levelLocal = self.levelChosen

        self.formatter = logging.Formatter('[%(asctime)s] - '+ levelLocal + ' - ' + self.appName +' - %(message)s')
        self.handler.setFormatter(self.formatter)
        self.logger.info(msg)
    
    @classmethod
    def setLevel(self, level):
        self.levelChosen = level
    