import logging
import logging.config
import logging.handlers
from utilities.filePropertiesUtils import *

class Singleton (type):
    _instances = None

    def __init__(cls, name, bases, attrs, **kwargs):
        super().__init__(name, bases, attrs)
        cls._instance = None

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

    @classmethod
    def __instancecheck__(mcs, instance):
        return (isinstance(instance.__class__, mcs), True)[instance.__class__ is mcs]
        # if instance.__class__ is mcs:
            # return True
        # else:
            # return isinstance(instance.__class__, mcs)

def singleton_object(cls):
    assert isinstance(cls, Singleton), \
        cls.__name__ + " must use Singleton metaclass"

    def self_instantiate(self): return self
    cls.__call__ = self_instantiate
    cls.__hash__ = lambda self: hash(cls)
    cls.__repr__ = lambda self: cls.__name__
    cls.__reduce__ = lambda self: cls.__name__
    obj = cls()
    obj.__name__ = cls.__name__
    return obj

#@singleton_object    
class LogfactoryBase(metaclass=Singleton):
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
    instance = None
    def __init__(self):
        super().__init__()
        # self.fileName = fileName+'.log'
        # self.__appName = appName
        
        self.fileProperties = filePropertiesSingleton("log.properties")
        self.fileName = self.fileProperties.get("log", "fileName")
        self.maxSizeFile = self.fileProperties.get("log", "sizeFile")
        self.__appName = self.fileProperties.get("log", "appName")

        self.__logger.setLevel(logging.INFO)
        self.__handler = logging.FileHandler(self.fileName)
        self.__handler.setLevel(logging.INFO)
        self.__formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
        self.__handler.setFormatter(self.__formatter)
        self.__logger.addHandler(self.__handler)
        self.__instance = self
 
    def getInstance(cls):
        return (self.__instance, self)[not self.__instance]
    