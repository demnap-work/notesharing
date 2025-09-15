import configparser
# from utils.ThrowableExcept import ThrowableExcept
# from ThrowableExcept import ThrowableExcept

class FilePropertiesFactory():
    __istance = None

    def __new__(cls, *args, **kwargs):
        if cls.__istance is None:
            cls.__istance = super(FilePropertiesFactory, cls).__new__(cls)
        return cls.__istance
    
    def __init__(self, fileProp=""):
        self.fileProp = fileProp
        self._config = configparser.ConfigParser(defaults=None, strict=False)
        self._config.read(self.fileProp)

    # @ThrowableExcept(classType="FilePropertiesFactory", method="get")
    def get(self, group, key):
        return self._config.get(group, key)
    
    # @ThrowableExcept(classType="FilePropertiesFactory", method="iniToDict")
    def iniToDict(self, group, key):
        iniDict = {}
        #iniDict[group] = dict(self._config.items(group))
        innerDict = {}
        innerDict[key] = self.get(group, key)
        iniDict[group] = innerDict
        return iniDict
    
    # @ThrowableExcept(classType="FilePropertiesFactory", method="allIniToDict")
    def allIniToDict(self):
        iniDict = {}
        for group in self._config.sections():
            iniDict[group] = dict(self._config.items(group))
        return iniDict