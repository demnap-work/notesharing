import logging
import logging.config
import logging.handlers
from logging.handlers import RotatingFileHandler
import sys

class LogUtil():
    __logger        = logging.getLogger(__name__)
    __handler       = None
    __handler2       = None
    __formatter     = None
    __backupCount   = 100
    __delay         = 0
    __bytes         = 1024*1024
    __levelLog      =   {
        "INFO"      : logging.INFO,
        "WARNING"   : logging.WARNING,  
        "DEBUG"     : logging.DEBUG,
        "ERROR"     : logging.ERROR,
        "CRITICAL"     : logging.CRITICAL,
    }
    __stream        = logging.StreamHandler(sys.stdout)

    def __init__(self, logfile, maxDim=10, backupCount=100):
        LogUtil.logfile = logfile
        #LogUtil.logfile2 = logfile2
        LogUtil.__maxDim = maxDim
        LogUtil.__backupCount = backupCount
        LogUtil.__logger.setLevel(logging.INFO)
        # create formatter:
        LogUtil.__formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
        # create handler for the 1st file:
        LogUtil.__handler = logging.FileHandler(LogUtil.logfile)
        LogUtil.__handler = RotatingFileHandler(LogUtil.logfile, mode='a', maxBytes=int(LogUtil.__maxDim)*LogUtil.__bytes, backupCount=LogUtil.__backupCount, encoding=None, delay=LogUtil.__delay)
        LogUtil.__handler.setLevel(logging.INFO)
        LogUtil.__handler.setFormatter(LogUtil.__formatter)
        LogUtil.__logger.addHandler(LogUtil.__handler)
        # stream on console also:
        LogUtil.__stream.setLevel(logging.INFO)
        LogUtil.__stream.setFormatter(LogUtil.__formatter)
        LogUtil.__logger.addHandler(LogUtil.__stream)

    @classmethod
    def add_log_file(cls, logfile_name):
        # create handler for another additional logfile:
        LogUtil.__handler2 = logging.FileHandler(logfile_name)
        LogUtil.__handler2 = RotatingFileHandler(logfile_name, mode='a', maxBytes=int(LogUtil.__maxDim)*LogUtil.__bytes, backupCount=LogUtil.__backupCount, encoding=None, delay=LogUtil.__delay)
        LogUtil.__handler2.setLevel(logging.INFO)
        LogUtil.__handler2.setFormatter(LogUtil.__formatter)
        LogUtil.__logger.addHandler(LogUtil.__handler2)

    @classmethod
    def set_log_level(cls, log_level):
        LogUtil.__level = log_level
        if log_level == "INFO":
            LogUtil.__logger.setLevel(logging.INFO)
            LogUtil.__handler.setLevel(logging.INFO)
            LogUtil.__stream.setLevel(logging.INFO)
        elif log_level == "DEBUG":
            LogUtil.__logger.setLevel(logging.DEBUG)
            LogUtil.__handler.setLevel(logging.DEBUG)
            LogUtil.__stream.setLevel(logging.DEBUG)
        elif log_level == "ERROR":
            LogUtil.__logger.setLevel(logging.ERROR)
            LogUtil.__handler.setLevel(logging.ERROR)
            LogUtil.__stream.setLevel(logging.ERROR)
        elif log_level == "WARNING":
            LogUtil.__logger.setLevel(logging.WARNING)
            LogUtil.__handler.setLevel(logging.WARNING)
            LogUtil.__stream.setLevel(logging.WARNING)
        elif log_level == "CRITICAL":
            LogUtil.__logger.setLevel(logging.CRITICAL)
            LogUtil.__handler.setLevel(logging.CRITICAL)
            LogUtil.__stream.setLevel(logging.CRITICAL)
    
    @classmethod
    def get_log_level(cls): return LogUtil.__level
 
    @classmethod
    def write(cls, msg="", level='INFO'):
        LogUtil.__formatter = logging.Formatter('[%(asctime)s] - '+ level + ' - %(message)s')
        LogUtil.__handler.setFormatter(LogUtil.__formatter)
        if cls.__handler2:
            LogUtil.__handler2.setFormatter(LogUtil.__formatter)
        if level.upper() == "INFO": LogUtil.__logger.info(msg)
        elif level.upper() == "DEBUG": LogUtil.__logger.debug(msg)
        elif level.upper() == "ERROR": LogUtil.__logger.error(msg)
        elif level.upper() == "WARNING": LogUtil.__logger.warning(msg)
        elif level.upper() == "CRITICAL": LogUtil.__logger.critical(msg)


# abilitare il rolling del file log. Quando finisce il file