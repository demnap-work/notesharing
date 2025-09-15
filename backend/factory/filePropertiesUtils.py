import configparser

class filePropertiesSingleton():
    __instance = None
    def __init__(self, fileProp):
        
        # if filePropertiesSingleton.__instance == None:
        # filePropertiesSingleton.__instance = self
        self.fileProp = fileProp
        self._config = configparser.ConfigParser(defaults=None, strict=False)
        self._config.read(self.fileProp)

    # def __call__(cls, *args, **kwargs):
    #     if cls not in cls._instances: 
    #         cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
    #     return cls._instances[cls]

    # @staticmethod
    def getInstance():

        # return filePropertiesSingleton.__instance

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
            raise ValueError(msg)



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
            return False