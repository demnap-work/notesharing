import logging, pathlib, logging.config, logging.handlers

class LogUtil():
    __logger = logging.getLogger(__name__)
    __instance = None
    __handler = None
    __formatter = None
    __appName = ''
    __levelLog =	{
        "CRITICAL":logging.CRITICAL,
        "ERROR":logging.ERROR,
        "WARNING":logging.WARNING,	
        "INFO":logging.INFO,
        "DEBUG":logging.DEBUG,
        "NOTSET":logging.NOTSET
    }
    __levelChosen = ''

    @staticmethod
    def getInstance():
        if LogUtil.__instance == None:
            return LogUtil()
        return LogUtil.__instance

    def __init__(self, fileName, appName = 'logFactory'):
        if LogUtil.__instance == None:
            LogUtil.fileName = str(pathlib.Path(__file__).parents[1].absolute())+fileName
            LogUtil.__appName = appName
            LogUtil.__logger.setLevel(logging.INFO)
            LogUtil.__handler = logging.FileHandler(LogUtil.fileName)
            LogUtil.__handler.setLevel(logging.INFO)
            LogUtil.__formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
            LogUtil.__handler.setFormatter(LogUtil.__formatter)
            LogUtil.__logger.addHandler(LogUtil.__handler)
            LogUtil.__instance = self

    @classmethod
    def write(cls, msg, level = 'INFO'):
        levelLocal = level
        if (cls.__levelChosen!=''):
            levelLocal = cls.__levelChosen

        cls.__formatter = logging.Formatter('[%(asctime)s] - '+ levelLocal + ' - %(message)s')
        cls.__handler.setFormatter(cls.__formatter)
        cls.__logger.info(msg)
        cls.__levelChosen = "INFO"
    
    @classmethod
    def setLevel(cls, level):
        cls.__levelChosen = level
    
    @classmethod
    def getLevel(cls):
        return cls.__levelChosen
    
    